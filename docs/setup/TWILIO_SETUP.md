# Twilio Integration Setup Guide

This guide will help you set up real Twilio API integration for phone number purchasing.

## 1. Create a Twilio Account

1. Go to [https://www.twilio.com](https://www.twilio.com)
2. Sign up for a free account
3. Verify your phone number and email
4. Complete the account setup process

## 2. Get Your Twilio Credentials

1. In your Twilio Console, go to **Account** > **API keys & tokens**
2. Copy the following values:
   - **Account SID** (starts with `AC...`)
   - **Auth Token** (click "Show" to reveal)

## 3. Set Up Environment Variables

Create a `.env.local` file in your project root with your Twilio credentials:

```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
```

**Important**: Never commit your `.env.local` file to version control.

## 4. Install Twilio SDK

```bash
npm install twilio
```

## 5. Update API Endpoints

The API endpoints are already created in:
- `src/api/twilio/available-numbers.ts`
- `src/api/twilio/purchase-number.ts`

To enable real Twilio integration:

1. **Uncomment the Twilio code** in both files
2. **Comment out the mock responses**
3. **Deploy your API endpoints** to your hosting platform

## 6. Configure Webhooks (Optional)

When purchasing phone numbers, you can configure webhooks to handle incoming calls and SMS:

```javascript
const incomingPhoneNumber = await client.incomingPhoneNumbers.create({
  phoneNumber: phoneNumber,
  voiceUrl: 'https://your-domain.com/voice-webhook',
  smsUrl: 'https://your-domain.com/sms-webhook',
});
```

## 7. Test the Integration

1. **Start your development server**: `npm run dev`
2. **Go to the phone step** in your setup flow
3. **Select a country** from the business profile
4. **Search for available numbers**
5. **Purchase a number** (this will make a real API call to Twilio)

## 8. Production Deployment

### Vercel
1. Add environment variables in Vercel dashboard
2. Deploy your project
3. The API routes will be automatically available

### Netlify
1. Add environment variables in Netlify dashboard
2. Deploy your project
3. The API routes will be automatically available

### Other Platforms
Make sure your hosting platform supports:
- Environment variables
- Serverless functions
- Node.js runtime

## 9. Cost Considerations

- **Phone Number Purchase**: ~$1/month per number
- **Incoming Calls**: ~$0.01-0.02 per minute
- **SMS**: ~$0.0075 per message
- **Outbound Calls**: ~$0.013 per minute

## 10. Security Best Practices

1. **Never expose credentials** in client-side code
2. **Use environment variables** for all sensitive data
3. **Implement rate limiting** on your API endpoints
4. **Add authentication** to your API endpoints
5. **Monitor usage** to prevent unexpected charges

## 11. Error Handling

The integration includes comprehensive error handling:
- **Network errors**: Fallback to mock data
- **Twilio errors**: User-friendly error messages
- **Validation errors**: Clear feedback for invalid inputs

## 12. Testing

### Development Testing
- Uses mock data when Twilio credentials are not available
- Provides realistic phone number data
- Simulates API delays and responses

### Production Testing
1. Set up Twilio credentials
2. Test with small amounts first
3. Monitor your Twilio console for usage
4. Verify phone numbers are actually purchased

## Troubleshooting

### Common Issues

1. **"Invalid credentials"**: Check your Account SID and Auth Token
2. **"Phone number not available"**: Try different area codes or countries
3. **"Insufficient funds"**: Add funds to your Twilio account
4. **"Rate limit exceeded"**: Implement proper rate limiting

### Debug Steps

1. Check browser console for error messages
2. Verify environment variables are set correctly
3. Test API endpoints directly with tools like Postman
4. Check Twilio console for API logs

## Support

- **Twilio Documentation**: https://www.twilio.com/docs
- **Twilio Support**: https://support.twilio.com
- **Community Forum**: https://stackoverflow.com/questions/tagged/twilio
