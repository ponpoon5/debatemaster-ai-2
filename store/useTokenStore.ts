/**
 * Token Usage Store
 * トークン使用量のグローバル状態管理
 */

import { create } from 'zustand';
import { TokenUsage } from '../core/types';

interface TokenStore {
  tokenUsage: TokenUsage;
  updateTokenUsage: (usage: TokenUsage) => void;
  resetTokenUsage: () => void;
}

const initialTokenUsage: TokenUsage = {
  inputTokens: 0,
  outputTokens: 0,
  totalTokens: 0,
};

export const useTokenStore = create<TokenStore>((set) => ({
  tokenUsage: initialTokenUsage,

  updateTokenUsage: (usage: TokenUsage) =>
    set({ tokenUsage: usage }),

  resetTokenUsage: () =>
    set({ tokenUsage: initialTokenUsage }),
}));
