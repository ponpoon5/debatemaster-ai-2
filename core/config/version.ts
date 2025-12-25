/**
 * Application Version Configuration
 * アプリケーションバージョン設定
 */

export const APP_VERSION = {
  major: 3,
  minor: 5,
  patch: 0,
  full: '3.5.0',
  name: 'DebateMaster AI',
  displayName: 'DebateMaster AI vv3.5.0',
  releaseDate: '2025-12-26',
  codename: 'Optimistic Rendering',
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
