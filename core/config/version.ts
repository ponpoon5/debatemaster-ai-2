/**
 * Application Version Configuration
 * アプリケーションバージョン設定
 */

export const APP_VERSION = {
  major: 3,
  minor: 4,
  patch: 5,
  full: '3.4.5',
  name: 'DebateMaster AI',
  displayName: 'DebateMaster AI vv3.4.5',
  releaseDate: '2025-12-25',
  codename: 'Performance Boost',
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
