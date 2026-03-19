import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';

const TOTAL_SEGMENTS = 20;

const LOADER_WORDS = [
  'Analyzing',
  'Building',
  'Configuring',
  'Connecting',
  'Polishing',
  'Finalizing',
];

const LOADING_STEPS = [
  { at: 0, text: 'Initializing your workspace...' },
  { at: 8, text: 'Setting up your AI receptionist...' },
  { at: 22, text: 'Configuring call handling...' },
  { at: 40, text: 'Connecting your integrations...' },
  { at: 60, text: 'Preparing your dashboard...' },
  { at: 80, text: 'Almost ready...' },
  { at: 100, text: 'Done!' },
];

const SetupLoading: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(LOADING_STEPS[0].text);
  const [fadeOut, setFadeOut] = useState(false);
  const wordLoaderRef = useRef<HTMLDivElement>(null);
  const wordLoaderStopped = useRef(false);
  const segmentsBuilt = useRef(false);

  // Build segmented bar
  const buildSegments = useCallback(() => {
    const bar = document.getElementById('segmented-bar');
    if (!bar || segmentsBuilt.current) return;
    segmentsBuilt.current = true;
    bar.innerHTML = '';
    for (let i = 0; i < TOTAL_SEGMENTS; i++) {
      const seg = document.createElement('div');
      seg.className = 'setup-seg';
      bar.appendChild(seg);
    }
  }, []);

  // Update progress bar segments
  const updateSegments = useCallback((pct: number) => {
    const filled = Math.round((pct / 100) * TOTAL_SEGMENTS);
    const segs = document.querySelectorAll('.setup-seg');
    segs.forEach((s, i) => {
      if (i < filled) {
        s.classList.add('filled');
        if (i === filled - 1) {
          s.classList.add('pop');
          setTimeout(() => s.classList.remove('pop'), 300);
        }
      } else {
        s.classList.remove('filled', 'pop');
      }
    });
  }, []);

  // Character animation helpers
  const animateCharsIn = useCallback((wordIndex: number, duration: number): Promise<void> => {
    const chars = document.querySelectorAll(`.setup-word-${wordIndex} .setup-char`);
    return new Promise(resolve => {
      let completed = 0;
      if (chars.length === 0) { resolve(); return; }
      chars.forEach((ch, i) => {
        const el = ch as HTMLElement;
        setTimeout(() => {
          el.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          completed++;
          if (completed === chars.length) setTimeout(resolve, duration);
        }, i * 40);
      });
    });
  }, []);

  const animateCharsOut = useCallback((wordIndex: number, duration: number): Promise<void> => {
    const chars = document.querySelectorAll(`.setup-word-${wordIndex} .setup-char`);
    return new Promise(resolve => {
      let completed = 0;
      if (chars.length === 0) { resolve(); return; }
      chars.forEach((ch, i) => {
        const el = ch as HTMLElement;
        setTimeout(() => {
          el.style.transition = `opacity ${duration}ms ease-in, transform ${duration}ms ease-in`;
          el.style.opacity = '0';
          el.style.transform = 'translateY(-8px)';
          completed++;
          if (completed === chars.length) setTimeout(resolve, duration);
        }, i * 40);
      });
    });
  }, []);

  // Build word loader DOM
  const buildWordLoader = useCallback(() => {
    const container = wordLoaderRef.current;
    if (!container) return;
    container.innerHTML = '';
    const allWords = [...LOADER_WORDS, 'Done!'];
    allWords.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = `setup-word setup-word-${i}`;
      if (i === allWords.length - 1) span.classList.add('setup-done-word');
      word.split('').forEach(ch => {
        const c = document.createElement('span');
        c.className = 'setup-char';
        c.textContent = ch === ' ' ? '\u00A0' : ch;
        span.appendChild(c);
      });
      container.appendChild(span);
    });
  }, []);

  // Run word cycling animation
  const runWordLoader = useCallback(async () => {
    const allWords = [...LOADER_WORDS, 'Done!'];
    for (let i = 0; i < allWords.length; i++) {
      if (wordLoaderStopped.current) return;
      await animateCharsIn(i, 350);
      if (i < allWords.length - 1) {
        await new Promise(r => setTimeout(r, 2000));
        await animateCharsOut(i, 300);
        await new Promise(r => setTimeout(r, 200));
      }
    }
  }, [animateCharsIn, animateCharsOut]);

  // Main effect: run loading animation
  useEffect(() => {
    buildSegments();
    buildWordLoader();

    // Start word cycling
    runWordLoader();

    // Animate progress from 0 to 100 over ~12 seconds
    const totalDuration = 12000;
    const intervalMs = 80;
    const steps = totalDuration / intervalMs;
    const increment = 100 / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += increment;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);

        // At 100%, wait a beat then fade out and navigate
        setTimeout(() => {
          wordLoaderStopped.current = true;
          setFadeOut(true);

          // Navigate after fade-out transition completes
          setTimeout(() => {
            navigate('/dashboard?setupCompleted=true', { replace: true });
          }, 800);
        }, 600);
      }

      setProgress(current);
      updateSegments(current);

      // Update step text
      const step = [...LOADING_STEPS].reverse().find(s => current >= s.at);
      if (step) setCurrentStep(step.text);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [buildSegments, buildWordLoader, runWordLoader, updateSegments, navigate]);

  return (
    <>
      <style>{`
        .setup-loading-page {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: opacity 700ms ease-in-out;
        }
        .setup-loading-page.fade-out {
          opacity: 0;
        }
        .setup-loading-content {
          width: 100%;
          max-width: 420px;
          padding: 0 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }
        .setup-loading-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #2563eb, #38bdf8);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: setup-icon-pulse 2s ease-in-out infinite;
        }
        @keyframes setup-icon-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .setup-loading-icon svg {
          width: 28px;
          height: 28px;
          color: white;
        }
        .setup-loading-title {
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
          text-align: center;
          letter-spacing: -0.02em;
        }
        .setup-loading-subtitle {
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 0.85rem;
          color: #9ca3af;
          text-align: center;
          margin-top: -1rem;
          line-height: 1.5;
        }

        /* Word Loader */
        .setup-word-loader {
          position: relative;
          height: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          width: 100%;
        }
        .setup-word {
          position: absolute;
          display: flex;
          gap: 2px;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 1.4rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #111827;
          text-transform: uppercase;
        }
        .setup-done-word {
          color: #2563eb;
        }
        .setup-char {
          display: inline-block;
          opacity: 0;
          transform: translateY(12px);
        }

        /* Progress */
        .setup-progress-wrapper {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .setup-progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .setup-progress-label {
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          color: #9ca3af;
        }
        .setup-progress-pct {
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          color: #111827;
          font-variant-numeric: tabular-nums;
        }
        .setup-segmented-bar {
          display: flex;
          gap: 3px;
          padding: 2px 0;
        }
        .setup-seg {
          flex: 1;
          height: 12px;
          border-radius: 4px;
          background: #e5e7eb;
          opacity: 0.5;
          transition: background 0.4s ease, opacity 0.4s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1);
        }
        .setup-seg.filled {
          background: #2563eb;
          opacity: 1;
        }
        .setup-seg.filled.pop {
          transform: scaleY(1.35) translateY(-1px);
        }
        .setup-loading-step {
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 0.75rem;
          color: #9ca3af;
          text-align: center;
          min-height: 1.2em;
          transition: opacity 0.3s ease;
        }
      `}</style>

      <div className={`setup-loading-page ${fadeOut ? 'fade-out' : ''}`}>
        <div className="setup-loading-content">
          <div className="setup-loading-icon">
            <Zap />
          </div>

          <div className="setup-loading-title">Setting up your dashboard</div>
          <div className="setup-loading-subtitle">
            Configuring AI receptionist, connecting services...
          </div>

          <div className="setup-word-loader" ref={wordLoaderRef} />

          <div className="setup-progress-wrapper">
            <div className="setup-progress-header">
              <span className="setup-progress-label">Loading</span>
              <span className="setup-progress-pct">{Math.round(progress)}%</span>
            </div>
            <div className="setup-segmented-bar" id="segmented-bar" />
            <div className="setup-loading-step">{currentStep}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SetupLoading;
