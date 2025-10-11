// ChatKit Session Token Generator
// This function creates a new ChatKit session and returns the client secret

export async function getChatKitSessionToken(deviceId: string): Promise<string> {
  const WORKFLOW_ID = "wf_68e9fd4d3bc08190ba32c0dd1efa36d107c2b86288c10974";
  const API_KEY = import.meta.env.VITE_OPENAI_API_SECRET_KEY;

  if (!API_KEY) {
    console.error("⚠️ MISSING API KEY: Please create a .env file with VITE_OPENAI_API_SECRET_KEY");
    throw new Error("OpenAI API key is not configured. Please add VITE_OPENAI_API_SECRET_KEY to your .env file.");
  }

  console.log("Creating ChatKit session for device:", deviceId);

  try {
    const response = await fetch("https://api.openai.com/v1/chatkit/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "OpenAI-Beta": "chatkit_beta=v1",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        workflow: { id: WORKFLOW_ID },
        user: deviceId,
      }),
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

