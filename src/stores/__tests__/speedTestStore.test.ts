import { describe, it, expect, beforeEach } from 'vitest';
import { useSpeedTestStore } from '../speedTestStore';

describe('speedTestStore', () => {
  beforeEach(() => {
    useSpeedTestStore.getState().reset();
  });

  describe('initial state', () => {
    it('starts with empty defaults', () => {
      const state = useSpeedTestStore.getState();
      expect(state.url).toBe('');
      expect(state.email).toBe('');
      expect(state.password).toBe('');
      expect(state.results).toBeNull();
      expect(state.webhookResults).toBeNull();
    });
  });

  describe('setUrl', () => {
    it('sets the url', () => {
      useSpeedTestStore.getState().setUrl('https://example.com');
      expect(useSpeedTestStore.getState().url).toBe('https://example.com');
    });

    it('overwrites previous url', () => {
      useSpeedTestStore.getState().setUrl('https://first.com');
      useSpeedTestStore.getState().setUrl('https://second.com');
      expect(useSpeedTestStore.getState().url).toBe('https://second.com');
    });
  });

  describe('setCredentials', () => {
    it('sets email and password together', () => {
      useSpeedTestStore.getState().setCredentials('test@example.com', 'pass123');
      const state = useSpeedTestStore.getState();
      expect(state.email).toBe('test@example.com');
      expect(state.password).toBe('pass123');
    });

    it('does not affect other fields', () => {
      useSpeedTestStore.getState().setUrl('https://example.com');
      useSpeedTestStore.getState().setCredentials('test@example.com', 'pass123');
      expect(useSpeedTestStore.getState().url).toBe('https://example.com');
    });
  });

  describe('setResults', () => {
    it('sets speed test results', () => {
      const results = {
        loadingTime: 2.5,
        mobileScore: 72,
        desktopScore: 91,
        keyIssues: ['Large images', 'No caching'],
        status: 'average' as const,
      };
      useSpeedTestStore.getState().setResults(results);
      expect(useSpeedTestStore.getState().results).toEqual(results);
    });

    it('can set results to null', () => {
      useSpeedTestStore.getState().setResults({
        loadingTime: 1, mobileScore: 90, desktopScore: 95, keyIssues: [], status: 'fast',
      });
      useSpeedTestStore.getState().setResults(null);
      expect(useSpeedTestStore.getState().results).toBeNull();
    });
  });

  describe('setWebhookResults', () => {
    it('sets webhook results', () => {
      const webhookData = { score: 85, suggestions: ['Minify CSS'] };
      useSpeedTestStore.getState().setWebhookResults(webhookData);
      expect(useSpeedTestStore.getState().webhookResults).toEqual(webhookData);
    });
  });

  describe('reset', () => {
    it('resets all fields to defaults', () => {
      useSpeedTestStore.getState().setUrl('https://example.com');
      useSpeedTestStore.getState().setCredentials('a@b.com', 'pass');
      useSpeedTestStore.getState().setResults({
        loadingTime: 1, mobileScore: 90, desktopScore: 95, keyIssues: [], status: 'fast',
      });
      useSpeedTestStore.getState().setWebhookResults({ data: true });

      useSpeedTestStore.getState().reset();

      const state = useSpeedTestStore.getState();
      expect(state.url).toBe('');
      expect(state.email).toBe('');
      expect(state.password).toBe('');
      expect(state.results).toBeNull();
      expect(state.webhookResults).toBeNull();
    });
  });
});
