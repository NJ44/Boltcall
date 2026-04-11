# Twilio Integration Setup Guide

## 🔧 **To Enable Real Phone Number Purchases:**

### **Step 1: Create Twilio Account**
1. Go to [https://www.twilio.com](https://www.twilio.com)
2. Sign up for a free account
3. Verify your email and phone number
4. Add funds to your account (minimum $20 for phone number purchases)

### **Step 2: Get Your Credentials**
1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Account** → **API keys & tokens**
3. Copy your **Account SID** (starts with `AC...`)
4. Copy your **Auth Token** (click "Show" to reveal it)

### **Step 3: Set Up Environment Variables**
Create a `.env` file in your project root with:

```env
# Twilio Configuration
VITE_TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_TWILIO_AUTH_TOKEN=your_auth_token_here
```

### **Step 4: Restart Development Server**
After adding the environment variables:
```bash
npm run dev
```

## 🎯 **How It Works:**

### **With Credentials (Real Twilio):**
- ✅ **Real API Calls**: Fetches actual available numbers from Twilio
- ✅ **Real Purchases**: Actually purchases numbers (charges your account)
- ✅ **Real SIDs**: Returns actual Twilio phone number SIDs
- ✅ **Dashboard Visibility**: Numbers appear in your Twilio dashboard

### **Without Credentials (Mock Mode):**
- ✅ **Mock Data**: Uses fake numbers for testing
- ✅ **Mock Purchases**: Simulates successful purchases
- ✅ **No Charges**: No money is charged to your account
- ❌ **No Dashboard**: Numbers won't appear in Twilio dashboard

## 🔒 **Security Note:**
The current implementation uses `VITE_` prefixed environment variables, which means they're exposed to the client-side. For production, you should:

1. **Use a Backend Server**: Create API endpoints on your server
2. **Server-Side Twilio Calls**: Make Twilio API calls from your backend
3. **Hide Credentials**: Keep Twilio credentials on your server only

## 📱 **Testing:**
- **Mock Mode**: Perfect for UI testing and development
- **Real Mode**: Use only when you want to actually purchase numbers

## 🚨 **Important:**
- Phone numbers cost money (usually $1-3/month)
- Make sure you have sufficient funds in your Twilio account
- Test with mock mode first before using real credentials
