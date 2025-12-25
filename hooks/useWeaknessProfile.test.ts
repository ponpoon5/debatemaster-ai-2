import { describe, it, expect } from 'vitest';
import { updateWeaknessProfile } from './useWeaknessProfile';
import { WeaknessProfile, SessionMetric } from '../core/types';

describe('useWeaknessProfile', () => {
  describe('updateWeaknessProfile', () => {
    it('should return current profile if no new metrics', () => {
      const currentProfile: WeaknessProfile = {
        lastUpdated: '2025-01-01T00:00:00.000Z',
        metrics: {},
      };

      const result = updateWeaknessProfile(currentProfile, undefined);

      expect(result).toEqual(currentProfile);
    });

    it('should return current profile if new metrics is empty array', () => {
      const currentProfile: WeaknessProfile = {
        lastUpdated: '2025-01-01T00:00:00.000Z',
        metrics: {},
      };

      const result = updateWeaknessProfile(currentProfile, []);

      expect(result).toEqual(currentProfile);
    });

    it('should add new metric when it does not exist', () => {
      const currentProfile: WeaknessProfile = {
        lastUpdated: '2025-01-01T00:00:00.000Z',
        metrics: {},
      };

      const newMetrics: SessionMetric[] = [
        {
          key: 'logic_clarity',
          label: 'Logic Clarity',
          description: 'Clarity of logical reasoning',
          rate: { numerator: 8, denominator: 10 },
          score: 80,
          lastUpdated: '2025-01-02T00:00:00.000Z',
          sampleSize: 10,
        },
      ];

      const result = updateWeaknessProfile(currentProfile, newMetrics);

      expect(result.metrics['logic_clarity']).toBeDefined();
      expect(result.metrics['logic_clarity'].rate.numerator).toBe(8);
      expect(result.metrics['logic_clarity'].rate.denominator).toBe(10);
      expect(result.metrics['logic_clarity'].score).toBe(80);
      expect(result.metrics['logic_clarity'].sampleSize).toBe(10);
    });

    it('should accumulate numerator and denominator for existing metric', () => {
      const currentProfile: WeaknessProfile = {
        lastUpdated: '2025-01-01T00:00:00.000Z',
        metrics: {
          logic_clarity: {
            key: 'logic_clarity',
            label: 'Logic Clarity',
            description: '',
            rate: { numerator: 8, denominator: 10 },
            score: 80,
            lastUpdated: '2025-01-01T00:00:00.000Z',
            sampleSize: 10,
          },
        },
      };

      const newMetrics: SessionMetric[] = [
        {
          key: 'logic_clarity',
          label: 'Logic Clarity',
          description: '',
          rate: { numerator: 7, denominator: 10 },
          score: 70,
          lastUpdated: '2025-01-02T00:00:00.000Z',
          sampleSize: 10,
        },
      ];

      const result = updateWeaknessProfile(currentProfile, newMetrics);

      expect(result.metrics['logic_clarity'].rate.numerator).toBe(15); // 8 + 7
      expect(result.metrics['logic_clarity'].rate.denominator).toBe(20); // 10 + 10
      expect(result.metrics['logic_clarity'].score).toBe(75); // 15 / 20 * 100 = 75
      expect(result.metrics['logic_clarity'].sampleSize).toBe(20);
    });

    it('should recalculate score correctly', () => {
      const currentProfile: WeaknessProfile = {
        lastUpdated: '2025-01-01T00:00:00.000Z',
        metrics: {},
      };

      const newMetrics: SessionMetric[] = [
        {
          key: 'evidence_usage',
          label: 'Evidence Usage',
          description: '',
          rate: { numerator: 6, denominator: 8 },
          score: 75,
          lastUpdated: '2025-01-02T00:00:00.000Z',
          sampleSize: 8,
        },
      ];

      const result = updateWeaknessProfile(currentProfile, newMetrics);

      // 6 / 8 * 100 = 75
      expect(result.metrics['evidence_usage'].score).toBe(75);
    });

    it('should handle multiple new metrics', () => {
      const currentProfile: WeaknessProfile = {
        lastUpdated: '2025-01-01T00:00:00.000Z',
        metrics: {},
      };

      const newMetrics: SessionMetric[] = [
        {
          key: 'logic_clarity',
          label: 'Logic Clarity',
          description: '',
          rate: { numerator: 8, denominator: 10 },
          score: 80,
          lastUpdated: '2025-01-02T00:00:00.000Z',
          sampleSize: 10,
        },
        {
          key: 'evidence_usage',
          label: 'Evidence Usage',
          description: '',
          rate: { numerator: 6, denominator: 8 },
          score: 75,
          lastUpdated: '2025-01-02T00:00:00.000Z',
          sampleSize: 8,
        },
      ];

      const result = updateWeaknessProfile(currentProfile, newMetrics);

      expect(result.metrics['logic_clarity']).toBeDefined();
      expect(result.metrics['evidence_usage']).toBeDefined();
      expect(result.metrics['logic_clarity'].score).toBe(80);
      expect(result.metrics['evidence_usage'].score).toBe(75);
    });

    it('should update lastUpdated timestamp', () => {
      const currentProfile: WeaknessProfile = {
        lastUpdated: '2025-01-01T00:00:00.000Z',
        metrics: {},
      };

      const newMetrics: SessionMetric[] = [
        {
          key: 'logic_clarity',
          label: 'Logic Clarity',
          description: '',
          rate: { numerator: 8, denominator: 10 },
          score: 80,
          lastUpdated: '2025-01-02T00:00:00.000Z',
          sampleSize: 10,
        },
      ];

      const result = updateWeaknessProfile(currentProfile, newMetrics);

      expect(result.lastUpdated).not.toBe('2025-01-01T00:00:00.000Z');
      expect(new Date(result.lastUpdated).getTime()).toBeGreaterThan(
        new Date('2025-01-01T00:00:00.000Z').getTime()
      );
    });

    it('should handle zero denominator gracefully', () => {
      const currentProfile: WeaknessProfile = {
        lastUpdated: '2025-01-01T00:00:00.000Z',
        metrics: {},
      };

      const newMetrics: SessionMetric[] = [
        {
          key: 'logic_clarity',
          label: 'Logic Clarity',
          description: '',
          rate: { numerator: 0, denominator: 0 },
          score: 0,
          lastUpdated: '2025-01-02T00:00:00.000Z',
          sampleSize: 0,
        },
      ];

      const result = updateWeaknessProfile(currentProfile, newMetrics);

      expect(result.metrics['logic_clarity'].score).toBe(0);
      expect(result.metrics['logic_clarity'].sampleSize).toBe(0);
    });

    it('should preserve existing metrics when adding new ones', () => {
      const currentProfile: WeaknessProfile = {
        lastUpdated: '2025-01-01T00:00:00.000Z',
        metrics: {
          logic_clarity: {
            key: 'logic_clarity',
            label: 'Logic Clarity',
            description: '',
            rate: { numerator: 8, denominator: 10 },
            score: 80,
            lastUpdated: '2025-01-01T00:00:00.000Z',
            sampleSize: 10,
          },
        },
      };

      const newMetrics: SessionMetric[] = [
        {
          key: 'evidence_usage',
          label: 'Evidence Usage',
          description: '',
          rate: { numerator: 6, denominator: 8 },
          score: 75,
          lastUpdated: '2025-01-02T00:00:00.000Z',
          sampleSize: 8,
        },
      ];

      const result = updateWeaknessProfile(currentProfile, newMetrics);

      expect(result.metrics['logic_clarity']).toBeDefined();
      expect(result.metrics['logic_clarity'].score).toBe(80);
      expect(result.metrics['evidence_usage']).toBeDefined();
      expect(result.metrics['evidence_usage'].score).toBe(75);
    });

    it('should round score to nearest integer', () => {
      const currentProfile: WeaknessProfile = {
        lastUpdated: '2025-01-01T00:00:00.000Z',
        metrics: {},
      };

      const newMetrics: SessionMetric[] = [
        {
          key: 'logic_clarity',
          label: 'Logic Clarity',
          description: '',
          rate: { numerator: 2, denominator: 3 }, // 66.666...%
          score: 67,
          lastUpdated: '2025-01-02T00:00:00.000Z',
          sampleSize: 3,
        },
      ];

      const result = updateWeaknessProfile(currentProfile, newMetrics);

      // 2 / 3 * 100 = 66.666... -> Math.round = 67
      expect(result.metrics['logic_clarity'].score).toBe(67);
    });
  });
});
