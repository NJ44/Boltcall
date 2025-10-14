// Example API route for fetching Retell voices
// This would typically be in your backend (Express.js, Next.js API route, etc.)

// import fetch from "node-fetch"; // Commented out for frontend usage

export async function getVoices() {
  try {
    // For Vite frontend
    const apiKey = import.meta.env.VITE_RETELL_API_KEY;
    
    // For Node.js backend (if using this file in backend)
    // const apiKey = process.env.RETELL_API_KEY;
    
    if (!apiKey) {
      throw new Error('RETELL_API_KEY not found in environment variables');
    }
    
    const response = await fetch("https://api.retellai.com/v2/voices", {
      headers: { 
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Optional: only keep what you need in the UI
    const slim = data.items.map((v: any) => ({
      id: v.voice_id,
      name: v.name,
      accent: v.accent,
      gender: v.gender,
      preview: v.preview_audio_url,   // <-- use this in <audio>
    }));
    
    return slim;
  } catch (error) {
    console.error('Error fetching voices from Retell API:', error);
    throw new Error('Failed to fetch voices');
  }
}

// Example Express.js route handler
export function createVoicesRoute() {
  return async (_req: any, res: any) => {
    try {
      const voices = await getVoices();
      
      // Add caching headers (CDN/browser)
      res.setHeader("Cache-Control", "public, s-maxage=21600, max-age=3600");
      res.json(voices);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch voices' });
    }
  };
}

// Example Next.js API route
export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const voices = await getVoices();
    
    // Add caching headers
    res.setHeader("Cache-Control", "public, s-maxage=21600, max-age=3600");
    res.json(voices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch voices' });
  }
}
