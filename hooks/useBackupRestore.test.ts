import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useBackupRestore } from './useBackupRestore';
import { DebateMasterBackup } from '../core/types';
import * as backupModule from '../services/persistence/backup';

// Mock useToast
vi.mock('./useToast', () => ({
  useToast: () => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
  }),
}));

describe('useBackupRestore', () => {
  let mockBackupState: DebateMasterBackup;
  let mockSetBackupState: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockBackupState = {
      schemaVersion: 1,
      exportedAt: '2025-01-01T00:00:00.000Z',
      settings: {
        mode: 'debate' as any,
        topic: 'Test Topic',
        stance: 'affirmative',
      },
      archives: [],
      homeworkTasks: [],
      weaknessProfile: {
        lastUpdated: '2025-01-01T00:00:00.000Z',
        metrics: {},
      },
    };

    mockSetBackupState = vi.fn();

    // Reset mocks
    vi.clearAllMocks();
  });

  describe('exportData', () => {
    it('should call downloadBackupFile with current backup state', () => {
      const downloadSpy = vi.spyOn(backupModule, 'downloadBackupFile').mockImplementation(() => {});

      const { result } = renderHook(() => useBackupRestore(mockBackupState, mockSetBackupState));

      result.current.exportData();

      expect(downloadSpy).toHaveBeenCalledWith(mockBackupState);
      expect(downloadSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('importData', () => {
    it('should validate backup and show error if invalid', async () => {
      const validateSpy = vi.spyOn(backupModule, 'validateBackup').mockReturnValue(false);

      const { result } = renderHook(() => useBackupRestore(mockBackupState, mockSetBackupState));

      const mockFile = new File(['{"invalid": "data"}'], 'backup.json', {
        type: 'application/json',
      });

      const success = await result.current.importData(mockFile);

      expect(validateSpy).toHaveBeenCalled();
      expect(success).toBe(false);
      expect(mockSetBackupState).not.toHaveBeenCalled();
    });

    it('should handle merge option (choice 1)', async () => {
      const importedBackup: DebateMasterBackup = {
        ...mockBackupState,
        archives: [{ id: 'test-archive' } as any],
      };

      vi.spyOn(backupModule, 'validateBackup').mockReturnValue(true);
      vi.spyOn(backupModule, 'migrateToLatest').mockReturnValue(importedBackup);
      const mergeSpy = vi
        .spyOn(backupModule, 'mergeBackups')
        .mockReturnValue({ ...mockBackupState, archives: [{ id: 'merged' } as any] });

      vi.spyOn(window, 'prompt').mockReturnValue('1');

      const { result } = renderHook(() => useBackupRestore(mockBackupState, mockSetBackupState));

      const mockFile = new File([JSON.stringify(importedBackup)], 'backup.json', {
        type: 'application/json',
      });

      const success = await result.current.importData(mockFile);

      await waitFor(() => {
        expect(mergeSpy).toHaveBeenCalledWith(mockBackupState, importedBackup);
        expect(mockSetBackupState).toHaveBeenCalled();
        expect(success).toBe(true);
      });
    });

    it('should handle replace option (choice 2) with confirmation', async () => {
      const importedBackup: DebateMasterBackup = {
        ...mockBackupState,
        archives: [{ id: 'test-archive' } as any],
      };

      vi.spyOn(backupModule, 'validateBackup').mockReturnValue(true);
      vi.spyOn(backupModule, 'migrateToLatest').mockReturnValue(importedBackup);

      vi.spyOn(window, 'prompt').mockReturnValue('2');
      vi.spyOn(window, 'confirm').mockReturnValue(true);

      const { result } = renderHook(() => useBackupRestore(mockBackupState, mockSetBackupState));

      const mockFile = new File([JSON.stringify(importedBackup)], 'backup.json', {
        type: 'application/json',
      });

      const success = await result.current.importData(mockFile);

      await waitFor(() => {
        expect(mockSetBackupState).toHaveBeenCalledWith(importedBackup);
        expect(success).toBe(true);
      });
    });

    it('should cancel replace if confirmation is denied', async () => {
      const importedBackup: DebateMasterBackup = {
        ...mockBackupState,
        archives: [{ id: 'test-archive' } as any],
      };

      vi.spyOn(backupModule, 'validateBackup').mockReturnValue(true);
      vi.spyOn(backupModule, 'migrateToLatest').mockReturnValue(importedBackup);

      vi.spyOn(window, 'prompt').mockReturnValue('2');
      vi.spyOn(window, 'confirm').mockReturnValue(false);

      const { result } = renderHook(() => useBackupRestore(mockBackupState, mockSetBackupState));

      const mockFile = new File([JSON.stringify(importedBackup)], 'backup.json', {
        type: 'application/json',
      });

      const success = await result.current.importData(mockFile);

      await waitFor(() => {
        expect(mockSetBackupState).not.toHaveBeenCalled();
        expect(success).toBe(false);
      });
    });

    it('should normalize full-width numbers in user choice', async () => {
      const importedBackup: DebateMasterBackup = {
        ...mockBackupState,
        archives: [{ id: 'test-archive' } as any],
      };

      vi.spyOn(backupModule, 'validateBackup').mockReturnValue(true);
      vi.spyOn(backupModule, 'migrateToLatest').mockReturnValue(importedBackup);
      const mergeSpy = vi
        .spyOn(backupModule, 'mergeBackups')
        .mockReturnValue({ ...mockBackupState, archives: [{ id: 'merged' } as any] });

      // Full-width "1" (U+FF11)
      vi.spyOn(window, 'prompt').mockReturnValue('１');

      const { result } = renderHook(() => useBackupRestore(mockBackupState, mockSetBackupState));

      const mockFile = new File([JSON.stringify(importedBackup)], 'backup.json', {
        type: 'application/json',
      });

      const success = await result.current.importData(mockFile);

      await waitFor(() => {
        expect(mergeSpy).toHaveBeenCalled();
        expect(success).toBe(true);
      });
    });

    it('should handle cancel (invalid choice)', async () => {
      const importedBackup: DebateMasterBackup = {
        ...mockBackupState,
        archives: [{ id: 'test-archive' } as any],
      };

      vi.spyOn(backupModule, 'validateBackup').mockReturnValue(true);
      vi.spyOn(backupModule, 'migrateToLatest').mockReturnValue(importedBackup);

      vi.spyOn(window, 'prompt').mockReturnValue('3'); // Invalid choice

      const { result } = renderHook(() => useBackupRestore(mockBackupState, mockSetBackupState));

      const mockFile = new File([JSON.stringify(importedBackup)], 'backup.json', {
        type: 'application/json',
      });

      const success = await result.current.importData(mockFile);

      await waitFor(() => {
        expect(mockSetBackupState).not.toHaveBeenCalled();
        expect(success).toBe(false);
      });
    });

    it('should handle JSON parse error', async () => {
      const { result } = renderHook(() => useBackupRestore(mockBackupState, mockSetBackupState));

      const mockFile = new File(['invalid json'], 'backup.json', {
        type: 'application/json',
      });

      const success = await result.current.importData(mockFile);

      await waitFor(() => {
        expect(mockSetBackupState).not.toHaveBeenCalled();
        expect(success).toBe(false);
      });
    });

    it('should handle null prompt (user cancelled)', async () => {
      const importedBackup: DebateMasterBackup = {
        ...mockBackupState,
        archives: [{ id: 'test-archive' } as any],
      };

      vi.spyOn(backupModule, 'validateBackup').mockReturnValue(true);
      vi.spyOn(backupModule, 'migrateToLatest').mockReturnValue(importedBackup);

      vi.spyOn(window, 'prompt').mockReturnValue(null);

      const { result } = renderHook(() => useBackupRestore(mockBackupState, mockSetBackupState));

      const mockFile = new File([JSON.stringify(importedBackup)], 'backup.json', {
        type: 'application/json',
      });

      const success = await result.current.importData(mockFile);

      await waitFor(() => {
        expect(mockSetBackupState).not.toHaveBeenCalled();
        expect(success).toBe(false);
      });
    });
  });
});
