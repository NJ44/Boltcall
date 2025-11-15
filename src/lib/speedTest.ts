// Speed test utility using Google PageSpeed Insights API
// API Key should be set in .env file as VITE_PAGESPEED_API_KEY

interface SpeedTestResults {
  loadingTime: number;
  mobileScore: number;
  desktopScore: number;
  keyIssues: string[];
  status: 'slow' | 'average' | 'fast';
}

export async function runSpeedTest(url: string): Promise<SpeedTestResults> {
  const API_KEY = import.meta.env.VITE_PAGESPEED_API_KEY || process.env.REACT_APP_PAGESPEED_API_KEY;
  
  // Require API key - no mock data fallback
  if (!API_KEY) {
    throw new Error('PageSpeed Insights API key not found. Please add VITE_PAGESPEED_API_KEY to your .env file.');
  }

  try {
    // Mobile test
    const mobileResponse = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&key=${API_KEY}`
    );
    
    if (!mobileResponse.ok) {
      const errorData = await mobileResponse.json().catch(() => ({}));
      throw new Error(`Mobile test failed: ${errorData.error?.message || mobileResponse.statusText} (${mobileResponse.status})`);
    }
    
    const mobileData = await mobileResponse.json();
    
    // Check for API errors in response
    if (mobileData.error) {
      throw new Error(`API Error: ${mobileData.error.message || 'Unknown error'}`);
    }
    
    // Desktop test
    const desktopResponse = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=desktop&key=${API_KEY}`
    );
    
    if (!desktopResponse.ok) {
      const errorData = await desktopResponse.json().catch(() => ({}));
      throw new Error(`Desktop test failed: ${errorData.error?.message || desktopResponse.statusText} (${desktopResponse.status})`);
    }
    
    const desktopData = await desktopResponse.json();
    
    // Check for API errors in response
    if (desktopData.error) {
      throw new Error(`API Error: ${desktopData.error.message || 'Unknown error'}`);
    }
    
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
    
    return {
      loadingTime,
      mobileScore,
      desktopScore,
      keyIssues: keyIssues.length > 0 ? keyIssues : ['No major issues detected'],
      status,
    };
  } catch (error) {
    console.error('Speed test error:', error);
    // Re-throw the error instead of using mock data
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred while running the speed test');
  }
}
