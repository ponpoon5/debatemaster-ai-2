import { DebateMasterBackup } from '../core/types';
import {
  downloadBackupFile,
  validateBackup,
  migrateToLatest,
  mergeBackups,
} from '../services/persistence/backup';
import { useToast } from './useToast';

/**
 * バックアップ・リストア機能を提供するカスタムフック
 *
 * @param backupState - 現在のバックアップ状態
 * @param setBackupState - バックアップ状態を更新する関数
 * @returns exportData, importData関数
 */
export const useBackupRestore = (
  backupState: DebateMasterBackup,
  setBackupState: React.Dispatch<React.SetStateAction<DebateMasterBackup>>
) => {
  const { showSuccess, showError } = useToast();

  /**
   * 現在のバックアップデータをJSONファイルとしてダウンロード
   */
  const exportData = () => {
    downloadBackupFile(backupState);
  };

  /**
   * バックアップファイルをインポート
   *
   * @param file - インポートするファイル
   * @returns インポート成功時はtrue、失敗時はfalse
   */
  const importData = (file: File): Promise<boolean> => {
    return new Promise(resolve => {
      const reader = new FileReader();

      reader.onload = e => {
        try {
          const jsonRaw = e.target?.result as string;
          const json = JSON.parse(jsonRaw);

          if (!validateBackup(json)) {
            showError('無効なファイルです。');
            resolve(false);
            return;
          }

          const importedBackup = migrateToLatest(json);
          const currentCount = backupState.archives.length;
          const importedCount = importedBackup.archives.length;

          // 全角数字を半角に変換するヘルパー
          const normalizeInput = (str: string | null): string => {
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
            // Merge: 現在のデータと読込データを結合
            const merged = mergeBackups(backupState, importedBackup);
            setBackupState(merged);
            showSuccess('データを結合しました。');
            resolve(true);
          } else if (userChoice === '2') {
            // Replace: 現在のデータを全て上書き
            if (window.confirm('データを全て上書きしますか？')) {
              setBackupState(importedBackup);
              showSuccess('データを上書きしました。');
              resolve(true);
            } else {
              resolve(false);
            }
          } else {
            // キャンセル
            resolve(false);
          }
        } catch (err) {
          console.error('❌ Failed to import backup:', err);
          showError('読込に失敗しました。');
          resolve(false);
        }
      };

      reader.readAsText(file);
    });
  };

  return {
    exportData,
    importData,
  };
};
