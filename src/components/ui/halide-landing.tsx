import React, { useEffect, useRef } from 'react';

export const HalideLanding: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (window.innerWidth / 2 - e.pageX) / 25;
      const y = (window.innerHeight / 2 - e.pageY) / 25;

      canvas.style.transform = `rotateX(${55 + y / 2}deg) rotateZ(${-25 + x / 2}deg)`;

      layersRef.current.forEach((layer, index) => {
        if (!layer) return;
        const depth = (index + 1) * 15;
        const moveX = x * (index + 1) * 0.2;
        const moveY = y * (index + 1) * 0.2;
        layer.style.transform = `translateZ(${depth}px) translate(${moveX}px, ${moveY}px)`;
      });
    };

    canvas.style.opacity = '0';
    canvas.style.transform = 'rotateX(90deg) rotateZ(0deg) scale(0.8)';

    const timeout = setTimeout(() => {
      canvas.style.transition = 'all 2.5s cubic-bezier(0.16, 1, 0.3, 1)';
      canvas.style.opacity = '1';
      canvas.style.transform = 'rotateX(55deg) rotateZ(-25deg) scale(1)';
    }, 300);

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&display=swap');

        :root {
          --halide-bg: #0a0a0a;
          --halide-silver: #e0e0e0;
          --halide-accent: #ff3c00;
          --halide-grain-opacity: 0.15;
        }

        .halide-body {
          background-color: var(--halide-bg);
          color: var(--halide-silver);
          font-family: 'Syncopate', sans-serif;
          overflow: hidden;
          height: 100vh;
          width: 100vw;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .halide-grain {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none;
          z-index: 100;
          opacity: var(--halide-grain-opacity);
        }

        .halide-viewport {
          perspective: 2000px;
          width: 100vw; height: 100vh;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
        }

        .halide-canvas-3d {
          position: relative;
          width: 800px; height: 500px;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .halide-layer {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(224, 224, 224, 0.1);
          background-size: cover;
          background-position: center;
          transition: transform 0.5s ease;
        }

        .halide-layer-1 { background-image: url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200'); filter: grayscale(1) contrast(1.2) brightness(0.5); }
        .halide-layer-2 { background-image: url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200'); filter: grayscale(1) contrast(1.1) brightness(0.7); opacity: 0.6; mix-blend-mode: screen; }
        .halide-layer-3 { background-image: url('https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=1200'); filter: grayscale(1) contrast(1.3) brightness(0.8); opacity: 0.4; mix-blend-mode: overlay; }

        .halide-contours {
          position: absolute;
          width: 200%; height: 200%;
          top: -50%; left: -50%;
          background-image: repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 40px, rgba(255,255,255,0.05) 41px, transparent 42px);
          transform: translateZ(120px);
          pointer-events: none;
        }

        .halide-interface-grid {
          position: fixed;
          inset: 0;
          padding: 4rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: auto 1fr auto;
          z-index: 10;
          pointer-events: none;
        }

        .halide-hero-title {
          grid-column: 1 / -1;
          align-self: center;
          font-size: clamp(3rem, 10vw, 10rem);
          line-height: 0.85;
          letter-spacing: -0.04em;
          mix-blend-mode: difference;
        }

        .halide-cta-button {
          pointer-events: auto;
          background: var(--halide-silver);
          color: var(--halide-bg);
          padding: 1rem 2rem;
          text-decoration: none;
          font-weight: 700;
          clip-path: polygon(0 0, 100% 0, 100% 70%, 85% 100%, 0 100%);
          transition: 0.3s;
        }

        .halide-cta-button:hover { background: var(--halide-accent); transform: translateY(-5px); }

        .halide-lead-copy {
          font-size: 0.8rem;
          line-height: 1.4;
          color: rgba(224, 224, 224, 0.85);
          max-width: 280px;
        }
        .halide-lead-copy p { margin: 0; }

        .halide-logo-link {
          display: block;
          pointer-events: auto;
          align-self: start;
          margin-top: -0.5rem;
        }
        .halide-logo {
          height: 3.25rem;
          width: auto;
          max-width: 200px;
          object-fit: contain;
          filter: brightness(0) invert(1);
        }

        .halide-scroll-hint {
          position: absolute;
          bottom: 2rem; left: 50%;
          width: 1px; height: 60px;
          background: linear-gradient(to bottom, var(--halide-silver), transparent);
          animation: halide-flow 2s infinite ease-in-out;
        }

        @keyframes halide-flow {
          0%, 100% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          51% { transform: scaleY(1); transform-origin: bottom; }
        }
      `}</style>

      <div className="halide-body">
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <filter id="halide-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </svg>

        <div className="halide-grain" style={{ filter: 'url(#halide-grain)' }}></div>

        <div className="halide-interface-grid">
          <a href="/" className="halide-logo-link">
            <img src="/boltcall_full_logo.png" alt="Boltcall" className="halide-logo" />
          </a>
          <div />

          <h1 className="halide-hero-title">SILVER<br />SULPHIDE</h1>

          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div className="halide-lead-copy">
              <p>Free guide: actionable tips to capture more leads and never miss a call. One email, instant access.</p>
            </div>
            <a
              href="#lead-form"
              className="halide-cta-button"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              GET RESOURCE
            </a>
          </div>
        </div>

        <div className="halide-viewport">
          <div className="halide-canvas-3d" ref={canvasRef}>
            <div className="halide-layer halide-layer-1" ref={(el) => { if (el) layersRef.current[0] = el; }}></div>
            <div className="halide-layer halide-layer-2" ref={(el) => { if (el) layersRef.current[1] = el; }}></div>
            <div className="halide-layer halide-layer-3" ref={(el) => { if (el) layersRef.current[2] = el; }}></div>
            <div className="halide-contours"></div>
          </div>
        </div>

        <div className="halide-scroll-hint"></div>
      </div>
    </>
  );
};
