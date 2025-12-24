export const MODEL_NAME = "gemini-2.5-flash";
export const API_KEY = (import.meta.env?.VITE_GEMINI_API_KEY as string | undefined) || "AIzaSyA9kqNui5avRX6JPtit7R00jedSaTE_fYU";

// プロキシモードの設定
export const USE_PROXY = import.meta.env.VITE_PROXY_URL !== undefined;
export const PROXY_URL = import.meta.env.VITE_PROXY_URL || 'http://localhost:3000';
