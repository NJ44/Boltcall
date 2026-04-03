import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom";

// CustomEase is optional; we fall back to default ease if unavailable

export interface SterlingGateMenuItem {
  label: string;
  href: string;
  dataMenuFade?: boolean;
}

interface SterlingGateKineticNavigationProps {
  open: boolean;
  onClose: () => void;
  menuItems: SterlingGateMenuItem[];
}

export function SterlingGateKineticNavigation({
  open: isMenuOpen,
  onClose,
  menuItems,
}: SterlingGateKineticNavigationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Initial Setup & Hover Effects (shape hover)
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const menuItemsEl = containerRef.current!.querySelectorAll(".sterling-menu-list-item[data-shape]");
      const shapesContainer = containerRef.current!.querySelector(".sterling-ambient-shapes");

      menuItemsEl.forEach((item) => {
        const shapeIndex = item.getAttribute("data-shape");
        const shape = shapesContainer?.querySelector(`.sterling-bg-shape-${shapeIndex}`) ?? null;
        if (!shape) return;

        const shapeEls = shape.querySelectorAll(".sterling-shape-element");

        const onEnter = () => {
          shapesContainer?.querySelectorAll(".sterling-bg-shape").forEach((s) => s.classList.remove("sterling-active"));
          shape.classList.add("sterling-active");
          gsap.fromTo(
            shapeEls,
            { scale: 0.5, opacity: 0, rotation: -10 },
            { scale: 1, opacity: 1, rotation: 0, duration: 0.6, stagger: 0.08, ease: "back.out(1.7)", overwrite: "auto" }
          );
        };

        const onLeave = () => {
          gsap.to(shapeEls, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => shape.classList.remove("sterling-active"),
            overwrite: "auto",
          });
        };

        item.addEventListener("mouseenter", onEnter);
        item.addEventListener("mouseleave", onLeave);
        (item as HTMLElement & { _cleanup?: () => void })._cleanup = () => {
          item.removeEventListener("mouseenter", onEnter);
          item.removeEventListener("mouseleave", onLeave);
        };
      });
    }, containerRef);

    return () => {
      ctx.revert();
      containerRef.current?.querySelectorAll(".sterling-menu-list-item[data-shape]").forEach((item: Element) => {
        const el = item as HTMLElement & { _cleanup?: () => void };
        if (el._cleanup) el._cleanup();
      });
    };
  }, []);

  // Menu Open/Close Animation
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const navWrap = containerRef.current!.querySelector(".sterling-nav-overlay");
      const menu = containerRef.current!.querySelector(".sterling-menu-content");
      const overlay = containerRef.current!.querySelector(".sterling-overlay");
      const bgPanels = containerRef.current!.querySelectorAll(".sterling-backdrop-layer");
      const menuLinks = containerRef.current!.querySelectorAll(".sterling-nav-link");
      const fadeTargets = containerRef.current!.querySelectorAll("[data-menu-fade]");
      const closeBtn = containerRef.current!.querySelector(".sterling-close-btn");
      const closeBtnTexts = closeBtn?.querySelectorAll("p");
      const closeBtnIcon = closeBtn?.querySelector(".sterling-close-icon");

      const tl = gsap.timeline();

      if (isMenuOpen) {
        navWrap?.setAttribute("data-nav", "open");
        tl.set(navWrap, { display: "block" })
          .set(menu, { xPercent: 0 }, "<");
        if (closeBtnTexts?.length) tl.fromTo(closeBtnTexts, { yPercent: 0 }, { yPercent: -100, stagger: 0.2 });
        if (closeBtnIcon) tl.fromTo(closeBtnIcon, { rotate: 0 }, { rotate: 315 }, "<");
        tl.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, "<")
          .fromTo(bgPanels, { xPercent: 101 }, { xPercent: 0, stagger: 0.12, duration: 0.575 }, "<")
          .fromTo(menuLinks, { yPercent: 140, rotate: 10 }, { yPercent: 0, rotate: 0, stagger: 0.05 }, "<+=0.35");

        if (fadeTargets.length) {
          tl.fromTo(fadeTargets, { autoAlpha: 0, yPercent: 50 }, { autoAlpha: 1, yPercent: 0, stagger: 0.04, clearProps: "all" }, "<+=0.2");
        }
      } else {
        navWrap?.setAttribute("data-nav", "closed");
        tl.to(overlay, { autoAlpha: 0 })
          .to(menu, { xPercent: 120 }, "<");
        if (closeBtnTexts?.length) tl.to(closeBtnTexts, { yPercent: 0 }, "<");
        if (closeBtnIcon) tl.to(closeBtnIcon, { rotate: 0 }, "<");
        tl.set(navWrap, { display: "none" });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isMenuOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isMenuOpen, onClose]);

  return (
    <div ref={containerRef} className="sterling-kinetic-root">
      <section className="sterling-fullscreen-container">
        <div data-nav="closed" className="sterling-nav-overlay" style={{ display: "none" }}>
          <div className="sterling-overlay" onClick={onClose} aria-hidden="true" />
          <nav className="sterling-menu-content">
            <div className="sterling-menu-bg">
              <div className="sterling-backdrop-layer sterling-first" />
              <div className="sterling-backdrop-layer sterling-second" />
              <div className="sterling-backdrop-layer" />

              <div className="sterling-ambient-shapes">
                <svg className="sterling-bg-shape sterling-bg-shape-1" viewBox="0 0 400 400" fill="none">
                  <circle className="sterling-shape-element" cx="80" cy="120" r="40" fill="rgba(99,102,241,0.15)" />
                  <circle className="sterling-shape-element" cx="300" cy="80" r="60" fill="rgba(139,92,246,0.12)" />
                  <circle className="sterling-shape-element" cx="200" cy="300" r="80" fill="rgba(236,72,153,0.1)" />
                  <circle className="sterling-shape-element" cx="350" cy="280" r="30" fill="rgba(99,102,241,0.15)" />
                </svg>
                <svg className="sterling-bg-shape sterling-bg-shape-2" viewBox="0 0 400 400" fill="none">
                  <path className="sterling-shape-element" d="M0 200 Q100 100, 200 200 T 400 200" stroke="rgba(99,102,241,0.2)" strokeWidth="60" fill="none" />
                  <path className="sterling-shape-element" d="M0 280 Q100 180, 200 280 T 400 280" stroke="rgba(139,92,246,0.15)" strokeWidth="40" fill="none" />
                </svg>
                <svg className="sterling-bg-shape sterling-bg-shape-3" viewBox="0 0 400 400" fill="none">
                  {[50, 150, 250, 350].map((x, i) => (
                    <circle key={i} className="sterling-shape-element" cx={x} cy="50" r="8" fill={`rgba(${i % 3 === 0 ? "99,102,241" : i % 3 === 1 ? "139,92,246" : "236,72,153"},0.3)`} />
                  ))}
                  {[100, 200, 300].map((x, i) => (
                    <circle key={`r2-${i}`} className="sterling-shape-element" cx={x} cy="150" r="12" fill={`rgba(${["139,92,246", "236,72,153", "99,102,241"][i]},0.25)`} />
                  ))}
                  {[50, 150, 250, 350].map((x, i) => (
                    <circle key={`r3-${i}`} className="sterling-shape-element" cx={x} cy="250" r="10" fill={`rgba(${["236,72,153", "99,102,241", "139,92,246", "236,72,153"][i]},0.3)`} />
                  ))}
                  {[100, 200, 300].map((x, i) => (
                    <circle key={`r4-${i}`} className="sterling-shape-element" cx={x} cy="350" r="6" fill={`rgba(${["99,102,241", "139,92,246", "236,72,153"][i]},0.3)`} />
                  ))}
                </svg>
                <svg className="sterling-bg-shape sterling-bg-shape-4" viewBox="0 0 400 400" fill="none">
                  <path className="sterling-shape-element" d="M100 100 Q150 50, 200 100 Q250 150, 200 200 Q150 250, 100 200 Q50 150, 100 100" fill="rgba(99,102,241,0.12)" />
                  <path className="sterling-shape-element" d="M250 200 Q300 150, 350 200 Q400 250, 350 300 Q300 350, 250 300 Q200 250, 250 200" fill="rgba(236,72,153,0.1)" />
                </svg>
                <svg className="sterling-bg-shape sterling-bg-shape-5" viewBox="0 0 400 400" fill="none">
                  <line className="sterling-shape-element" x1="0" y1="100" x2="300" y2="400" stroke="rgba(99,102,241,0.15)" strokeWidth="30" />
                  <line className="sterling-shape-element" x1="100" y1="0" x2="400" y2="300" stroke="rgba(139,92,246,0.12)" strokeWidth="25" />
                  <line className="sterling-shape-element" x1="200" y1="0" x2="400" y2="200" stroke="rgba(236,72,153,0.1)" strokeWidth="20" />
                </svg>
              </div>
            </div>

            <div className="sterling-menu-content-inner">
              <button
                type="button"
                className="sterling-close-btn"
                onClick={onClose}
                aria-label="Close menu"
              >
                <div className="sterling-close-text">
                  <p className="sterling-p-large">Menu</p>
                  <p className="sterling-p-large">Close</p>
                </div>
                <div className="sterling-icon-wrap">
                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 16 16" fill="none" className="sterling-close-icon">
                    <path d="M7.33333 16L7.33333 -3.2055e-07L8.66667 -3.78832e-07L8.66667 16L7.33333 16Z" fill="currentColor" />
                    <path d="M16 8.66667L-2.62269e-07 8.66667L-3.78832e-07 7.33333L16 7.33333L16 8.66667Z" fill="currentColor" />
                    <path d="M6 7.33333L7.33333 7.33333L7.33333 6C7.33333 6.73637 6.73638 7.33333 6 7.33333Z" fill="currentColor" />
                    <path d="M10 7.33333L8.66667 7.33333L8.66667 6C8.66667 6.73638 9.26362 7.33333 10 7.33333Z" fill="currentColor" />
                    <path d="M6 8.66667L7.33333 8.66667L7.33333 10C7.33333 9.26362 6.73638 8.66667 6 8.66667Z" fill="currentColor" />
                    <path d="M10 8.66667L8.66667 8.66667L8.66667 10C8.66667 9.26362 9.26362 8.66667 10 8.66667Z" fill="currentColor" />
                  </svg>
                </div>
              </button>

              <ul className="sterling-menu-list">
                {menuItems.map((item, index) => (
                  <li key={item.href} className="sterling-menu-list-item" data-shape={String((index % 5) + 1)}>
                    <Link to={item.href} className="sterling-nav-link" onClick={onClose}>
                      <span className="sterling-nav-link-text" {...(item.dataMenuFade ? { "data-menu-fade": "" } : {})}>
                        {item.label}
                      </span>
                      <span className="sterling-nav-link-hover-bg" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}
