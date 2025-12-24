import {
  DebateArchive,
  DebateSettings,
  DebateMasterBackup,
  CURRENT_SCHEMA_VERSION,
  APP_VERSION,
  DeviceInfo,
  WeaknessProfile,
} from '../../core/types';

type MigrationFn = (data: any) => any;

const sanitizeArchive = (archive: any): DebateArchive => {
  const safeFeedback = archive.feedback || {};
  return {
    ...archive,
    id: archive.id || Date.now().toString(),
    date: archive.date || new Date().toISOString(),
    lastModified: archive.lastModified || archive.date || new Date().toISOString(),
    topic: archive.topic || 'Unknown Topic',
    messages: Array.isArray(archive.messages) ? archive.messages : [],
    feedback: {
      score: typeof safeFeedback.score === 'number' ? safeFeedback.score : 0,
      summary: safeFeedback.summary || 'No summary available.',
      strengths: Array.isArray(safeFeedback.strengths) ? safeFeedback.strengths : [],
      weaknesses: Array.isArray(safeFeedback.weaknesses) ? safeFeedback.weaknesses : [],
      advice: safeFeedback.advice || 'No advice available.',
      detailedReview: Array.isArray(safeFeedback.detailedReview) ? safeFeedback.detailedReview : [],
      metrics: safeFeedback.metrics || {
        logic: 0,
        evidence: 0,
        rebuttal: 0,
        persuasion: 0,
        consistency: 0,
        constructiveness: 0,
        objectivity: 0,
        clarity: 0,
      },
      logicAnalysis: safeFeedback.logicAnalysis,
      rhetoric: safeFeedback.rhetoric,
      questioningAnalysis: safeFeedback.questioningAnalysis,
      facilitation: safeFeedback.facilitation,
      storyAnalysis: safeFeedback.storyAnalysis,
      demoAnalysis: safeFeedback.demoAnalysis,
      // V4 fields
      sessionMetrics: safeFeedback.sessionMetrics,
      homeworkSuggestions: safeFeedback.homeworkSuggestions,
      trainingRecommendations: safeFeedback.trainingRecommendations,
    },
  };
};

const migrateLegacyToV1: MigrationFn = (data: any) => {
  if (Array.isArray(data)) {
    return {
      schemaVersion: 1,
      appVersion: '3.0.0',
      exportedAt: new Date().toISOString(),
      archives: data,
      settings: undefined,
    };
  }
  return data;
};

const migrateV1toV2: MigrationFn = (data: any) => {
  const archives = (data.archives || []).map((a: any) => ({
    ...a,
    lastModified: a.lastModified || a.date || new Date().toISOString(),
  }));
  return { ...data, schemaVersion: 2, archives };
};

const migrateV2toV3: MigrationFn = (data: any) => {
  const userProfile = data.userProfile || {
    pseudoUserId: `user_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`,
    displayName: 'Guest',
  };
  const archives = (data.archives || []).map(sanitizeArchive);
  return { ...data, schemaVersion: 3, userProfile, archives };
};

/**
 * Migration 3 -> 4: Add homeworkTasks and weaknessProfile
 */
const migrateV3toV4: MigrationFn = (data: any) => {
  console.log('Migration [3 -> 4]: Initializing Homework & WeaknessProfile');
  const emptyProfile: WeaknessProfile = {
    lastUpdated: new Date().toISOString(),
    metrics: {} as any,
  };

  return {
    ...data,
    schemaVersion: 4,
    homeworkTasks: data.homeworkTasks || [],
    weaknessProfile: data.weaknessProfile || emptyProfile,
  };
};

const MIGRATIONS: Record<number, MigrationFn> = {
  0: migrateLegacyToV1,
  1: migrateV1toV2,
  2: migrateV2toV3,
  3: migrateV3toV4,
};

export const migrateToLatest = (input: any): DebateMasterBackup => {
  let currentData = input;
  let currentVersion = 0;

  if (!currentData) {
    return createBackupObject([]);
  } else if (Array.isArray(currentData)) {
    currentVersion = 0;
  } else if (typeof currentData === 'object' && typeof currentData.schemaVersion === 'number') {
    currentVersion = currentData.schemaVersion;
  }

  while (currentVersion < CURRENT_SCHEMA_VERSION) {
    const migrationFn = MIGRATIONS[currentVersion];
    if (!migrationFn) break;
    try {
      currentData = migrationFn(currentData);
      if (currentData.schemaVersion <= currentVersion) {
        currentData.schemaVersion = currentVersion + 1;
      }
      currentVersion = currentData.schemaVersion;
    } catch (e) {
      console.error(`Migration failed at v${currentVersion}`, e);
      break;
    }
  }
  return currentData as DebateMasterBackup;
};

export const createBackupObject = (
  archives: DebateArchive[],
  settings?: DebateSettings
): DebateMasterBackup => {
  const deviceInfo: DeviceInfo = {
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    platform: typeof navigator !== 'undefined' ? navigator.platform : 'unknown',
    language: typeof navigator !== 'undefined' ? navigator.language : 'unknown',
  };

  const emptyProfile: WeaknessProfile = {
    lastUpdated: new Date().toISOString(),
    metrics: {} as any,
  };

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    appVersion: APP_VERSION,
    exportedAt: new Date().toISOString(),
    deviceInfo,
    settings,
    archives: archives.map(sanitizeArchive),
    userProfile: {
      pseudoUserId: `user_${Date.now().toString(36)}`,
      displayName: 'Guest',
    },
    homeworkTasks: [],
    weaknessProfile: emptyProfile,
    meta: {
      generatedBy: 'DebateMaster AI',
      totalArchives: archives.length,
    },
  };
};

export const downloadBackupFile = (backup: DebateMasterBackup) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `debate_master_backup_${timestamp}.json`;
  const jsonStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const validateBackup = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false;
  return (
    Array.isArray(data) || typeof data.schemaVersion === 'number' || Array.isArray(data.archives)
  );
};

export const mergeBackups = (
  current: DebateMasterBackup,
  incoming: DebateMasterBackup
): DebateMasterBackup => {
  const mergedArchivesMap = new Map<string, DebateArchive>();
  current.archives.forEach(a => mergedArchivesMap.set(a.id, a));
  incoming.archives.forEach(a => {
    const existing = mergedArchivesMap.get(a.id);
    if (!existing) {
      mergedArchivesMap.set(a.id, a);
    } else {
      const existingDate = new Date(existing.lastModified || existing.date).getTime();
      const incomingDate = new Date(a.lastModified || a.date).getTime();
      if (incomingDate > existingDate) {
        mergedArchivesMap.set(a.id, a);
      }
    }
  });

  // Merge Homework (simple union by ID)
  const mergedTasksMap = new Map();
  current.homeworkTasks.forEach(t => mergedTasksMap.set(t.id, t));
  incoming.homeworkTasks.forEach(t => mergedTasksMap.set(t.id, t));

  return {
    ...current,
    archives: Array.from(mergedArchivesMap.values()),
    homeworkTasks: Array.from(mergedTasksMap.values()),
    // For simplicity, we keep the current profile. Re-aggregating from all archives is safer but expensive.
    exportedAt: new Date().toISOString(),
  };
};
