import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockSingle = vi.fn();
const mockOrder = vi.fn();
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockEq = vi.fn();

vi.mock('../supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: mockInsert,
      select: mockSelect,
      eq: mockEq,
    })),
  },
}));

import { LocationService } from '../locations';
import { supabase } from '../supabase';

describe('LocationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset chain mocks
    mockSingle.mockReset();
    mockOrder.mockReset();
    mockSelect.mockReset();
    mockInsert.mockReset();
    mockEq.mockReset();
  });

  describe('create', () => {
    it('should insert a new location and return it', async () => {
      const newLocation = {
        id: 'loc-1',
        business_profile_id: 'bp-1',
        user_id: 'user-1',
        name: 'Main Office',
        is_primary: true,
        is_active: true,
        created_at: '2025-01-01',
        updated_at: '2025-01-01',
      };

      // Setup chain: insert -> select -> single
      mockSingle.mockResolvedValue({ data: newLocation, error: null });
      mockSelect.mockReturnValue({ single: mockSingle });
      mockInsert.mockReturnValue({ select: mockSelect });

      const result = await LocationService.create({
        business_profile_id: 'bp-1',
        user_id: 'user-1',
        name: 'Main Office',
        is_primary: true,
        is_active: true,
      });

      expect(supabase.from).toHaveBeenCalledWith('locations');
      expect(result).toEqual(newLocation);
    });

    it('should throw on supabase error', async () => {
      mockSingle.mockResolvedValue({ data: null, error: { message: 'Insert failed' } });
      mockSelect.mockReturnValue({ single: mockSingle });
      mockInsert.mockReturnValue({ select: mockSelect });

      await expect(
        LocationService.create({
          business_profile_id: 'bp-1',
          user_id: 'user-1',
          name: 'Test',
          is_primary: false,
          is_active: true,
        })
      ).rejects.toThrow('Insert failed');
    });
  });

  describe('listByBusinessProfile', () => {
    it('should return locations ordered by is_primary and created_at', async () => {
      const locations = [
        { id: 'loc-1', name: 'Main', is_primary: true },
        { id: 'loc-2', name: 'Branch', is_primary: false },
      ];

      // Chain: select -> eq -> order -> order
      const secondOrder = vi.fn().mockResolvedValue({ data: locations, error: null });
      const firstOrder = vi.fn().mockReturnValue({ order: secondOrder });
      mockEq.mockReturnValue({ order: firstOrder });
      mockSelect.mockReturnValue({ eq: mockEq });

      const result = await LocationService.listByBusinessProfile('bp-1');
      expect(supabase.from).toHaveBeenCalledWith('locations');
      expect(result).toEqual(locations);
    });

    it('should return empty array when no locations found', async () => {
      const secondOrder = vi.fn().mockResolvedValue({ data: null, error: null });
      const firstOrder = vi.fn().mockReturnValue({ order: secondOrder });
      mockEq.mockReturnValue({ order: firstOrder });
      mockSelect.mockReturnValue({ eq: mockEq });

      const result = await LocationService.listByBusinessProfile('bp-none');
      expect(result).toEqual([]);
    });

    it('should throw on error', async () => {
      const secondOrder = vi.fn().mockResolvedValue({ data: null, error: { message: 'Query failed' } });
      const firstOrder = vi.fn().mockReturnValue({ order: secondOrder });
      mockEq.mockReturnValue({ order: firstOrder });
      mockSelect.mockReturnValue({ eq: mockEq });

      await expect(
        LocationService.listByBusinessProfile('bp-1')
      ).rejects.toThrow('Query failed');
    });
  });

  describe('get', () => {
    it('should return a location by id', async () => {
      const location = { id: 'loc-1', name: 'Main Office' };
      mockSingle.mockResolvedValue({ data: location, error: null });
      mockEq.mockReturnValue({ single: mockSingle });
      mockSelect.mockReturnValue({ eq: mockEq });

      const result = await LocationService.get('loc-1');
      expect(supabase.from).toHaveBeenCalledWith('locations');
      expect(result).toEqual(location);
    });

    it('should return null when location not found', async () => {
      mockSingle.mockResolvedValue({ data: null, error: { message: 'Not found' } });
      mockEq.mockReturnValue({ single: mockSingle });
      mockSelect.mockReturnValue({ eq: mockEq });

      const result = await LocationService.get('loc-nonexistent');
      expect(result).toBeNull();
    });
  });
});
