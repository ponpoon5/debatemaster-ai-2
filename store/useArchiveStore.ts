/**
 * Archive Store
 * ディベートアーカイブとHomeworkタスクのグローバル状態管理
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  DebateArchive,
  DebateSettings,
  DebateMasterBackup,
  HomeworkTask,
  WeaknessProfile,
  STORAGE_KEY,
} from '../core/types';
import { updateWeaknessProfile } from '../hooks/useWeaknessProfile';
import { createBackupObject, migrateToLatest } from '../services/persistence/backup';

interface ArchiveStore {
  backupState: DebateMasterBackup;

  // Archive Actions
  addArchive: (archive: DebateArchive, currentSettings?: DebateSettings) => void;
  deleteArchive: (id: string) => void;

  // Homework Actions
  addHomework: (tasks: HomeworkTask[]) => void;
  completeHomework: (taskId: string, evidenceText: string) => void;
  deleteHomework: (taskId: string) => void;

  // Backup State Update
  setBackupState: (state: DebateMasterBackup) => void;

  // Getters
  getArchives: () => DebateArchive[];
  getHomeworkTasks: () => HomeworkTask[];
  getWeaknessProfile: () => WeaknessProfile;
  getSettings: () => DebateSettings | undefined;
}

const initialBackupState = (): DebateMasterBackup => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return migrateToLatest(parsed);
    }
  } catch (e) {
    console.error('❌ Failed to load archives from storage:', e);
  }
  return createBackupObject([]);
};

export const useArchiveStore = create<ArchiveStore>()(
  persist(
    (set, get) => ({
      backupState: initialBackupState(),

  addArchive: (archive: DebateArchive, currentSettings?: DebateSettings) =>
    set((state) => {
      // Automatically update weakness profile based on session metrics
      const newProfile = updateWeaknessProfile(
        state.backupState.weaknessProfile,
        archive.feedback.sessionMetrics
      );

      return {
        backupState: {
          ...state.backupState,
          exportedAt: new Date().toISOString(),
          settings: currentSettings || state.backupState.settings,
          archives: [...state.backupState.archives, archive],
          weaknessProfile: newProfile,
        },
      };
    }),

  deleteArchive: (id: string) =>
    set((state) => ({
      backupState: {
        ...state.backupState,
        archives: state.backupState.archives.filter((a) => a.id !== id),
      },
    })),

  addHomework: (tasks: HomeworkTask[]) =>
    set((state) => ({
      backupState: {
        ...state.backupState,
        homeworkTasks: [...state.backupState.homeworkTasks, ...tasks],
      },
    })),

  completeHomework: (taskId: string, evidenceText: string) =>
    set((state) => ({
      backupState: {
        ...state.backupState,
        homeworkTasks: state.backupState.homeworkTasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                status: 'completed' as const,
                completedAt: new Date().toISOString(),
                evidence: {
                  type: 'text' as const,
                  content: evidenceText,
                  createdAt: new Date().toISOString(),
                },
              }
            : t
        ),
      },
    })),

  deleteHomework: (taskId: string) =>
    set((state) => ({
      backupState: {
        ...state.backupState,
        homeworkTasks: state.backupState.homeworkTasks.filter((t) => t.id !== taskId),
      },
    })),

  setBackupState: (state: DebateMasterBackup) =>
    set({ backupState: state }),

      // Getters
      getArchives: () => get().backupState.archives,
      getHomeworkTasks: () => get().backupState.homeworkTasks,
      getWeaknessProfile: () => get().backupState.weaknessProfile,
      getSettings: () => get().backupState.settings,
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ backupState: state.backupState }),
    }
  )
);
