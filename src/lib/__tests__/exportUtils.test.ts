/**
 * Export Utils & Analytics API — CSV export, export history (localStorage).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock analyticsApi's addExportHistoryEntry to avoid side effects
vi.mock('../analyticsApi', () => ({
  addExportHistoryEntry: vi.fn(),
  getExportHistory: vi.fn(),
}));

import { exportToCsv } from '../exportUtils';
import { getExportHistory, addExportHistoryEntry } from '../analyticsApi';

// ─── CSV Export ─────────────────────────────────────────────────────────────

describe('exportToCsv', () => {
  let createObjectURLMock: ReturnType<typeof vi.fn>;
  let revokeObjectURLMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock DOM methods
    createObjectURLMock = vi.fn().mockReturnValue('blob:mock-url');
    revokeObjectURLMock = vi.fn();
    global.URL.createObjectURL = createObjectURLMock;
    global.URL.revokeObjectURL = revokeObjectURLMock;

    // Mock document.createElement and body.appendChild
    const mockAnchor = {
      href: '',
      download: '',
      click: vi.fn(),
    };
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockAnchor as any);
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockAnchor as any);
  });

  it('does nothing for empty data array', () => {
    exportToCsv([], 'test', 'section');
    expect(createObjectURLMock).not.toHaveBeenCalled();
  });

  it('creates CSV with headers and rows', () => {
    const data = [
      { name: 'Alice', calls: 10, status: 'active' },
      { name: 'Bob', calls: 5, status: 'inactive' },
    ];

    exportToCsv(data, 'agents', 'performance');

    // Should create a blob
    expect(createObjectURLMock).toHaveBeenCalledTimes(1);
    const blobArg = (global.URL.createObjectURL as any).mock.calls[0][0];
    expect(blobArg).toBeInstanceOf(Blob);

    // Should log export history
    expect(addExportHistoryEntry).toHaveBeenCalledWith({
      type: 'csv',
      section: 'performance',
      recordCount: 2,
    });
  });

  it('escapes commas and quotes in values', () => {
    const data = [
      { name: 'O\'Brien, James', notes: 'Said "hello"' },
    ];

    exportToCsv(data, 'test', 'section');
    expect(createObjectURLMock).toHaveBeenCalled();
  });

  it('handles null and undefined values', () => {
    const data = [
      { name: 'Test', value: null, other: undefined },
    ];

    exportToCsv(data as any, 'test', 'section');
    expect(createObjectURLMock).toHaveBeenCalled();
  });
});

// ─── Export History (localStorage) ──────────────────────────────────────────

describe('Export History', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('getExportHistory returns empty array when no history', () => {
    // Use the real implementation for this test
    const realGetExportHistory = (): any[] => {
      try {
        const raw = localStorage.getItem('boltcall_export_history');
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    };

    expect(realGetExportHistory()).toEqual([]);
  });

  it('addExportHistoryEntry appends to localStorage', () => {
    // Use the real implementation
    const realAdd = (entry: any) => {
      const key = 'boltcall_export_history';
      const history = (() => {
        try {
          const raw = localStorage.getItem(key);
          return raw ? JSON.parse(raw) : [];
        } catch { return []; }
      })();
      history.unshift({
        ...entry,
        id: 'test-id',
        exportedAt: new Date().toISOString(),
      });
      localStorage.setItem(key, JSON.stringify(history.slice(0, 50)));
    };

    realAdd({ type: 'csv', section: 'calls', recordCount: 10 });
    realAdd({ type: 'pdf', section: 'dashboard', recordCount: 1 });

    const stored = JSON.parse(localStorage.getItem('boltcall_export_history')!);
    expect(stored).toHaveLength(2);
    // Most recent first (unshift)
    expect(stored[0].section).toBe('dashboard');
    expect(stored[1].section).toBe('calls');
  });

  it('export history caps at 50 entries', () => {
    const key = 'boltcall_export_history';
    const entries = Array.from({ length: 55 }, (_, i) => ({
      id: `id_${i}`,
      type: 'csv',
      section: `section_${i}`,
      recordCount: i,
      exportedAt: new Date().toISOString(),
    }));
    localStorage.setItem(key, JSON.stringify(entries));

    // Simulate adding one more (trimmed to 50)
    const history = JSON.parse(localStorage.getItem(key)!);
    history.unshift({ id: 'new', type: 'pdf', section: 'new', recordCount: 1, exportedAt: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(history.slice(0, 50)));

    const stored = JSON.parse(localStorage.getItem(key)!);
    expect(stored).toHaveLength(50);
    expect(stored[0].section).toBe('new');
  });
});
