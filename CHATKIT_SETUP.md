# ChatKit Setup Instructions

## 1. Install Dependencies

```bash
npm install @openai/chatkit-react
```

## 2. Set Environment Variables

Create a `.env` file in your project root:

```env
VITE_OPENAI_API_SECRET_KEY=your_openai_api_key_here
```

⚠️ **Important**: Never commit your API key to version control. Add `.env` to your `.gitignore`.

## 3. Configure Your Backend (Optional)

If you want to handle the ChatKit session creation on your backend instead of the frontend:

### Option A: Node.js/Express Backend

```javascript
// server.js
const express = require('express');
const app = express();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/chatkit/session', async (req, res) => {
  try {
    const session = await openai.chatkit.sessions.create({
      workflow: { id: "wf_68e9fd4d3bc08190ba32c0dd1efa36d107c2b86288c10974" },
      user: req.body.deviceId || `user_${Date.now()}`
    });
    
    res.json({ client_secret: session.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### Option B: Python/FastAPI Backend

```python
# server.py
from fastapi import FastAPI
from openai import OpenAI
import os

app = FastAPI()
openai = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

@app.post("/api/chatkit/session")
async def create_chatkit_session():
    session = openai.chatkit.sessions.create({
        "workflow": {"id": "wf_68e9fd4d3bc08190ba32c0dd1efa36d107c2b86288c10974"},
        "user": f"user_{int(time.time())}"
    })
    return {"client_secret": session.client_secret}
```

## 4. Update Vite Proxy (if using backend)

In `vite.config.ts`:

```typescript
export default defineConfig({
  // ... other config
  server: {
    proxy: {
      '/api/chatkit': {
        target: 'http://localhost:3000', // Your backend URL
        changeOrigin: true,
      }
    }
  }
})
```

## 5. Access the Demo

Start your development server:

```bash
npm run dev
```

Navigate to: `http://localhost:5173/chatkit-demo`

## Credentials

- **Workflow ID**: `wf_68e9fd4d3bc08190ba32c0dd1efa36d107c2b86288c10974`
- **Domain Public Key**: `chatkit:domain_pk_68e9fd808fc48190a8e5faf25a62bca50d673bb8e5d12240`

## Deployment Checklist

Before deploying to production:

- [ ] Set `VITE_OPENAI_API_SECRET_KEY` in your hosting environment
- [ ] Move session creation to backend (more secure)
- [ ] Set up proper CORS headers
- [ ] Add rate limiting to prevent abuse
- [ ] Monitor API usage and costs
- [ ] Test thoroughly in staging environment

## Troubleshooting

**Issue**: "Failed to create ChatKit session"
- Check if your API key is valid
- Verify the workflow ID is correct
- Check browser console for detailed error messages

**Issue**: ChatKit widget not loading
- Ensure the ChatKit script is loaded in `index.html`
- Check if `@openai/chatkit-react` is installed
- Verify no ad blockers are interfering

**Issue**: CORS errors
- Move session creation to your backend
- Configure proper CORS headers on your server

## Resources

- [OpenAI ChatKit Documentation](https://platform.openai.com/docs/guides/chatkit)
- [ChatKit JS GitHub](https://github.com/openai/chatkit-js)

