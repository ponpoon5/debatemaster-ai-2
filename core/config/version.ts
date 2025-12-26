/**
 * Application Version Configuration
 * アプリケーションバージョン設定
 */

export const APP_VERSION = {
  major: 4,
  minor: 0,
  patch: 0,
  full: '4.0.0',
  name: 'DebateMaster AI',
  displayName: 'DebateMaster AI vv4.0.0',
  releaseDate: '2025-12-26',
  codename: 'Performance Pro',
} as const;

export const getVersionString = () => {
  return `${APP_VERSION.name} v${APP_VERSION.full}`;
};

export const getFullVersionString = () => {
  return APP_VERSION.displayName;
};

export const getBuildInfo = () => {
  return {
    version: APP_VERSION.full,
    name: APP_VERSION.name,
    releaseDate: APP_VERSION.releaseDate,
    codename: APP_VERSION.codename,
  };
};
