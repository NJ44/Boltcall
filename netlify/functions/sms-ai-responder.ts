import { Handler } from '@netlify/functions';
import { getSupabase, deductTokens, TOKEN_COSTS } from './_shared/token-utils';
import { notifyError, notifyInfo } from './_shared/notify';

/**
 * SMS AI Responder — Generates AI-powered responses for inbound SMS.
 *
 * Triggered by twilio-inbound-sms after storing the message, OR
 * called directly from the dashboard to generate/regenerate drafts.
 *
 * Pipeline:
 *   1. Load conversation history (thread)
 *   2. Load business profile + SMS settings
 *   3. Check if lead exists; create if new
 *   4. Call Claude to: understand intent, qualify lead, generate reply
 *   5. If booking intent detected → check Cal.com availability → offer slots
 *   6. Store AI draft in sms_conversations
 *   7. If auto_reply enabled → send via Twilio immediately
 *   8. Deduct tokens
 *
 * POST /.netlify/functions/sms-ai-responder
 * {
 *   messageId: string,       // sms_conversations.id of the inbound message
 *   userId: string,          // owner user ID
 *   action?: 'generate' | 'regenerate' | 'approve' | 'reject'
 * }
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const SMS_AI_TOKEN_COST = 8;

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body: any;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { messageId, userId, action = 'generate' } = body;
  if (!messageId || !userId) {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'messageId and userId required' }) };
  }

  const supabase = getSupabase();

  try {
    // ─── Handle approve/reject actions ──────────────────────────────
    if (action === 'approve') {
      return await handleApprove(supabase, messageId, userId);
    }
    if (action === 'reject') {
      await supabase
        .from('sms_conversations')
        .update({ ai_draft_status: 'rejected' })
        .eq('id', messageId);
      return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ success: true, status: 'rejected' }) };
    }

    // ─── 1. Fetch the inbound message ───────────────────────────────
    const { data: message, error: msgErr } = await supabase
      .from('sms_conversations')
      .select('*')
      .eq('id', messageId)
      .single();

    if (msgErr || !message) {
      return { statusCode: 404, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Message not found' }) };
    }

    // Skip if already has a draft (unless regenerating)
    if (action !== 'regenerate' && message.ai_draft_status) {
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: 'Draft already exists', status: message.ai_draft_status }),
      };
    }

    // ─── 2. Build thread ID and fetch conversation history ──────────
    const threadId = buildThreadId(message.from_number, message.to_number);

    // Update thread_id on message if not set
    if (!message.thread_id) {
      await supabase
        .from('sms_conversations')
        .update({ thread_id: threadId })
        .eq('id', messageId);
    }

    const { data: history } = await supabase
      .from('sms_conversations')
      .select('direction, from_number, body, created_at, qualification')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true })
      .limit(20);

    // ─── 3. Load SMS settings ───────────────────────────────────────
    const { data: settings } = await supabase
      .from('sms_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    const smsSettings = settings || {
      auto_reply_enabled: false,
      response_tone: 'professional',
      qualification_enabled: true,
      booking_enabled: true,
      business_hours_only: false,
      max_ai_messages_per_conversation: 10,
    };

    // Check if we've exceeded max AI messages for this thread
    const aiMessageCount = (history || []).filter(h => h.direction === 'outbound' && h.qualification).length;
    if (aiMessageCount >= smsSettings.max_ai_messages_per_conversation) {
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: 'Max AI messages reached for this conversation', skipped: true }),
      };
    }

    // ─── 4. Load business profile ───────────────────────────────────
    const { data: businessProfile } = await supabase
      .from('business_profiles')
      .select('business_name, website_url, main_category, service_areas, opening_hours, languages')
      .eq('user_id', userId)
      .maybeSingle();

    // ─── 5. Check for existing lead or create one ───────────────────
    let leadId = message.lead_id;
    let leadContext = '';

    const { data: existingLead } = await supabase
      .from('leads')
      .select('id, name, email, phone, source, status, tags, score')
      .eq('user_id', userId)
      .eq('phone', message.from_number)
      .maybeSingle();

    if (existingLead) {
      leadId = existingLead.id;
      leadContext = `Existing lead: ${existingLead.name || 'Unknown'} (${existingLead.email || 'no email'}), status: ${existingLead.status}, score: ${existingLead.score || 'unscored'}`;
    }

    // ─── 6. Check Cal.com availability if booking enabled ───────────
    let availabilityContext = '';
    if (smsSettings.booking_enabled && smsSettings.calcom_event_slug) {
      availabilityContext = await getCalcomAvailability(smsSettings.calcom_event_slug);
    }

    // ─── 7. Build Claude prompt ─────────────────────────────────────
    const biz = businessProfile;
    const bizContext = biz
      ? `Business: ${biz.business_name || 'Unknown'}
Category: ${biz.main_category || 'General'}
Website: ${biz.website_url || 'N/A'}
Hours: ${biz.opening_hours || 'Not specified'}
Service areas: ${Array.isArray(biz.service_areas) ? biz.service_areas.join(', ') : biz.service_areas || 'Not specified'}`
      : 'Business profile not configured.';

    const conversationText = (history || [])
      .map(h => {
        const dir = h.direction === 'inbound' ? 'CUSTOMER' : 'BUSINESS';
        return `[${dir}] ${h.body}`;
      })
      .join('\n');

    const systemPrompt = `You are an AI SMS assistant for a local business. You handle inbound text messages: answering questions, qualifying leads, and booking appointments.

${bizContext}
${leadContext ? `\n${leadContext}` : ''}
${availabilityContext ? `\nAvailable appointment slots:\n${availabilityContext}` : ''}

RESPONSE RULES:
- Tone: ${smsSettings.response_tone}
- Keep responses SHORT — this is SMS, not email. 1-3 sentences max.
- Be warm, helpful, and direct
- Never fabricate pricing, availability, or details you don't know
- If you don't know something specific, say "Let me check and get back to you" or direct them to the website/phone
- Sign as the business (never mention AI)
- No markdown, no formatting — plain SMS text only
${smsSettings.booking_enabled ? '- If the customer wants to book, suggest available times from the slots provided' : '- Do NOT offer to book appointments'}

You must also analyze the customer message and return a JSON qualification object.

RESPOND IN THIS EXACT JSON FORMAT:
{
  "reply": "Your SMS response text here",
  "qualification": {
    "intent": "booking|inquiry|complaint|followup|spam|other",
    "score": 0-100,
    "reason": "Brief reason for score",
    "suggested_action": "book|respond|escalate|ignore"
  }${smsSettings.booking_enabled ? `,
  "booking": {
    "wants_to_book": true/false,
    "suggested_slot": "ISO datetime if applicable, or null",
    "service_requested": "what they want to book for, or null"
  }` : ''}
}`;

    const userPrompt = `SMS conversation so far:
${conversationText}

Generate a reply to the latest customer message and qualify the lead.`;

    // ─── 8. Call Claude API ─────────────────────────────────────────
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicKey) {
      return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }) };
    }

    const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error('[sms-ai-responder] Claude API error:', errText);
      return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'AI generation failed' }) };
    }

    const aiData = await aiRes.json();
    const rawResponse = aiData.content?.[0]?.text || '';

    // Parse the JSON response from Claude
    let parsed: any;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawResponse);
    } catch {
      // Fallback: treat entire response as plain reply
      parsed = {
        reply: rawResponse.replace(/```[\s\S]*?```/g, '').trim(),
        qualification: { intent: 'other', score: 50, reason: 'Could not parse AI response', suggested_action: 'respond' },
      };
    }

    const replyText = parsed.reply || '';
    const qualification = parsed.qualification || { intent: 'other', score: 50, reason: 'Unknown', suggested_action: 'respond' };
    const booking = parsed.booking || null;

    // ─── 9. Store AI draft ──────────────────────────────────────────
    const draftStatus = smsSettings.auto_reply_enabled ? 'auto_sent' : 'pending';

    await supabase
      .from('sms_conversations')
      .update({
        ai_draft: replyText,
        ai_draft_status: draftStatus,
        qualification,
        thread_id: threadId,
        lead_id: leadId,
      })
      .eq('id', messageId);

    // ─── 10. Create or update lead record ───────────────────────────
    if (!existingLead && qualification.score >= 30) {
      const { data: newLead } = await supabase
        .from('leads')
        .insert({
          user_id: userId,
          phone: message.from_number,
          source: 'sms',
          status: qualification.intent === 'booking' ? 'hot' : 'new',
          score: qualification.score,
          tags: [qualification.intent],
        })
        .select('id')
        .single();

      if (newLead) {
        leadId = newLead.id;
        await supabase
          .from('sms_conversations')
          .update({ lead_id: leadId })
          .eq('id', messageId);
      }
    } else if (existingLead) {
      // Update lead score if this one is higher
      if (qualification.score > (existingLead.score || 0)) {
        await supabase
          .from('leads')
          .update({
            score: qualification.score,
            status: qualification.intent === 'booking' ? 'hot' : existingLead.status,
          })
          .eq('id', existingLead.id);
      }
    }

    // ─── 11. If auto-reply, send via Twilio now ─────────────────────
    if (smsSettings.auto_reply_enabled && replyText) {
      const sendResult = await sendTwilioSms(message.to_number, message.from_number, replyText);

      if (sendResult.success) {
        // Record the outbound message
        await supabase.from('sms_conversations').insert({
          user_id: userId,
          workspace_id: message.workspace_id,
          direction: 'outbound',
          from_number: message.to_number,
          to_number: message.from_number,
          body: replyText,
          twilio_sid: sendResult.sid,
          status: 'sent',
          thread_id: threadId,
          lead_id: leadId,
          qualification,
        });

        // Mark inbound message as responded
        await supabase
          .from('sms_conversations')
          .update({ ai_responded_at: new Date().toISOString(), ai_draft_status: 'auto_sent' })
          .eq('id', messageId);

        // Deduct tokens
        await deductTokens(userId, SMS_AI_TOKEN_COST + TOKEN_COSTS.sms_sent, 'sms_sent', `AI SMS reply to ${message.from_number}`, {
          message_id: messageId,
          thread_id: threadId,
        });

        // Notify owner
        await notifyInfo(`📱 *SMS Auto\\-Reply Sent*\nTo: ${message.from_number}\nIntent: ${qualification.intent} (${qualification.score}/100)\nReply: ${replyText.slice(0, 100)}`);
      } else {
        console.error('[sms-ai-responder] Failed to send SMS:', sendResult.error);
        await supabase
          .from('sms_conversations')
          .update({ ai_draft_status: 'pending' })
          .eq('id', messageId);
      }
    } else {
      // Draft mode — just deduct AI generation tokens
      await deductTokens(userId, SMS_AI_TOKEN_COST, 'sms_sent', `AI SMS draft for ${message.from_number}`, {
        message_id: messageId,
        thread_id: threadId,
      });

      // Notify owner about pending draft
      if (qualification.intent === 'booking' || qualification.score >= 70) {
        await notifyInfo(`📱 *Hot SMS Lead \\- Draft Ready*\nFrom: ${message.from_number}\nIntent: ${qualification.intent} (${qualification.score}/100)\nMessage: ${message.body.slice(0, 100)}\nDraft: ${replyText.slice(0, 100)}`);
      }
    }

    // ─── 12. Handle booking if detected ─────────────────────────────
    if (booking?.wants_to_book && smsSettings.booking_enabled && smsSettings.calcom_event_slug && booking.suggested_slot) {
      // Store booking intent for the dashboard to action
      await supabase
        .from('sms_conversations')
        .update({
          qualification: {
            ...qualification,
            booking_intent: true,
            suggested_slot: booking.suggested_slot,
            service_requested: booking.service_requested,
          },
        })
        .eq('id', messageId);
    }

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: true,
        draftStatus,
        reply: replyText,
        qualification,
        booking: booking || null,
        messageId,
        threadId,
      }),
    };
  } catch (error) {
    console.error('[sms-ai-responder] Error:', error);
    await notifyError('sms-ai-responder', error as Error, { messageId, userId });
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

// ─── Helper: Approve a draft and send it ──────────────────────────────

async function handleApprove(supabase: any, messageId: string, userId: string) {
  const { data: msg } = await supabase
    .from('sms_conversations')
    .select('*')
    .eq('id', messageId)
    .single();

  if (!msg || !msg.ai_draft) {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'No draft to approve' }) };
  }

  const sendResult = await sendTwilioSms(msg.to_number, msg.from_number, msg.ai_draft);

  if (!sendResult.success) {
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Failed to send SMS' }) };
  }

  const threadId = msg.thread_id || buildThreadId(msg.from_number, msg.to_number);

  // Record outbound
  await supabase.from('sms_conversations').insert({
    user_id: userId,
    workspace_id: msg.workspace_id,
    direction: 'outbound',
    from_number: msg.to_number,
    to_number: msg.from_number,
    body: msg.ai_draft,
    twilio_sid: sendResult.sid,
    status: 'sent',
    thread_id: threadId,
    lead_id: msg.lead_id,
  });

  // Update draft status
  await supabase
    .from('sms_conversations')
    .update({ ai_draft_status: 'approved', ai_responded_at: new Date().toISOString() })
    .eq('id', messageId);

  // Deduct send tokens
  await deductTokens(userId, TOKEN_COSTS.sms_sent, 'sms_sent', `Approved SMS to ${msg.from_number}`, {
    message_id: messageId,
  });

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({ success: true, status: 'approved', sid: sendResult.sid }),
  };
}

// ─── Helper: Send SMS via Twilio ──────────────────────────────────────

async function sendTwilioSms(from: string, to: string, message: string): Promise<{ success: boolean; sid?: string; error?: string }> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    return { success: false, error: 'Twilio credentials not configured' };
  }

  try {
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ From: from, To: to, Body: message }).toString(),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.message || `Twilio error: ${res.status}` };
    }

    return { success: true, sid: data.sid };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ─── Helper: Build thread ID from phone numbers ──────────────────────

function buildThreadId(phone1: string, phone2: string): string {
  const sorted = [phone1, phone2].sort();
  return `${sorted[0]}_${sorted[1]}`;
}

// ─── Helper: Get Cal.com availability ─────────────────────────────────

async function getCalcomAvailability(eventSlug: string): Promise<string> {
  const calcomApiKey = process.env.CALCOM_API_KEY;
  if (!calcomApiKey) return '';

  try {
    const now = new Date();
    const endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Next 7 days

    const params = new URLSearchParams({
      apiKey: calcomApiKey,
      dateFrom: now.toISOString(),
      dateTo: endDate.toISOString(),
      eventTypeSlug: eventSlug,
    });

    const res = await fetch(`https://api.cal.com/v1/availability?${params.toString()}`);
    if (!res.ok) return '';

    const data = await res.json();
    const slots = data.slots || {};

    // Format available slots for Claude
    const slotLines: string[] = [];
    for (const [date, times] of Object.entries(slots)) {
      if (Array.isArray(times) && times.length > 0) {
        const timeStrs = times.slice(0, 4).map((t: any) => {
          const d = new Date(t.time || t);
          return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        });
        slotLines.push(`${date}: ${timeStrs.join(', ')}`);
      }
    }

    return slotLines.length > 0
      ? slotLines.slice(0, 5).join('\n')
      : 'No available slots in the next 7 days.';
  } catch (err) {
    console.error('[sms-ai-responder] Cal.com availability error:', err);
    return '';
  }
}
