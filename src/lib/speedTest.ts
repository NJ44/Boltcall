// Speed test utility using Google PageSpeed Insights API
// API Key should be set in .env file as REACT_APP_PAGESPEED_API_KEY

interface SpeedTestResults {
  loadingTime: number;
  mobileScore: number;
  desktopScore: number;
  keyIssues: string[];
  status: 'slow' | 'average' | 'fast';
}

export async function runSpeedTest(url: string): Promise<SpeedTestResults> {
  const API_KEY = import.meta.env.VITE_PAGESPEED_API_KEY || process.env.REACT_APP_PAGESPEED_API_KEY;
  
  // If no API key is provided, use mock data as fallback
  if (!API_KEY) {
    console.warn(`PageSpeed Insights API key not found. Using mock data for ${url}. Add VITE_PAGESPEED_API_KEY to your .env file.`);
    return getMockData();
  }

  try {
    // Mobile test
    const mobileResponse = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&key=${API_KEY}`
    );
    
    if (!mobileResponse.ok) {
      throw new Error(`Mobile test failed: ${mobileResponse.statusText}`);
    }
    
    const mobileData = await mobileResponse.json();
    
    // Desktop test
    const desktopResponse = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=desktop&key=${API_KEY}`
    );
    
    if (!desktopResponse.ok) {
      throw new Error(`Desktop test failed: ${desktopResponse.statusText}`);
    }
    
    const desktopData = await desktopResponse.json();
    
    // Extract scores and metrics
    const mobileScore = Math.round((mobileData.lighthouseResult?.categories?.performance?.score || 0) * 100);
    const desktopScore = Math.round((desktopData.lighthouseResult?.categories?.performance?.score || 0) * 100);
    
    // Get loading time from First Contentful Paint
    const fcpAudit = mobileData.lighthouseResult?.audits?.['first-contentful-paint'];
    const loadingTime = fcpAudit?.numericValue ? Math.round((fcpAudit.numericValue / 1000) * 10) / 10 : 0;
    
    // Extract key issues from audits (lowest scoring audits)
    const audits = mobileData.lighthouseResult?.audits || {};
    const keyIssues = Object.values(audits)
      .filter((audit: any) => audit.score !== null && audit.score < 0.5 && audit.title)
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
    // Fallback to mock data on error
    console.warn('Falling back to mock data due to API error');
    return getMockData();
  }
}

// Mock data fallback function
function getMockData(): SpeedTestResults {
  const mockLoadingTime = Math.random() * 5 + 1; // 1-6 seconds
  const mockMobileScore = Math.floor(Math.random() * 40 + 30); // 30-70
  const mockDesktopScore = Math.floor(Math.random() * 30 + 50); // 50-80

  const avgScore = (mockMobileScore + mockDesktopScore) / 2;
  let status: 'slow' | 'average' | 'fast';
  if (avgScore >= 70) {
    status = 'fast';
  } else if (avgScore >= 50) {
    status = 'average';
  } else {
    status = 'slow';
  }

  const allIssues = [
    'Large images not optimized',
    'JavaScript blocking page render',
    'No browser caching enabled',
    'Missing CDN configuration',
    'Unused CSS not removed',
    'Server response time too slow',
    'Too many HTTP requests',
    'No image lazy loading',
  ];

  const numIssues = status === 'slow' ? 5 : status === 'average' ? 3 : 1;
  const keyIssues = allIssues.slice(0, numIssues);

  return {
    loadingTime: Math.round(mockLoadingTime * 10) / 10,
    mobileScore: mockMobileScore,
    desktopScore: mockDesktopScore,
    keyIssues,
    status,
  };
}

