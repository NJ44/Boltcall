// Direct Supabase Insert - Simple Version
// Make sure your .env file has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.log('Make sure you have:');
  console.log('VITE_SUPABASE_URL=your_supabase_url');
  console.log('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertData() {
  console.log('🚀 Connecting to your Supabase database...');
  console.log('URL:', supabaseUrl);
  
  try {
    // Test connection
    const { data: testData, error: testError } = await supabase
      .from('voices')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ Connection failed:', testError.message);
      return;
    }

    console.log('✅ Connected to Supabase successfully!');

    // Insert sample voice
    console.log('\n📢 Inserting sample voice...');
    const { data: voice, error: voiceError } = await supabase
      .from('voices')
      .insert([{
        id: 'sample-voice-' + Date.now(),
        name: 'Test Voice',
        accent: 'American',
        gender: 'Male',
        preview_audio_url: 'https://example.com/test.mp3',
        provider: 'retell',
        is_active: true
      }])
      .select()
      .single();

    if (voiceError) {
      console.log('⚠️ Voice insert result:', voiceError.message);
    } else {
      console.log('✅ Voice inserted successfully:', voice.name);
    }

    // Insert sample workspace
    console.log('\n🏢 Inserting sample workspace...');
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .insert([{
        name: 'Test Business ' + Date.now(),
        slug: 'test-business-' + Date.now(),
        user_id: '00000000-0000-0000-0000-000000000000' // You'll need a real user ID
      }])
      .select()
      .single();

    if (workspaceError) {
      console.log('⚠️ Workspace insert result:', workspaceError.message);
    } else {
      console.log('✅ Workspace inserted successfully:', workspace.name);
    }

    console.log('\n🎉 Data insertion completed!');
    console.log('Check your Supabase dashboard to see the new rows.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the function
insertData();
