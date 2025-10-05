import React, { useState, useEffect } from 'react';

const VoiceLibraryTest: React.FC = () => {
  const [voices, setVoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('VoiceLibraryTest: Component mounted');
    const fetchVoices = async () => {
      setLoading(true);
      console.log('VoiceLibraryTest: Starting to load voices...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockVoices = [
        {
          id: "1",
          display_name: "Sarah - Professional",
          provider: "ElevenLabs",
          language: "English",
          gender: "female",
          style_tags: ["professional", "friendly", "clear"],
          sample_rate_hz: 22050,
          supports_realtime: true,
          price_per_min_usd: 0.18,
          provider_voice_id: "sarah_pro"
        },
        {
          id: "2",
          display_name: "David - Conversational",
          provider: "Azure",
          language: "English",
          gender: "male",
          style_tags: ["conversational", "warm", "natural"],
          sample_rate_hz: 16000,
          supports_realtime: false,
          price_per_min_usd: 0.15,
          provider_voice_id: "david_conv"
        }
      ];
      
      console.log('VoiceLibraryTest: Setting voices:', mockVoices);
      setVoices(mockVoices);
      setLoading(false);
      console.log('VoiceLibraryTest: Loading complete');
    };

    fetchVoices();
  }, []);

  console.log('VoiceLibraryTest: Render - loading:', loading, 'voices:', voices);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Voice Library Test</h2>
      
      {loading ? (
        <div>Loading voices...</div>
      ) : (
        <div>
          <p>Found {voices.length} voices</p>
          <div className="grid grid-cols-1 gap-4 mt-4">
            {voices.map(voice => (
              <div key={voice.id} className="border p-4 rounded">
                <h3 className="font-medium">{voice.display_name}</h3>
                <p className="text-sm text-gray-600">{voice.provider} • {voice.language}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceLibraryTest;
