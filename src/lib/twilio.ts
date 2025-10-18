// Twilio API integration for phone number management
// Note: In production, these API calls should be made from your backend server
// to keep your Twilio credentials secure

export interface TwilioPhoneNumber {
  friendlyName: string;
  phoneNumber: string;
  capabilities: {
    voice: boolean;
    sms: boolean;
    mms: boolean;
  };
  locality?: string;
  region?: string;
  isoCountry: string;
}

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  // In production, these should be environment variables on your backend
}

// Mock Twilio configuration - replace with your actual credentials
// const TWILIO_CONFIG: TwilioConfig = {
//   accountSid: 'your_twilio_account_sid',
//   authToken: 'your_twilio_auth_token',
// };

/**
 * Fetches available phone numbers from Twilio for a specific country
 * This makes real API calls to Twilio (requires credentials)
 */
export async function fetchAvailablePhoneNumbers(
  countryCode: string,
  areaCode?: string
): Promise<TwilioPhoneNumber[]> {
  try {
    console.log(`Fetching available phone numbers for country: ${countryCode}, area code: ${areaCode}`);
    
    // Check if Twilio credentials are available
    const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
    const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
    
    console.log('Twilio credentials check for fetch:', {
      accountSid: accountSid ? 'Set' : 'Not set',
      authToken: authToken ? 'Set' : 'Not set',
      accountSidValue: accountSid,
      usingMock: !accountSid || !authToken || accountSid === 'your_account_sid' || authToken === 'your_auth_token'
    });

    if (!accountSid || !authToken || accountSid === 'your_account_sid' || authToken === 'your_auth_token') {
      console.log('Twilio credentials not configured, cannot fetch real numbers');
      throw new Error('Twilio credentials not configured. Please set VITE_TWILIO_ACCOUNT_SID and VITE_TWILIO_AUTH_TOKEN in your .env file.');
    }
    
    // Make real Twilio API call
    const url = new URL(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/AvailablePhoneNumbers/${countryCode}/Local.json`);
    if (areaCode) {
      url.searchParams.append('AreaCode', areaCode);
    }
    url.searchParams.append('Limit', '20');

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken),
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Twilio API error:', errorData);
      throw new Error('Failed to fetch available numbers from Twilio');
    }

    const data = await response.json();
    
    return data.available_phone_numbers?.map((number: any) => ({
      friendlyName: number.friendly_name,
      phoneNumber: number.phone_number,
      capabilities: {
        voice: number.capabilities.voice,
        sms: number.capabilities.sms,
        mms: number.capabilities.mms,
      },
      locality: number.locality,
      region: number.region,
      isoCountry: number.iso_country,
    })) || [];
    
  } catch (error) {
    console.error('Error fetching available phone numbers:', error);
    throw new Error('Failed to fetch available phone numbers');
  }
}

/**
 * Purchases a phone number from Twilio
 * This makes real API calls to Twilio (requires credentials)
 */
export async function purchasePhoneNumber(phoneNumber: string): Promise<{ success: boolean; sid?: string; error?: string }> {
  try {
    console.log(`Purchasing phone number: ${phoneNumber}`);
    
    // Check if Twilio credentials are available
    const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
    const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
    
    console.log('Twilio credentials check:', {
      accountSid: accountSid ? 'Set' : 'Not set',
      authToken: authToken ? 'Set' : 'Not set',
      accountSidValue: accountSid,
      usingMock: !accountSid || !authToken || accountSid === 'your_account_sid' || authToken === 'your_auth_token'
    });

    if (!accountSid || !authToken || accountSid === 'your_account_sid' || authToken === 'your_auth_token') {
      console.log('Twilio credentials not configured, cannot purchase real numbers');
      return {
        success: false,
        error: 'Twilio credentials not configured. Please set VITE_TWILIO_ACCOUNT_SID and VITE_TWILIO_AUTH_TOKEN in your .env file.',
      };
    }
    
    // Make real Twilio API call
    const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/' + accountSid + '/IncomingPhoneNumbers.json', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'PhoneNumber': phoneNumber,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Twilio API error:', errorData);
      throw new Error('Failed to purchase phone number from Twilio');
    }

    const data = await response.json();
    return {
      success: true,
      sid: data.sid,
    };
  } catch (error) {
    console.error('Error purchasing phone number:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Gets country code from country name
 */
export function getCountryCode(countryName: string): string {
  const countryMap: Record<string, string> = {
    'United States': 'US',
    'Canada': 'CA',
    'United Kingdom': 'GB',
    'Australia': 'AU',
    'Germany': 'DE',
    'France': 'FR',
    'Spain': 'ES',
    'Italy': 'IT',
    'Netherlands': 'NL',
    'Belgium': 'BE',
    'Switzerland': 'CH',
    'Austria': 'AT',
    'Sweden': 'SE',
    'Norway': 'NO',
    'Denmark': 'DK',
    'Finland': 'FI',
    'Ireland': 'IE',
    'Portugal': 'PT',
    'Poland': 'PL',
    'Czech Republic': 'CZ',
    'Hungary': 'HU',
    'Slovakia': 'SK',
    'Slovenia': 'SI',
    'Croatia': 'HR',
    'Romania': 'RO',
    'Bulgaria': 'BG',
    'Greece': 'GR',
    'Cyprus': 'CY',
    'Malta': 'MT',
    'Estonia': 'EE',
    'Latvia': 'LV',
    'Lithuania': 'LT',
    'Luxembourg': 'LU',
    'Brazil': 'BR',
    'Mexico': 'MX',
    'Argentina': 'AR',
    'Chile': 'CL',
    'Colombia': 'CO',
    'Peru': 'PE',
    'Venezuela': 'VE',
    'Uruguay': 'UY',
    'Paraguay': 'PY',
    'Bolivia': 'BO',
    'Ecuador': 'EC',
    'Guyana': 'GY',
    'Suriname': 'SR',
    'Japan': 'JP',
    'South Korea': 'KR',
    'China': 'CN',
    'India': 'IN',
    'Singapore': 'SG',
    'Hong Kong': 'HK',
    'Taiwan': 'TW',
    'Thailand': 'TH',
    'Malaysia': 'MY',
    'Indonesia': 'ID',
    'Philippines': 'PH',
    'Vietnam': 'VN',
    'New Zealand': 'NZ',
    'South Africa': 'ZA',
    'Israel': 'IL',
    'Turkey': 'TR',
    'Russia': 'RU',
    'Ukraine': 'UA',
    'Egypt': 'EG',
    'Morocco': 'MA',
    'Nigeria': 'NG',
    'Kenya': 'KE',
    'Ghana': 'GH',
    'Ethiopia': 'ET',
    'Tanzania': 'TZ',
    'Uganda': 'UG',
    'Algeria': 'DZ',
    'Tunisia': 'TN',
    'Libya': 'LY',
    'Sudan': 'SD',
    'Saudi Arabia': 'SA',
    'United Arab Emirates': 'AE',
    'Qatar': 'QA',
    'Kuwait': 'KW',
    'Bahrain': 'BH',
    'Oman': 'OM',
    'Jordan': 'JO',
    'Lebanon': 'LB',
    'Syria': 'SY',
    'Iraq': 'IQ',
    'Iran': 'IR',
    'Afghanistan': 'AF',
    'Pakistan': 'PK',
    'Bangladesh': 'BD',
    'Sri Lanka': 'LK',
    'Myanmar': 'MM',
    'Cambodia': 'KH',
    'Laos': 'LA',
    'Nepal': 'NP',
    'Bhutan': 'BT',
    'Maldives': 'MV',
    'Mongolia': 'MN',
    'North Korea': 'KP',
  };

  return countryMap[countryName] || 'US';
}

/**
 * Formats phone number for display
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');
  
  // Format US numbers
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  
  // Format 10-digit US numbers
  if (digits.length === 10) {
    return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  
  // Return original if can't format
  return phoneNumber;
}
