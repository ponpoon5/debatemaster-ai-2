export const MODEL_NAME = "gemini-2.5-flash";
export const API_KEY = (import.meta.env?.VITE_GEMINI_API_KEY as string | undefined) || "AIzaSyA9kqNui5avRX6JPtit7R00jedSaTE_fYU";

// プロキシモードの設定
// 本番環境（Vercel）では同じドメインの /api を使用、開発環境では VITE_PROXY_URL を使用
export const PROXY_URL = import.meta.env.VITE_PROXY_URL || '';
export const USE_PROXY =
  import.meta.env.PROD ||
  (import.meta.env.VITE_PROXY_URL !== undefined && PROXY_URL !== '');
