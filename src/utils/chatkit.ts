// ChatKit Session Token Generator
// This function creates a new ChatKit session via a Netlify function (server-side)
// The OpenAI API key is NEVER exposed to the browser.

export async function getChatKitSessionToken(deviceId: string): Promise<string> {
  try {
    const response = await fetch("/.netlify/functions/chatkit-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deviceId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create ChatKit session: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.client_secret;
  } catch (error) {
    console.error("Error creating ChatKit session:", error);
    throw error;
  }
}

// Generate a unique device ID for the user
export function getOrCreateDeviceId(): string {
  const DEVICE_ID_KEY = "chatkit_device_id";
  
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  
  return deviceId;
}

