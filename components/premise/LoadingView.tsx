import React from 'react';
import { Brain, Loader2 } from 'lucide-react';

export const LoadingView: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-50 p-6 animate-fade-in">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-sm w-full flex flex-col items-center">
        <div className="bg-blue-100 p-4 rounded-full mb-4 animate-pulse">
          <Brain size={32} className="text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">クリティカルシンキング発動中...</h2>
        <p className="text-slate-500 text-center text-sm">
          議論が水掛け論にならないよう、
          <br />
          前提条件とゴールを整理しています。
        </p>
        <Loader2 className="animate-spin text-blue-500 mt-6" size={24} />
      </div>
    </div>
  );
};
