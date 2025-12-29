/**
 * Application Version Configuration
 * アプリケーションバージョン設定
 */

export const APP_VERSION = {
  major: 5,
  minor: 0,
  patch: 6,
  full: '5.0.6',
  name: 'DebateMaster AI',
  displayName: 'DebateMaster AI vv5.0.6',
  releaseDate: '2025-12-29',
  codename: 'Debug Insights',
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
