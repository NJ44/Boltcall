# Voice Preview Integration with Retell AI

This implementation adds voice preview functionality to the Agents page in the dashboard, allowing users to preview and select voices from Retell AI's voice library.

## Features Implemented

### 1. VoiceCard Component (`src/components/ui/VoiceCard.tsx`)
- Individual voice card with play/pause functionality
- Visual selection indicator
- Audio preview with shared audio element for optimal performance
- Responsive design with hover effects

### 2. VoiceGallery Component (`src/components/ui/VoiceGallery.tsx`)
- Grid layout of voice cards
- Loading and error states
- Shared audio element to prevent multiple downloads
- Integration with Retell API

### 3. API Integration (`src/server/api.ts`)
- Mock voices data (ready for Retell API integration)
- `getVoices()` function with Retell API structure
- Error handling and loading states

### 4. Agents Page Integration (`src/pages/dashboard/AgentsPage.tsx`)
- Voice selection in create agent modal
- Replaces simple dropdown with interactive voice gallery
- Maintains existing form functionality

## Integration with Real Retell API

### Backend Setup

1. **Install dependencies:**
```bash
npm install node-fetch
```

2. **Set environment variable in your `.env` file:**
```bash
VITE_RETELL_API_KEY=your_retell_api_key_here
```

**Note:** Since you're using Vite, environment variables must be prefixed with `VITE_` to be accessible in the frontend.

3. **Update `src/server/api.ts`:**
```typescript
export async function getVoices(): Promise<any[]> {
  try {
    const apiKey = import.meta.env.VITE_RETELL_API_KEY;
    
    const response = await fetch('https://api.retellai.com/v2/voices', {
      headers: { 
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
    });
    
    const data = await response.json();
    
    return data.items.map((voice: any) => ({
      id: voice.voice_id,
      name: voice.name,
      accent: voice.accent,
      gender: voice.gender,
      preview: voice.preview_audio_url,
    }));
  } catch (error) {
    console.error('Error fetching voices:', error);
    throw new Error('Failed to fetch voices');
  }
}
```

### Express.js Backend Route

Create a backend route at `/api/retell/voices`:

```javascript
import fetch from "node-fetch";

export async function getVoices(req, res) {
  const r = await fetch("https://api.retellai.com/v2/voices", {
    headers: { Authorization: `Bearer ${process.env.RETELL_API_KEY}` },
  });
  const data = await r.json();
  
  // Optional: only keep what you need in the UI
  const slim = data.items.map(v => ({
    id: v.voice_id,
    name: v.name,
    accent: v.accent,
    gender: v.gender,
    preview: v.preview_audio_url,   // <-- use this in <audio>
  }));
  
  // Add caching headers (CDN/browser)
  res.setHeader("Cache-Control", "public, s-maxage=21600, max-age=3600");
  res.json(slim);
}
```

### Next.js API Route

Create `pages/api/retell/voices.js`:

```javascript
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const response = await fetch("https://api.retellai.com/v2/voices", {
      headers: { Authorization: `Bearer ${process.env.RETELL_API_KEY}` },
    });
    const data = await response.json();
    
    const slim = data.items.map(v => ({
      id: v.voice_id,
      name: v.name,
      accent: v.accent,
      gender: v.gender,
      preview: v.preview_audio_url,
    }));
    
    res.setHeader("Cache-Control", "public, s-maxage=21600, max-age=3600");
    res.json(slim);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch voices' });
  }
}
```

### Update Frontend API Call

Update `VoiceGallery.tsx` to use the real API endpoint:

```typescript
useEffect(() => {
  const fetchVoices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/retell/voices');
      const voicesData = await response.json();
      setVoices(voicesData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load voices');
      setLoading(false);
    }
  };

  fetchVoices();
}, []);
```

## Performance Optimizations

### 1. Audio Optimization
- **Single shared audio element** prevents multiple downloads
- **`preload="none"`** on audio elements
- **Lazy loading** - only load audio when play button is clicked

### 2. Caching
- **API response caching** with 6-hour CDN cache
- **Browser caching** with proper cache headers
- **Client-side caching** to avoid repeated API calls

### 3. UX Improvements
- **Loading states** with skeleton placeholders
- **Error handling** with user-friendly messages
- **Play/pause states** with visual feedback
- **Responsive design** for all screen sizes

## Usage

1. **Navigate to Dashboard > Agents**
2. **Click "Create New Agent"**
3. **Scroll to Voice Choice section**
4. **Click play button** to preview voices
5. **Click on voice card** to select
6. **Complete agent creation** with selected voice

## Setting Voice on Agent

When a user selects a voice, call your backend to update the agent:

```typescript
const updateAgentVoice = async (agentId: string, voiceId: string) => {
  const response = await fetch(`/api/agents/${agentId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ voice_id: voiceId })
  });
  return response.json();
};
```

## Documentation References

- [Retell AI Voices API](https://docs.retellai.com/reference/list-voices)
- [Retell AI Agent API](https://docs.retellai.com/reference/update-agent)
- [Audio HTML Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio)

## Future Enhancements

1. **Voice filtering** by accent, gender, or language
2. **Voice search** functionality
3. **Custom voice upload** integration
4. **Voice cloning** features
5. **Bulk voice testing** for multiple agents
