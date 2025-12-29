import { DebateSettings, DebateArchive } from './debate.types';
import { HomeworkTask, WeaknessProfile } from './homework.types';

export const CURRENT_SCHEMA_VERSION = 5;
export const APP_VERSION = 'vv5.0.2';
export const STORAGE_KEY = 'debate_archives';

export interface UserProfile {
  pseudoUserId?: string;
  displayName?: string;
}

export interface DeviceInfo {
  userAgent?: string;
  platform?: string;
  language?: string;
}

export interface DebateMasterBackup {
  schemaVersion: number;
  appVersion: string;
  exportedAt: string;
  deviceInfo?: DeviceInfo;
  userProfile?: UserProfile;
  settings?: DebateSettings;
  archives: DebateArchive[];

  // New Persistence Fields
  homeworkTasks: HomeworkTask[];
  weaknessProfile: WeaknessProfile;

  meta?: Record<string, unknown>;
}
