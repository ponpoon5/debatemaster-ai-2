import { useState, useEffect } from 'react';
import {
  DebateArchive,
  DebateSettings,
  DebateMasterBackup,
  STORAGE_KEY,
  HomeworkTask,
} from '../core/types';
import { createBackupObject, migrateToLatest } from '../services/persistence/backup';
import { updateWeaknessProfile } from './useWeaknessProfile';
import { useBackupRestore } from './useBackupRestore';
import { useToast } from './useToast';

/**
 * ディベートアーカイブとHomeworkタスクを管理するカスタムフック
 *
 * LocalStorageへの永続化、Archive・Homeworkの追加/削除、
 * バックアップ・リストア機能を提供する。
 */
export const useDebateArchives = () => {
  const { showError } = useToast();
  const [backupState, setBackupState] = useState<DebateMasterBackup>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return migrateToLatest(parsed);
      }
    } catch (e) {
      console.error('❌ Failed to load archives from storage:', e);
      showError('保存データの読み込みに失敗しました');
    }
    return createBackupObject([]);
  });

  // LocalStorageへの永続化
  useEffect(() => {
    if (backupState && backupState.schemaVersion) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(backupState));
      } catch (e) {
        console.error('❌ Failed to save archives to storage:', e);
        showError('保存データの書き込みに失敗しました');
      }
    }
  }, [backupState, showError]);

  // バックアップ・リストア機能
  const { exportData, importData } = useBackupRestore(backupState, setBackupState);

  // --- Archive Actions ---

  const addArchive = (archive: DebateArchive, currentSettings?: DebateSettings) => {
    setBackupState(prev => {
      // Automatically update weakness profile based on session metrics
      const newProfile = updateWeaknessProfile(
        prev.weaknessProfile,
        archive.feedback.sessionMetrics
      );

      return {
        ...prev,
        exportedAt: new Date().toISOString(),
        settings: currentSettings || prev.settings,
        archives: [...prev.archives, archive],
        weaknessProfile: newProfile,
      };
    });
  };

  const deleteArchive = (id: string) => {
    if (window.confirm('この履歴を削除してもよろしいですか？')) {
      setBackupState(prev => ({
        ...prev,
        archives: prev.archives.filter(a => a.id !== id),
      }));
    }
  };

  // --- Homework Actions ---

  const addHomework = (tasks: HomeworkTask[]) => {
    setBackupState(prev => ({
      ...prev,
      homeworkTasks: [...prev.homeworkTasks, ...tasks],
    }));
  };

  const completeHomework = (taskId: string, evidenceText: string) => {
    setBackupState(prev => ({
      ...prev,
      homeworkTasks: prev.homeworkTasks.map(t =>
        t.id === taskId
          ? {
              ...t,
              status: 'completed',
              completedAt: new Date().toISOString(),
              evidence: {
                type: 'text',
                content: evidenceText,
                createdAt: new Date().toISOString(),
              },
            }
          : t
      ),
    }));
  };

  const deleteHomework = (taskId: string) => {
    setBackupState(prev => ({
      ...prev,
      homeworkTasks: prev.homeworkTasks.filter(t => t.id !== taskId),
    }));
  };

  return {
    archives: backupState.archives,
    settings: backupState.settings,
    homeworkTasks: backupState.homeworkTasks,
    weaknessProfile: backupState.weaknessProfile,
    addArchive,
    deleteArchive,
    addHomework,
    completeHomework,
    deleteHomework,
    exportData,
    importData,
  };
};
