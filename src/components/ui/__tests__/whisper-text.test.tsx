import { act, cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

function animationEngine() {
  const revert = vi.fn();
  return {
    registerPlugin: vi.fn(),
    context: vi.fn((animate: () => void) => { animate(); return { revert }; }),
    utils: { toArray: () => Array.from(document.querySelectorAll('[data-word]')) },
    set: vi.fn(), to: vi.fn(), revert,
  };
}

beforeEach(() => { vi.resetModules(); });
afterEach(() => { cleanup(); vi.doUnmock('gsap'); vi.doUnmock('gsap/ScrollTrigger'); vi.restoreAllMocks(); });

describe('WhisperText lazy animation lifecycle', () => {
  it('keeps text readable and handles an optional animation import failure locally', async () => {
    const loading = deferred<{ gsap: ReturnType<typeof animationEngine> }>();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.doMock('gsap', () => loading.promise);
    vi.doMock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }));
    const { default: WhisperText } = await import('../whisper-text');
    const view = render(<WhisperText text="Always readable" />);

    await act(async () => { loading.reject(new Error('Animation chunk unavailable')); await vi.dynamicImportSettled(); });

    expect(view.container.textContent).toBe('Alwaysreadable');
    expect(view.container.querySelector('[data-word]')).toBeVisible();
    expect(warn).toHaveBeenCalledWith('WhisperText animation unavailable; displaying static text.', expect.any(Error));
  });

  it('animates mounted text and reverts its GSAP context on unmount', async () => {
    const gsap = animationEngine();
    vi.doMock('gsap', () => ({ gsap }));
    vi.doMock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }));
    const { default: WhisperText } = await import('../whisper-text');
    const view = render(<WhisperText text="Animate safely" />);

    await act(async () => { await vi.dynamicImportSettled(); });

    expect(gsap.to).toHaveBeenCalledWith(expect.any(Array), expect.objectContaining({ opacity: 1, scrollTrigger: expect.objectContaining({ once: true }) }));
    view.unmount();
    expect(gsap.revert).toHaveBeenCalledTimes(1);
  });

  it('starts both module imports while mounted instead of starting another import after the first resolves', async () => {
    const gsap = animationEngine();
    const loading = deferred<{ gsap: typeof gsap }>();
    const importPlugin = vi.fn(() => ({ ScrollTrigger: {} }));
    vi.doMock('gsap', () => loading.promise);
    vi.doMock('gsap/ScrollTrigger', importPlugin);
    const { default: WhisperText } = await import('../whisper-text');
    const view = render(<WhisperText text="Loaded together" />);
    try {
      await waitFor(() => expect(importPlugin).toHaveBeenCalledTimes(1));
    } finally {
      view.unmount();
      await act(async () => { loading.resolve({ gsap }); await vi.dynamicImportSettled(); });
    }
  });

  it('does not register or start animations when loading finishes after unmount', async () => {
    const gsap = animationEngine();
    const loading = deferred<{ gsap: typeof gsap }>();
    vi.doMock('gsap', () => loading.promise);
    vi.doMock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }));
    const { default: WhisperText } = await import('../whisper-text');
    const view = render(<WhisperText text="Still readable" />);
    expect(view.container.textContent).toBe('Stillreadable');
    view.unmount();

    await act(async () => { loading.resolve({ gsap }); await vi.dynamicImportSettled(); });

    expect(gsap.registerPlugin).not.toHaveBeenCalled();
    expect(gsap.context).not.toHaveBeenCalled();
  });
});
