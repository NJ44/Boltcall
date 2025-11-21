# PageSpeed Insights API Setup Guide

This guide will help you set up the Google PageSpeed Insights API for the speed test feature.

## 1. Get Your API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Library**
4. Search for "PageSpeed Insights API"
5. Click on it and click **Enable**
6. Go to **APIs & Services** > **Credentials**
7. Click **Create Credentials** > **API Key**
8. Copy your API key

## 2. Set Up Environment Variables

Create a `.env` file in your project root (if it doesn't exist) and add:

```env
VITE_PAGESPEED_API_KEY=your_api_key_here
```

**Important**: 
- Never commit your `.env` file to version control (it's already in `.gitignore`)
- Replace `your_api_key_here` with your actual API key from Google Cloud Console

## 3. Restart Development Server

After adding the environment variable, restart your development server:

```bash
npm run dev
```

## 4. Test the Integration

1. Navigate to the speed test page
2. Enter a website URL
3. Click "Analyze"
4. The speed test should now work with the API key

## Troubleshooting

### Error: "API key not found"
- Make sure you created a `.env` file in the project root
- Verify the variable name is exactly `VITE_PAGESPEED_API_KEY`
- Restart your dev server after adding the key

### Error: "Invalid API key"
- Verify your API key is correct
- Make sure the PageSpeed Insights API is enabled in your Google Cloud project
- Check if there are any API key restrictions that might be blocking requests

### Error: "API key has referer restrictions"
- Go to Google Cloud Console > APIs & Services > Credentials
- Click on your API key
- Under "Application restrictions", either:
  - Remove restrictions, or
  - Add your domain to the allowed referrers list

## API Quotas

The PageSpeed Insights API has free quotas:
- **25,000 requests per day** (free tier)
- Each speed test uses 2 requests (mobile + desktop)

For production use, monitor your API usage in the Google Cloud Console.

