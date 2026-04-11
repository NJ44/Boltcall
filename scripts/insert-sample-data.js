// Direct Supabase Database Insert Script
// Run this with: node insert-sample-data.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertSampleData() {
  try {
    console.log('🚀 Starting to insert sample data into Supabase...');

    // 1. Insert a sample voice
    console.log('📢 Inserting sample voice...');
    const { data: voice, error: voiceError } = await supabase
      .from('voices')
      .insert([{
        id: 'sample-voice-001',
        name: 'Sample Voice',
        accent: 'American',
        gender: 'Male',
        preview_audio_url: 'https://example.com/sample.mp3',
        provider: 'retell',
        is_active: true
      }])
      .select()
      .single();

    if (voiceError) {
      console.log('⚠️ Voice already exists or error:', voiceError.message);
    } else {
      console.log('✅ Voice inserted:', voice.name);
    }

    // 2. Insert a sample workspace (you'll need a real user_id)
    console.log('🏢 Inserting sample workspace...');
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .insert([{
        name: 'Sample Business',
        slug: 'sample-business-' + Date.now(),
        user_id: '00000000-0000-0000-0000-000000000000' // Replace with real user ID
      }])
      .select()
      .single();

    if (workspaceError) {
      console.log('⚠️ Workspace error:', workspaceError.message);
    } else {
      console.log('✅ Workspace inserted:', workspace.name);

      // 3. Insert a sample business profile
      console.log('👤 Inserting sample business profile...');
      const { data: businessProfile, error: profileError } = await supabase
        .from('business_profiles')
        .insert([{
          workspace_id: workspace.id,
          user_id: workspace.user_id,
          business_name: 'Sample Dental Clinic',
          website_url: 'https://sampledental.com',
          main_category: 'Healthcare',
          country: 'United States',
          service_areas: ['New York', 'Brooklyn'],
          opening_hours: {
            monday: { open: '09:00', close: '17:00', closed: false },
            tuesday: { open: '09:00', close: '17:00', closed: false }
          },
          languages: ['English', 'Spanish']
        }])
        .select()
        .single();

      if (profileError) {
        console.log('⚠️ Business profile error:', profileError.message);
      } else {
        console.log('✅ Business profile inserted:', businessProfile.business_name);

        // 4. Insert a sample address
        console.log('📍 Inserting sample address...');
        const { data: address, error: addressError } = await supabase
          .from('addresses')
          .insert([{
            business_profile_id: businessProfile.id,
            user_id: businessProfile.user_id,
            workspace_id: businessProfile.workspace_id,
            address_type: 'primary',
            line1: '123 Main Street',
            line2: 'Suite 100',
            city: 'New York',
            state_province: 'NY',
            postal_code: '10001',
            country: 'United States',
            is_primary: true,
            is_active: true
          }])
          .select()
          .single();

        if (addressError) {
          console.log('⚠️ Address error:', addressError.message);
        } else {
          console.log('✅ Address inserted:', address.line1);
        }

        // 5. Insert a sample phone number
        console.log('📞 Inserting sample phone number...');
        const { data: phoneNumber, error: phoneError } = await supabase
          .from('phone_numbers')
          .insert([{
            business_profile_id: businessProfile.id,
            user_id: businessProfile.user_id,
            workspace_id: businessProfile.workspace_id,
            phone_number: '+1 (555) 123-4567',
            phone_type: 'main',
            location: 'New York, NY',
            country_code: '+1',
            area_code: '555',
            status: 'active',
            is_primary: true,
            is_active: true,
            monthly_cost: 15.00,
            provider: 'Twilio'
          }])
          .select()
          .single();

        if (phoneError) {
          console.log('⚠️ Phone number error:', phoneError.message);
        } else {
          console.log('✅ Phone number inserted:', phoneNumber.phone_number);
        }

        // 6. Insert a sample website widget
        console.log('🌐 Inserting sample website widget...');
        const { data: widget, error: widgetError } = await supabase
          .from('website_widgets')
          .insert([{
            business_profile_id: businessProfile.id,
            user_id: businessProfile.user_id,
            workspace_id: businessProfile.workspace_id,
            widget_name: 'AI Assistant',
            widget_color: '#3B82F6',
            bot_name: 'AI Assistant',
            popup_message: 'Hi! How can I help you today?',
            show_ai_popup: true,
            show_ai_popup_time: 5,
            auto_open: false,
            widget_position: 'bottom-right',
            widget_size: 'medium',
            theme: 'light',
            language: 'en',
            is_active: true,
            is_public: false
          }])
          .select()
          .single();

        if (widgetError) {
          console.log('⚠️ Website widget error:', widgetError.message);
        } else {
          console.log('✅ Website widget inserted:', widget.widget_name);
        }
      }
    }

    // 7. Insert a sample Retell LLM
    console.log('🤖 Inserting sample Retell LLM...');
    const { data: llm, error: llmError } = await supabase
      .from('retell_llms')
      .insert([{
        user_id: '00000000-0000-0000-0000-000000000000', // Replace with real user ID
        workspace_id: workspace?.id || '00000000-0000-0000-0000-000000000000',
        name: 'Sample Dental Assistant',
        description: 'AI assistant for dental clinics',
        industry: 'dentist',
        llm_config: {
          model: 'gpt-4',
          temperature: 0.7,
          max_tokens: 500,
          system_prompt: 'You are a friendly dental assistant AI.',
          industry_context: {
            business_type: 'Dental Clinic',
            services: ['Check-ups', 'Cleanings', 'Fillings'],
            target_audience: 'Dental patients',
            tone: 'friendly',
            language: 'English'
          }
        },
        voice_id: voice?.id,
        is_active: true,
        is_public: false,
        usage_count: 0
      }])
      .select()
      .single();

    if (llmError) {
      console.log('⚠️ Retell LLM error:', llmError.message);
    } else {
      console.log('✅ Retell LLM inserted:', llm.name);
    }

    console.log('🎉 Sample data insertion completed!');
    console.log('\n📊 Summary:');
    console.log('- Voice:', voice?.name || 'Already exists');
    console.log('- Workspace:', workspace?.name || 'Error');
    console.log('- Business Profile:', businessProfile?.business_name || 'Error');
    console.log('- Address:', address?.line1 || 'Error');
    console.log('- Phone Number:', phoneNumber?.phone_number || 'Error');
    console.log('- Website Widget:', widget?.widget_name || 'Error');
    console.log('- Retell LLM:', llm?.name || 'Error');

  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
  }
}

// Run the script
insertSampleData();
