import { useState, useEffect } from 'react';
import {
  DebateArchive,
  DebateSettings,
  DebateMasterBackup,
  STORAGE_KEY,
  CURRENT_SCHEMA_VERSION,
  HomeworkTask,
  WeaknessProfile,
  SessionMetric,
} from '../core/types';
import {
  createBackupObject,
  migrateToLatest,
  downloadBackupFile,
  validateBackup,
  mergeBackups,
} from '../services/persistence/backup';
import { useToast } from './useToast';

export const useDebateArchives = () => {
  const { showSuccess, showError } = useToast();
  const [backupState, setBackupState] = useState<DebateMasterBackup>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return migrateToLatest(parsed);
      }
    } catch (e) {
      console.error('Failed to load archives from storage', e);
    }
    return createBackupObject([]);
  });

  useEffect(() => {
    if (backupState && backupState.schemaVersion) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(backupState));
      } catch (e) {
        console.error('Failed to save archives to storage', e);
      }
    }
  }, [backupState]);

  // --- Profile Update Logic ---
  const updateWeaknessProfile = (
    currentProfile: WeaknessProfile,
    newMetrics?: SessionMetric[]
  ): WeaknessProfile => {
    if (!newMetrics || newMetrics.length === 0) return currentProfile;

    const updatedMetrics = { ...currentProfile.metrics };

    newMetrics.forEach(m => {
      const existing = updatedMetrics[m.key] || {
        key: m.key,
        label: m.label,
        description: '',
        rate: { numerator: 0, denominator: 0 },
        score: 0,
        lastUpdated: new Date().toISOString(),
        sampleSize: 0,
      };

      // Aggregate: Accumulate numerator and denominator
      const newNumerator = existing.rate.numerator + m.rate.numerator;
      const newDenominator = existing.rate.denominator + m.rate.denominator;

      // Recalculate score (simple percentage for now)
      const newScore = newDenominator > 0 ? Math.round((newNumerator / newDenominator) * 100) : 0;

      updatedMetrics[m.key] = {
        ...existing,
        rate: { numerator: newNumerator, denominator: newDenominator },
        score: newScore,
        lastUpdated: new Date().toISOString(),
        sampleSize: newDenominator,
      };
    });

    return {
      lastUpdated: new Date().toISOString(),
      metrics: updatedMetrics,
    };
  };

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

  // --- File Operations ---

  const exportData = () => {
    downloadBackupFile(backupState);
  };

  const importData = (file: File): Promise<boolean> => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const jsonRaw = e.target?.result as string;
          const json = JSON.parse(jsonRaw);

          if (validateBackup(json)) {
            const importedBackup = migrateToLatest(json);
            const currentCount = backupState.archives.length;
            const importedCount = importedBackup.archives.length;

            const normalizeInput = (str: string | null) => {
              if (!str) return '';
              return str
                .replace(/[０-９]/g, s => {
                  return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
                })
                .trim();
            };

            const userChoiceRaw = window.prompt(
              `バックアップ読込 (現在のデータ: ${currentCount}件, 読込データ: ${importedCount}件)\n` +
                `1: 結合 (Merge)\n2: 上書き (Replace)`,
              '1'
            );

            const userChoice = normalizeInput(userChoiceRaw);

            if (userChoice === '1') {
              const merged = mergeBackups(backupState, importedBackup);
              setBackupState(merged);
              showSuccess('データを結合しました。');
              resolve(true);
            } else if (userChoice === '2') {
              if (window.confirm('データを全て上書きしますか？')) {
                setBackupState(importedBackup);
                showSuccess('データを上書きしました。');
                resolve(true);
              } else {
                resolve(false);
              }
            } else {
              resolve(false);
            }
          } else {
            showError('無効なファイルです。');
            resolve(false);
          }
        } catch (err) {
          console.error(err);
          showError('読込に失敗しました。');
          resolve(false);
        }
      };
      reader.readAsText(file);
    });
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
