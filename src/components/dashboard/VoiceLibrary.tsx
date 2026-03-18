import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Play, Pause, Check, Search, Library } from "lucide-react";
import Button from "../ui/Button";
import { Input } from "../ui/input";
import Card from "../ui/Card";
import { getVoices } from '../../server/api';

interface Voice {
  id: string;
  name: string;
  accent: string;
  gender: string;
  preview: string;
  provider?: string;
}

interface VoiceLibraryProps {
  agentId?: string;
}

const VoiceLibrary: React.FC<VoiceLibraryProps> = ({ agentId }) => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchVoices = async () => {
      setLoading(true);
      try {
        const voicesData = await getVoices();
        setVoices(voicesData);
      } catch (error) {
        console.error('Failed to load voices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVoices();
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const filteredVoices = voices.filter(voice => {
    const matchesQuery = !query ||
      voice.name.toLowerCase().includes(query.toLowerCase()) ||
      (voice.provider || '').toLowerCase().includes(query.toLowerCase()) ||
      voice.accent.toLowerCase().includes(query.toLowerCase());

    const matchesGender = genderFilter === "all" || voice.gender.toLowerCase() === genderFilter;

    return matchesQuery && matchesGender;
  });

  const preview = async (voice: Voice) => {
    if (playingId === voice.id) {
      stop();
      return;
    }

    // Stop any current playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setPlayingId(voice.id);

    if (audioRef.current) {
      audioRef.current.src = voice.preview;
      audioRef.current.load();

      audioRef.current.oncanplaythrough = () => {
        audioRef.current?.play().catch((err) => {
          console.error('Playback failed:', err);
          setPlayingId(null);
        });
      };

      audioRef.current.onerror = () => {
        console.error('Failed to load audio:', voice.preview);
        setPlayingId(null);
      };
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlayingId(null);
  };

  const handleEnded = () => {
    setPlayingId(null);
  };

  const assignVoice = async (voice: Voice) => {
    if (!agentId) {
      console.error("No agent ID provided");
      return;
    }

    setAssigningId(voice.id);

    try {
      // TODO: Call API to assign voice to agent
      await new Promise(resolve => setTimeout(resolve, 1500));
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
            placeholder="Search voices (name, provider, accent)"
            className="pl-9"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["all", "female", "male"].map(g => (
            <Button
              key={g}
              variant={genderFilter === g ? "primary" : "outline"}
              size="sm"
              onClick={() => setGenderFilter(g)}
            >
              {g === "all" ? "All" : g.charAt(0).toUpperCase() + g.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm opacity-80">
          <Loader2 className="w-4 h-4 animate-spin"/> Loading voices…
        </div>
      ) : (
        <div>
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
                        <div className="font-medium">{voice.name}</div>
                        <div className="text-xs opacity-70">
                          {voice.provider || 'Retell'} • {voice.accent} • {voice.gender}
                        </div>
                      </div>
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
                      {agentId && (
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
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Shared audio element */}
      <audio
        ref={audioRef}
        preload="none"
        onEnded={handleEnded}
      />
    </div>
  );
};

export default VoiceLibrary;
