/**
 * Application Version Configuration
 * アプリケーションバージョン設定
 */

export const APP_VERSION = {
  major: 3,
  minor: 9,
  patch: 0,
  full: '3.9.0',
  name: 'DebateMaster AI',
  displayName: 'DebateMaster AI vv3.9.0',
  releaseDate: '2025-12-26',
  codename: 'Type Safe',
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
