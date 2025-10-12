import React, { useState, useEffect } from 'react';
import { Loader2, Play, Pause, Volume2, Check, Search, Library, Headphones } from "lucide-react";
import Button from "../ui/Button";
import { Input } from "../ui/input";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";

interface Voice {
  id: string;
  display_name: string;
  provider: string;
  language: string;
  gender?: string;
  style_tags?: string[];
  sample_rate_hz: number;
  supports_realtime: boolean;
  price_per_min_usd?: number;
  provider_voice_id: string;
}

interface VoiceLibraryProps {
  agentId?: string;
}

const VoiceLibrary: React.FC<VoiceLibraryProps> = ({ agentId }) => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [provider, setProvider] = useState("all");
  const [lang, setLang] = useState("all");
  const [realtimeOnly, setRealtimeOnly] = useState(false);
  const [testText, setTestText] = useState("Hello! This is a preview of how I sound. How can I help you today?");
  const [volume, setVolume] = useState(80);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  // Mock data for demonstration
  const mockVoices: Voice[] = [
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
    },
    {
      id: "3",
      display_name: "Emma - Medical",
      provider: "OpenAI",
      language: "English",
      gender: "female",
      style_tags: ["medical", "professional", "calm"],
      sample_rate_hz: 24000,
      supports_realtime: true,
      price_per_min_usd: 0.20,
      provider_voice_id: "emma_medical"
    },
    {
      id: "4",
      display_name: "James - Technical",
      provider: "PlayHT",
      language: "English",
      gender: "male",
      style_tags: ["technical", "precise", "authoritative"],
      sample_rate_hz: 22050,
      supports_realtime: false,
      price_per_min_usd: 0.12,
      provider_voice_id: "james_tech"
    },
    {
      id: "5",
      display_name: "Maria - Spanish",
      provider: "ElevenLabs",
      language: "Spanish",
      gender: "female",
      style_tags: ["friendly", "warm", "bilingual"],
      sample_rate_hz: 22050,
      supports_realtime: true,
      price_per_min_usd: 0.18,
      provider_voice_id: "maria_spanish"
    },
    {
      id: "6",
      display_name: "Alex - Neutral",
      provider: "Azure",
      language: "English",
      gender: "neutral",
      style_tags: ["neutral", "versatile", "clear"],
      sample_rate_hz: 16000,
      supports_realtime: false,
      price_per_min_usd: 0.15,
      provider_voice_id: "alex_neutral"
    }
  ];

  const providers = ["all", "ElevenLabs", "Azure", "OpenAI", "PlayHT"];
  const languages = ["all", "English", "Spanish", "French", "German", "Italian"];

  useEffect(() => {
    // Simulate API call
    const fetchVoices = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVoices(mockVoices);
      setLoading(false);
    };

    fetchVoices();
  }, []);

  // Cleanup audio context on unmount
  useEffect(() => {
    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [audioContext]);

  const filteredVoices = voices.filter(voice => {
    const matchesQuery = !query || 
      voice.display_name.toLowerCase().includes(query.toLowerCase()) ||
      (voice.style_tags || []).some(tag => tag.toLowerCase().includes(query.toLowerCase()));
    
    const matchesProvider = provider === "all" || voice.provider === provider;
    const matchesLang = lang === "all" || voice.language === lang;
    const matchesRealtime = !realtimeOnly || voice.supports_realtime;

    return matchesQuery && matchesProvider && matchesLang && matchesRealtime;
  });


  const preview = async (voice: Voice) => {
    if (playingId === voice.id) {
      stop();
      return;
    }

    setPlayingId(voice.id);
    
    try {
      // Create audio context if it doesn't exist
      if (!audioContext) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(ctx);
      }

      // For demo purposes, we'll use a simple tone generator
      // In a real implementation, this would fetch audio from your API
      const oscillator = audioContext!.createOscillator();
      const gainNode = audioContext!.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext!.destination);
      
      // Set frequency based on voice gender for demo
      const frequency = voice.gender === 'female' ? 220 : voice.gender === 'male' ? 110 : 165;
      oscillator.frequency.setValueAtTime(frequency, audioContext!.currentTime);
      
      // Set volume
      gainNode.gain.setValueAtTime(volume / 100 * 0.3, audioContext!.currentTime);
      
      // Play the tone
      oscillator.start(audioContext!.currentTime);
      
      // Stop after 2 seconds
      oscillator.stop(audioContext!.currentTime + 2);
      
      // Wait for the audio to finish
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error("Preview failed:", error);
      // Fallback: show a simple alert for demo
      alert(`Preview: ${voice.display_name}\n\nThis is a demo preview. In the real implementation, this would play an audio sample of the voice saying: "${testText}"`);
    } finally {
      setPlayingId(null);
    }
  };

  const stop = () => {
    setPlayingId(null);
    if (audioContext) {
      // Don't close the context immediately, just stop any playing audio
      // The context will be reused for the next preview
    }
  };

  const assignVoice = async (voice: Voice) => {
    if (!agentId) {
      console.error("No agent ID provided");
      return;
    }

    setAssigningId(voice.id);
    
    try {
      // In a real implementation, this would call your API to assign the voice
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log(`Assigned voice ${voice.display_name} to agent ${agentId}`);
    } catch (error) {
      console.error("Failed to assign voice:", error);
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Library className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Voice Library</h2>
        </div>
        <div className="flex-1 min-w-[200px] max-w-md relative">
          <Search className="w-4 h-4 absolute left-3 top-3 opacity-60" />
          <Input 
            placeholder="Search voices (name, style)" 
            className="pl-9" 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
          />
        </div>
        <Select value={provider} onValueChange={setProvider}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Provider" />
          </SelectTrigger>
          <SelectContent>
            {providers.map(p => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={lang} onValueChange={setLang}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map(l => (
              <SelectItem key={l} value={l}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          variant={realtimeOnly ? "primary" : "outline"} 
          onClick={() => setRealtimeOnly(v => !v)}
        >
          <Headphones className="w-4 h-4 mr-2" /> Realtime-ready
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Input 
          value={testText} 
          onChange={e => setTestText(e.target.value)} 
          placeholder="Type custom preview text" 
        />
        <div className="flex items-center gap-2 w-56">
          <Volume2 className="w-4 h-4" />
          <Slider 
            value={[volume]} 
            onValueChange={(vals) => setVolume(vals[0])} 
            max={100} 
            step={1} 
          />
          <span className="w-8 text-right text-sm tabular-nums">{volume}%</span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm opacity-80">
          <Loader2 className="w-4 h-4 animate-spin"/> Loading voices…
        </div>
      ) : (
        <div>
          <div className="mb-4 p-4 bg-blue-50 rounded">
            <p className="text-sm text-blue-800">
              Debug: Total voices: {voices.length}, Filtered voices: {filteredVoices.length}
            </p>
            <p className="text-sm text-blue-800">
              Filters: Provider={provider}, Lang={lang}, Realtime={realtimeOnly.toString()}, Query="{query}"
            </p>
            <p className="text-sm text-blue-600 mt-2">
              🔊 Preview: Click "Preview" to hear a demo tone (different frequencies for male/female voices)
            </p>
          </div>
          
          {filteredVoices.length === 0 ? (
            <div className="text-center py-12">
              <Library className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No voices found</h3>
              <p className="text-gray-500">
                {voices.length === 0 
                  ? "No voices are available at the moment." 
                  : "Try adjusting your filters to see more voices."
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVoices.map(voice => (
            <Card key={voice.id} className="rounded-2xl shadow-sm p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{voice.display_name}</div>
                    <div className="text-xs opacity-70">
                      {voice.provider} • {voice.language} • {voice.gender || "neutral"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {voice.supports_realtime && <Badge variant="info">Realtime</Badge>}
                    {voice.sample_rate_hz <= 8000 ? (
                      <Badge variant="warning">Phone 8k</Badge>
                    ) : (
                      <Badge variant="success">Web 16k+</Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(voice.style_tags || []).slice(0, 5).map((tag: string) => (
                    <Badge key={tag} variant="brand" className="capitalize">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {playingId === voice.id ? (
                    <Button onClick={stop} variant="secondary" size="sm" className="animate-pulse">
                      <Pause className="w-4 h-4 mr-2"/>Playing...
                    </Button>
                  ) : (
                    <Button onClick={() => preview(voice)} variant="primary" size="sm">
                      <Play className="w-4 h-4 mr-2"/>Preview
                    </Button>
                  )}
                  <Button 
                    onClick={() => assignVoice(voice)} 
                    variant="outline" 
                    size="sm" 
                    disabled={assigningId === voice.id}
                  >
                    {assigningId === voice.id ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin"/>
                    ) : (
                      <Check className="w-4 h-4 mr-2"/>
                    )}
                    Use for Agent
                  </Button>
                </div>

                {typeof voice.price_per_min_usd === "number" && (
                  <div className="text-xs opacity-60">
                    ~${voice.price_per_min_usd.toFixed(3)}/min (est.)
                  </div>
                )}
              </div>
            </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceLibrary;
