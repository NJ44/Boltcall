import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://hbwogktdajorojljkjwg.supabase.co';

function getServiceClient() {
  return createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY!);
}

// Delay map: config value -> milliseconds
const DELAY_MAP: Record<string, number> = {
  '1': 1 * 60 * 60 * 1000,
  '3': 3 * 60 * 60 * 1000,
  '24': 24 * 60 * 60 * 1000,
  '48': 48 * 60 * 60 * 1000,
  '72': 72 * 60 * 60 * 1000,
  '168': 7 * 24 * 60 * 60 * 1000,
};

function substituteVars(template: string, vars: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  }
  return result;
}

function formatDate(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function formatTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export const handler: Handler = async (event) => {
  // Only accept POST from Cal.com webhooks
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const supabase = getServiceClient();

  try {
    const body = JSON.parse(event.body || '{}');
    const triggerEvent = body.triggerEvent as string;
    const payload = body.payload;

    if (!triggerEvent || !payload) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid webhook payload' }) };
    }

    console.log(`[appointment-handler] Received ${triggerEvent}`, JSON.stringify(payload).slice(0, 500));

    // Look up user by organizer email
    const organizerEmail = payload.organizer?.email;
    if (!organizerEmail) {
      return { statusCode: 400, body: JSON.stringify({ error: 'No organizer email in payload' }) };
    }

    // Find user by organizer email — query auth.users via service role
    let userId: string | null = null;
    try {
      const { data: authUsers } = await supabase.auth.admin.listUsers({ perPage: 1000 });
      const matched = authUsers?.users?.find(
        (u) => u.email?.toLowerCase() === organizerEmail.toLowerCase()
      );
      userId = matched?.id || null;
    } catch (e) {
      console.error('[appointment-handler] admin.listUsers failed, trying locations table:', e);
      // Fallback: check locations table for email match
      const { data: locRows } = await supabase
        .from('locations')
        .select('user_id')
        .ilike('email', organizerEmail)
        .limit(1);
      userId = locRows?.[0]?.user_id || null;
    }

    // Fallback: check business_features where cal_api_key is stored (the user who connected Cal.com)
    if (!userId) {
      const { data: bfRows } = await supabase
        .from('business_features')
        .select('user_id, reminders_config')
        .not('reminders_config', 'is', null);

      if (bfRows) {
        for (const row of bfRows) {
          const cfg = row.reminders_config as Record<string, any>;
          if (cfg?.cal_connected) {
            userId = row.user_id;
            break;
          }
        }
      }
    }

    if (!userId) {
      console.error('[appointment-handler] Could not resolve user for organizer:', organizerEmail);
      return { statusCode: 404, body: JSON.stringify({ error: 'User not found for organizer email' }) };
    }

    // Get user's workspace_id
    const { data: bpRow } = await supabase
      .from('business_profiles')
      .select('workspace_id, business_name')
      .eq('user_id', userId)
      .single();

    const workspaceId = bpRow?.workspace_id;
    const businessName = bpRow?.business_name || '';

    if (!workspaceId) {
      console.error('[appointment-handler] No workspace found for user:', userId);
      return { statusCode: 404, body: JSON.stringify({ error: 'No workspace found for user' }) };
    }

    const attendee = payload.attendees?.[0] || {};
    const attendeeName = attendee.name || 'Customer';
    const attendeeEmail = attendee.email || '';
    const attendeePhone = attendee.phone || attendee.phoneNumber || '';
    const startTime = payload.startTime;
    const endTime = payload.endTime;
    const eventTitle = payload.title || '';
    const bookingId = String(payload.bookingId || payload.uid || '');

    // ─── BOOKING_CREATED ──────────────────────────────────────────────
    if (triggerEvent === 'BOOKING_CREATED') {
      // 1. Insert appointment
      const { data: appt, error: apptError } = await supabase
        .from('appointments')
        .insert({
          user_id: userId,
          workspace_id: workspaceId,
          cal_booking_id: bookingId,
          cal_event_type: eventTitle,
          client_name: attendeeName,
          client_email: attendeeEmail,
          client_phone: attendeePhone,
          service_name: eventTitle,
          starts_at: startTime,
          ends_at: endTime,
          timezone: payload.organizer?.timeZone || 'UTC',
          status: 'scheduled',
          raw_webhook: body,
        })
        .select('id')
        .single();

      if (apptError) {
        console.error('[appointment-handler] Failed to insert appointment:', apptError);
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to create appointment', details: apptError.message }) };
      }

      const appointmentId = appt.id;
      const messagesToInsert: any[] = [];

      // 2. Check reminders config
      const { data: bf } = await supabase
        .from('business_features')
        .select('reminders_enabled, reminders_config, reputation_manager_config')
        .eq('user_id', userId)
        .single();

      const remindersConfig = (bf?.reminders_config || {}) as Record<string, any>;
      const reputationConfig = (bf?.reputation_manager_config || {}) as Record<string, any>;

      // Schedule reminder SMS
      if (bf?.reminders_enabled && remindersConfig.sms_enabled && attendeePhone) {
        const template = remindersConfig.template || 'Hi {{client_name}}, reminder about your appointment on {{appointment_date}} at {{appointment_time}}.';
        const delayHours = remindersConfig.time || '24';
        const delayMs = DELAY_MAP[delayHours] || DELAY_MAP['24'];

        const scheduledFor = new Date(new Date(startTime).getTime() - delayMs);

        // Only schedule if the reminder time is in the future
        if (scheduledFor.getTime() > Date.now()) {
          const messageBody = substituteVars(template, {
            client_name: attendeeName,
            service: eventTitle,
            appointment_date: formatDate(startTime),
            appointment_time: formatTime(startTime),
          });

          messagesToInsert.push({
            user_id: userId,
            appointment_id: appointmentId,
            type: 'reminder',
            channel: 'sms',
            recipient_phone: attendeePhone,
            recipient_email: attendeeEmail,
            message_body: messageBody,
            scheduled_for: scheduledFor.toISOString(),
            status: 'scheduled',
          });
        }
      }

      // Schedule review request SMS
      if (reputationConfig.sms_enabled && attendeePhone) {
        const template = reputationConfig.sms_template || 'Hi {{client_name}}, thanks for visiting {{business_name}}! We\'d love your feedback: {{review_url}}';
        const delayHours = reputationConfig.sms_delay || '24';
        const delayMs = DELAY_MAP[delayHours] || DELAY_MAP['24'];

        const scheduledFor = new Date(new Date(endTime || startTime).getTime() + delayMs);

        const messageBody = substituteVars(template, {
          client_name: attendeeName,
          business_name: businessName,
          review_url: reputationConfig.google_review_url || '',
        });

        messagesToInsert.push({
          user_id: userId,
          appointment_id: appointmentId,
          type: 'review_request',
          channel: 'sms',
          recipient_phone: attendeePhone,
          recipient_email: attendeeEmail,
          message_body: messageBody,
          scheduled_for: scheduledFor.toISOString(),
          status: 'scheduled',
        });
      }

      // Insert all scheduled messages
      if (messagesToInsert.length > 0) {
        const { error: msgError } = await supabase
          .from('scheduled_messages')
          .insert(messagesToInsert);

        if (msgError) {
          console.error('[appointment-handler] Failed to insert scheduled messages:', msgError);
          // Non-fatal — appointment was created successfully
        }
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          appointment_id: appointmentId,
          messages_scheduled: messagesToInsert.length,
        }),
      };
    }

    // ─── BOOKING_CANCELLED ────────────────────────────────────────────
    if (triggerEvent === 'BOOKING_CANCELLED') {
      // Update appointment status
      const { error: apptErr } = await supabase
        .from('appointments')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('cal_booking_id', bookingId)
        .eq('user_id', userId);

      if (apptErr) {
        console.error('[appointment-handler] Failed to cancel appointment:', apptErr);
      }

      // Find the appointment ID to cancel messages
      const { data: apptRow } = await supabase
        .from('appointments')
        .select('id')
        .eq('cal_booking_id', bookingId)
        .eq('user_id', userId)
        .single();

      if (apptRow) {
        const { error: msgErr } = await supabase
          .from('scheduled_messages')
          .update({ status: 'cancelled' })
          .eq('appointment_id', apptRow.id)
          .eq('status', 'scheduled');

        if (msgErr) {
          console.error('[appointment-handler] Failed to cancel scheduled messages:', msgErr);
        }
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, action: 'cancelled' }),
      };
    }

    // ─── BOOKING_RESCHEDULED ──────────────────────────────────────────
    if (triggerEvent === 'BOOKING_RESCHEDULED') {
      // Update appointment times
      const { error: apptErr } = await supabase
        .from('appointments')
        .update({
          starts_at: startTime,
          ends_at: endTime,
          status: 'scheduled',
          raw_webhook: body,
          updated_at: new Date().toISOString(),
        })
        .eq('cal_booking_id', bookingId)
        .eq('user_id', userId);

      if (apptErr) {
        console.error('[appointment-handler] Failed to update rescheduled appointment:', apptErr);
      }

      // Find appointment to update messages
      const { data: apptRow } = await supabase
        .from('appointments')
        .select('id')
        .eq('cal_booking_id', bookingId)
        .eq('user_id', userId)
        .single();

      if (apptRow) {
        // Get existing scheduled messages to recalculate times
        const { data: existingMsgs } = await supabase
          .from('scheduled_messages')
          .select('id, type')
          .eq('appointment_id', apptRow.id)
          .eq('status', 'scheduled');

        if (existingMsgs) {
          // Get user's config to recalculate delays
          const { data: bf } = await supabase
            .from('business_features')
            .select('reminders_config, reputation_manager_config')
            .eq('user_id', userId)
            .single();

          const remindersConfig = (bf?.reminders_config || {}) as Record<string, any>;
          const reputationConfig = (bf?.reputation_manager_config || {}) as Record<string, any>;

          for (const msg of existingMsgs) {
            let newScheduledFor: string;

            if (msg.type === 'reminder') {
              const delayHours = remindersConfig.time || '24';
              const delayMs = DELAY_MAP[delayHours] || DELAY_MAP['24'];
              newScheduledFor = new Date(new Date(startTime).getTime() - delayMs).toISOString();
            } else {
              // review_request
              const delayHours = reputationConfig.sms_delay || '24';
              const delayMs = DELAY_MAP[delayHours] || DELAY_MAP['24'];
              newScheduledFor = new Date(new Date(endTime || startTime).getTime() + delayMs).toISOString();
            }

            // If the new scheduled time is in the past, cancel the message
            if (new Date(newScheduledFor).getTime() <= Date.now()) {
              await supabase
                .from('scheduled_messages')
                .update({ status: 'cancelled' })
                .eq('id', msg.id);
            } else {
              await supabase
                .from('scheduled_messages')
                .update({ scheduled_for: newScheduledFor })
                .eq('id', msg.id);
            }
          }
        }
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, action: 'rescheduled' }),
      };
    }

    // Unknown event type — acknowledge but do nothing
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, action: 'ignored', event: triggerEvent }),
    };
  } catch (err: any) {
    console.error('[appointment-handler] Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Internal server error' }),
    };
  }
};
