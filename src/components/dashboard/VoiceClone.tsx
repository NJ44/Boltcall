import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, Upload, Trash2, Mic, Play, Pause, AlertCircle, Square, RotateCcw } from 'lucide-react';
import Button from '../ui/Button';
import { Input } from '../ui/input';
import Card from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';

interface ClonedVoice {
  id: string;
  name: string;
  description: string | null;
  gender: string | null;
  accent: string | null;
  eleven_voice_id: string;
  retell_voice_id: string;
  preview_audio_url: string | null;
  status: 'ready' | 'processing' | 'failed';
  created_at: string;
}

const FUNC_BASE = import.meta.env.DEV
  ? 'http://localhost:8888/.netlify/functions'
  : '/.netlify/functions';

const ACCEPTED_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/webm', 'audio/ogg', 'audio/m4a', 'audio/mp4'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_RECORD_SECONDS = 120;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] || '';
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

type InputMode = 'upload' | 'record';

const VoiceClone: React.FC = () => {
  const { user } = useAuth();

  const [voices, setVoices] = useState<ClonedVoice[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'neutral' | ''>('');
  const [accent, setAccent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Input mode
  const [inputMode, setInputMode] = useState<InputMode>('upload');

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedMime, setRecordedMime] = useState('audio/webm');
  const [recordPlayback, setRecordPlayback] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordAudioRef = useRef<HTMLAudioElement>(null);

  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  useEffect(() => () => stopStream(), [stopStream]);

  const refresh = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`${FUNC_BASE}/elevenlabs-clone-voice?userId=${encodeURIComponent(user.id)}`);
      if (res.ok) {
        const data = await res.json();
        setVoices(data.voices || []);
      }
    } catch (err) {
      console.error('Failed to load cloned voices', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { refresh(); }, [refresh]);

  const handleFile = (f: File | null) => {
    setError(null);
    if (!f) { setFile(null); return; }
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setError('Unsupported file type. Use MP3, WAV, M4A, OGG, or WebM.');
      return;
    }
    if (f.size > MAX_FILE_SIZE) {
      setError('File too large. Maximum is 10 MB.');
      return;
    }
    setFile(f);
  };

  const switchMode = (mode: InputMode) => {
    setError(null);
    setFile(null);
    setRecordedBlob(null);
    setRecordingSeconds(0);
    setRecordPlayback(false);
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      stopStream();
      setIsRecording(false);
    }
    setInputMode(mode);
  };

  const startRecording = async () => {
    setError(null);
    setRecordedBlob(null);
    setRecordingSeconds(0);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/ogg';

      setRecordedMime(mimeType.split(';')[0]);

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setRecordedBlob(blob);
        stopStream();
        setIsRecording(false);
      };

      recorder.start(250);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => {
          if (prev + 1 >= MAX_RECORD_SECONDS) {
            recorder.stop();
            return MAX_RECORD_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      setError('Microphone access denied. Allow microphone access in your browser and try again.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const playRecording = () => {
    if (!recordedBlob || !recordAudioRef.current) return;
    if (recordPlayback) {
      recordAudioRef.current.pause();
      setRecordPlayback(false);
      return;
    }
    const url = URL.createObjectURL(recordedBlob);
    recordAudioRef.current.src = url;
    recordAudioRef.current.play()
      .then(() => setRecordPlayback(true))
      .catch(() => setRecordPlayback(false));
  };

  const getAudioFile = (): File | null => {
    if (inputMode === 'upload') return file;
    if (inputMode === 'record' && recordedBlob) {
      const ext = recordedMime.includes('ogg') ? 'ogg' : 'webm';
      return new File([recordedBlob], `recording.${ext}`, { type: recordedMime });
    }
    return null;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user?.id) { setError('You must be signed in.'); return; }
    if (!name.trim()) { setError('Give your voice a name.'); return; }

    const audioFile = getAudioFile();
    if (!audioFile) {
      setError(inputMode === 'upload' ? 'Upload an audio sample.' : 'Record an audio sample first.');
      return;
    }
    if (!consent) {
      setError('You must confirm you own this voice or have explicit permission to clone it.');
      return;
    }

    setSubmitting(true);
    try {
      const audio_base64 = await fileToBase64(audioFile);
      const res = await fetch(`${FUNC_BASE}/elevenlabs-clone-voice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: name.trim(),
          description: description.trim() || undefined,
          gender: gender || undefined,
          accent: accent.trim() || undefined,
          audio_base64,
          mime_type: audioFile.type,
          file_name: audioFile.name,
          consent_confirmed: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || data.details || 'Failed to clone voice');
        return;
      }

      setName('');
      setDescription('');
      setGender('');
      setAccent('');
      setFile(null);
      setRecordedBlob(null);
      setRecordingSeconds(0);
      setConsent(false);
      await refresh();
    } catch (err: any) {
      setError(err?.message || 'Failed to clone voice');
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id: string) => {
    if (!user?.id) return;
    if (!confirm('Delete this cloned voice? Agents using it will fall back to the default voice.')) return;
    const res = await fetch(
      `${FUNC_BASE}/elevenlabs-clone-voice?id=${encodeURIComponent(id)}&userId=${encodeURIComponent(user.id)}`,
      { method: 'DELETE' },
    );
    if (res.ok) refresh();
  };

  const togglePreview = (v: ClonedVoice) => {
    if (!v.preview_audio_url) return;
    if (playingId === v.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    if (audioRef.current) {
      audioRef.current.src = v.preview_audio_url;
      audioRef.current.play().then(() => setPlayingId(v.id)).catch(() => setPlayingId(null));
    }
  };

  const recordingProgress = (recordingSeconds / MAX_RECORD_SECONDS) * 100;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2">
        <Mic className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Clone My Voice</h2>
      </div>

      <Card className="rounded-2xl shadow-sm p-5">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Voice name</label>
              <Input
                placeholder="e.g. My Voice"
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={submitting}
                maxLength={120}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Accent (optional)</label>
              <Input
                placeholder="e.g. American, British"
                value={accent}
                onChange={e => setAccent(e.target.value)}
                disabled={submitting}
                maxLength={60}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gender (optional)</label>
              <div className="flex gap-2">
                {(['female', 'male', 'neutral'] as const).map(g => (
                  <Button
                    key={g}
                    type="button"
                    variant={gender === g ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setGender(gender === g ? '' : g)}
                    disabled={submitting}
                  >
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description (optional)</label>
              <Input
                placeholder="Short note about this voice"
                value={description}
                onChange={e => setDescription(e.target.value)}
                disabled={submitting}
                maxLength={200}
              />
            </div>
          </div>

          {/* Audio sample — toggle upload / record */}
          <div>
            <label className="block text-sm font-medium mb-2">Audio sample</label>

            <div className="flex gap-1 p-1 bg-black/5 rounded-lg w-fit mb-3">
              <button
                type="button"
                onClick={() => switchMode('upload')}
                disabled={submitting}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  inputMode === 'upload'
                    ? 'bg-white shadow-sm text-foreground'
                    : 'text-foreground/60 hover:text-foreground/80'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload file
              </button>
              <button
                type="button"
                onClick={() => switchMode('record')}
                disabled={submitting}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  inputMode === 'record'
                    ? 'bg-white shadow-sm text-foreground'
                    : 'text-foreground/60 hover:text-foreground/80'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                Record voice
              </button>
            </div>

            {inputMode === 'upload' && (
              <div>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-3 py-2 border-2 border-border rounded-base cursor-pointer hover:bg-black/5 text-sm">
                    <Upload className="w-4 h-4" />
                    <span>{file ? 'Replace file' : 'Upload audio'}</span>
                    <input
                      type="file"
                      className="hidden"
                      accept={ACCEPTED_TYPES.join(',')}
                      onChange={e => handleFile(e.target.files?.[0] || null)}
                      disabled={submitting}
                    />
                  </label>
                  {file && (
                    <span className="text-xs opacity-70 truncate max-w-[260px]">
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  )}
                </div>
                <p className="text-xs opacity-60 mt-2">
                  MP3, WAV, M4A, OGG, or WebM · up to 10 MB · 60–90 s of clean speech recommended.
                </p>
              </div>
            )}

            {inputMode === 'record' && (
              <div className="space-y-3">
                {!recordedBlob ? (
                  <div className="flex items-center gap-3">
                    {!isRecording ? (
                      <Button
                        type="button"
                        variant="primary"
                        onClick={startRecording}
                        disabled={submitting}
                      >
                        <Mic className="w-4 h-4 mr-2" />
                        Start recording
                      </Button>
                    ) : (
                      <div className="flex items-center gap-3 w-full">
                        <button
                          type="button"
                          onClick={stopRecording}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-base text-sm font-medium transition-colors shrink-0"
                        >
                          <Square className="w-3.5 h-3.5 fill-current" />
                          Stop
                        </button>
                        <span className="relative flex h-2 w-2 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                        </span>
                        <span className="text-sm font-mono shrink-0">{formatTime(recordingSeconds)}</span>
                        <div className="flex-1 bg-black/10 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full bg-red-500 transition-all duration-500"
                            style={{ width: `${recordingProgress}%` }}
                          />
                        </div>
                        <span className="text-xs opacity-50 shrink-0">{formatTime(MAX_RECORD_SECONDS)}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm text-green-600 font-medium">
                      ✓ Recorded {formatTime(recordingSeconds)}
                    </span>
                    <button
                      type="button"
                      onClick={playRecording}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-base text-sm hover:bg-black/5 transition-colors"
                    >
                      {recordPlayback ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      {recordPlayback ? 'Pause' : 'Preview'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRecordedBlob(null);
                        setRecordingSeconds(0);
                        setRecordPlayback(false);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-base text-sm hover:bg-black/5 transition-colors opacity-70"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Re-record
                    </button>
                  </div>
                )}
                <p className="text-xs opacity-60">
                  Record 60–90 s of clean speech for best cloning quality. No background noise.
                </p>
                <audio ref={recordAudioRef} onEnded={() => setRecordPlayback(false)} preload="none" />
              </div>
            )}
          </div>

          <label className="flex items-start gap-3 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
              disabled={submitting}
              className="mt-1"
            />
            <span>
              I confirm this is my own voice, or I have explicit written permission from the
              speaker to clone their voice. I will not use this clone to impersonate, defraud,
              or harass anyone.
            </span>
          </label>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Cloning…</>
            ) : (
              <><Mic className="w-4 h-4 mr-2" />Clone voice</>
            )}
          </Button>
        </form>
      </Card>

      <div className="space-y-3">
        <h3 className="text-base font-semibold">Your cloned voices</h3>
        {loading ? (
          <div className="flex items-center gap-2 text-sm opacity-80">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading…
          </div>
        ) : voices.length === 0 ? (
          <p className="text-sm opacity-60">
            You haven't cloned any voices yet. Use the form above to create your first.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {voices.map(v => (
              <Card key={v.id} className="rounded-2xl shadow-sm p-4">
                <div className="space-y-3">
                  <div>
                    <div className="font-medium">{v.name}</div>
                    <div className="text-xs opacity-70">
                      {v.accent || 'Custom'} • {v.gender || 'neutral'} • {v.status}
                    </div>
                    {v.description && (
                      <div className="text-xs opacity-60 mt-1">{v.description}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {v.preview_audio_url && (
                      playingId === v.id ? (
                        <Button onClick={() => togglePreview(v)} variant="secondary" size="sm">
                          <Pause className="w-4 h-4 mr-2" />Stop
                        </Button>
                      ) : (
                        <Button onClick={() => togglePreview(v)} variant="primary" size="sm">
                          <Play className="w-4 h-4 mr-2" />Preview
                        </Button>
                      )
                    )}
                    <Button onClick={() => remove(v.id)} variant="outline" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <audio ref={audioRef} onEnded={() => setPlayingId(null)} preload="none" />
    </div>
  );
};

export default VoiceClone;
