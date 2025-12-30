/**
 * Application Version Configuration
 * アプリケーションバージョン設定
 */

export const APP_VERSION = {
  major: 5,
  minor: 2,
  patch: 0,
  full: '5.2.0',
  name: 'DebateMaster AI',
  displayName: 'DebateMaster AI vv5.2.0',
  releaseDate: '2025-12-30',
  codename: 'Cross-SWOT Analysis',
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
