// Speed test utility using Google PageSpeed Insights API
// API Key should be set in .env file as VITE_PAGESPEED_API_KEY

interface SpeedTestResults {
  loadingTime: number;
  mobileScore: number;
  desktopScore: number;
  keyIssues: string[];
  status: 'slow' | 'average' | 'fast';
}

// Helper function to add timeout to fetch
function fetchWithTimeout(url: string, timeoutMs: number = 90000): Promise<Response> {
  return Promise.race([
    fetch(url),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error(`Request timeout after ${timeoutMs / 1000} seconds`)), timeoutMs)
    )
  ]) as Promise<Response>;
}

export async function runSpeedTest(
  url: string,
  onProgress?: (progress: number, message: string) => void
): Promise<SpeedTestResults> {
  const API_KEY = import.meta.env.VITE_PAGESPEED_API_KEY || process.env.REACT_APP_PAGESPEED_API_KEY;
  
  // Require API key - no mock data fallback
  if (!API_KEY) {
    throw new Error('PageSpeed Insights API key not found. Please add VITE_PAGESPEED_API_KEY to your .env file and restart your dev server.');
  }

  console.log('Starting speed test for:', url);
  console.log('API Key present:', !!API_KEY);

  onProgress?.(5, 'Initializing speed test...');

  try {
    // Mobile test (90 second timeout - PageSpeed API can take 30-60 seconds)
    console.log('Running mobile test...');
    onProgress?.(10, 'Testing mobile performance...');
    
    const mobileResponse = await fetchWithTimeout(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&key=${API_KEY}`,
      90000
    );
    
    if (!mobileResponse.ok) {
      const errorData = await mobileResponse.json().catch(() => ({}));
      let errorMsg = errorData.error?.message || mobileResponse.statusText;
      
      // Provide helpful error messages for common issues
      if (mobileResponse.status === 403 && errorMsg.includes('referer')) {
        errorMsg = 'API key has referer restrictions. Please configure your Google Cloud API key to allow requests from this domain, or remove referer restrictions.';
      } else if (mobileResponse.status === 400 && errorMsg.includes('API key')) {
        errorMsg = 'Invalid API key. Please check your VITE_PAGESPEED_API_KEY in the .env file.';
      }
      
      throw new Error(`Mobile test failed: ${errorMsg} (${mobileResponse.status})`);
    }
    
    onProgress?.(40, 'Analyzing mobile results...');
    const mobileData = await mobileResponse.json();
    
    // Check for API errors in response
    if (mobileData.error) {
      throw new Error(`API Error: ${mobileData.error.message || 'Unknown error'}`);
    }
    
    console.log('Mobile test completed');
    onProgress?.(50, 'Mobile test complete. Testing desktop performance...');
    
    // Desktop test (90 second timeout)
    console.log('Running desktop test...');
    const desktopResponse = await fetchWithTimeout(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=desktop&key=${API_KEY}`,
      90000
    );
    
    if (!desktopResponse.ok) {
      const errorData = await desktopResponse.json().catch(() => ({}));
      let errorMsg = errorData.error?.message || desktopResponse.statusText;
      
      // Provide helpful error messages for common issues
      if (desktopResponse.status === 403 && errorMsg.includes('referer')) {
        errorMsg = 'API key has referer restrictions. Please configure your Google Cloud API key to allow requests from this domain, or remove referer restrictions.';
      } else if (desktopResponse.status === 400 && errorMsg.includes('API key')) {
        errorMsg = 'Invalid API key. Please check your VITE_PAGESPEED_API_KEY in the .env file.';
      }
      
      throw new Error(`Desktop test failed: ${errorMsg} (${desktopResponse.status})`);
    }
    
    onProgress?.(80, 'Analyzing desktop results...');
    const desktopData = await desktopResponse.json();
    
    // Check for API errors in response
    if (desktopData.error) {
      throw new Error(`API Error: ${desktopData.error.message || 'Unknown error'}`);
    }
    
    console.log('Desktop test completed');
    onProgress?.(90, 'Generating report...');
    
    // Extract scores and metrics
    const mobileScore = Math.round((mobileData.lighthouseResult?.categories?.performance?.score || 0) * 100);
    const desktopScore = Math.round((desktopData.lighthouseResult?.categories?.performance?.score || 0) * 100);
    
    // Get loading time from First Contentful Paint (FCP) in seconds
    const fcpAudit = mobileData.lighthouseResult?.audits?.['first-contentful-paint'];
    const loadingTime = fcpAudit?.numericValue ? Math.round((fcpAudit.numericValue / 1000) * 10) / 10 : 0;
    
    // Extract key issues from audits (lowest scoring audits with actionable recommendations)
    const audits = mobileData.lighthouseResult?.audits || {};
    const keyIssues = Object.values(audits)
      .filter((audit: any) => {
        // Filter for audits that:
        // 1. Have a score (null means not applicable)
        // 2. Score is less than 0.5 (performance issues)
        // 3. Have a title
        // 4. Are not "pass" audits (score === 1)
        return audit.score !== null && 
               audit.score < 0.5 && 
               audit.score !== 1 &&
               audit.title &&
               audit.details?.type !== 'screenshot';
      })
      .sort((a: any, b: any) => (a.score || 1) - (b.score || 1))
      .slice(0, 5)
      .map((audit: any) => audit.title);
    
    // Determine status based on average score
    let status: 'slow' | 'average' | 'fast';
    const avgScore = (mobileScore + desktopScore) / 2;
    if (avgScore >= 70) {
      status = 'fast';
    } else if (avgScore >= 50) {
      status = 'average';
    } else {
      status = 'slow';
    }
    
    onProgress?.(100, 'Complete!');
    
    return {
      loadingTime,
      mobileScore,
      desktopScore,
      keyIssues: keyIssues.length > 0 ? keyIssues : ['No major issues detected'],
      status,
    };
  } catch (error) {
    console.error('Speed test error:', error);
    
    // Provide more specific error messages
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to PageSpeed Insights API. Please check your internet connection.');
    }
    
    if (error instanceof Error) {
      // Check for timeout
      if (error.message.includes('timeout')) {
        throw new Error('The speed test is taking too long. The website might be slow or unreachable. Please try again.');
      }
      // Check for CORS
      if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
        throw new Error('CORS error: Please check your API key restrictions in Google Cloud Console. Make sure your domain is allowed.');
      }
      throw error;
    }
    throw new Error('An unknown error occurred while running the speed test');
  }
}
