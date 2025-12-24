import React, { useState } from 'react';
import { Button } from '../Button';
import { Calculator } from 'lucide-react';

interface FermiEstimationViewProps {
  data: { question: string };
  onSubmit: (answer: { logic: string; value: string }) => void;
}

export const FermiEstimationView: React.FC<FermiEstimationViewProps> = ({ data, onSubmit }) => {
  const [logic, setLogic] = useState('');
  const [value, setValue] = useState('');

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 w-full">
      <div className="flex items-center justify-center gap-2 mb-6 text-teal-600">
        <Calculator size={24} />
        <h3 className="text-sm font-bold uppercase tracking-wider">
          フェルミ推定 (Fermi Estimation)
        </h3>
      </div>

      <div className="bg-white p-6 rounded-2xl mb-8 text-center border border-teal-100 shadow-sm">
        <span className="text-xs font-bold text-teal-600 block mb-2">QUESTION</span>
        <p className="text-2xl font-bold text-slate-800 leading-relaxed">"{data.question}"</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            分解ロジック・仮説 (Logic & Assumptions)
          </label>
          <textarea
            value={logic}
            onChange={e => setLogic(e.target.value)}
            placeholder="例：日本の人口(1.2億) × 世帯普及率(20%) ÷ 耐用年数(10年) ...&#10;どのように要素を分解し、数値を仮定したか記述してください。"
            className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none text-sm min-h-[140px] bg-white text-slate-800 shadow-inner resize-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            推定値 (Estimated Value)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="例：150万台"
              className="flex-1 p-4 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none text-lg font-bold text-right bg-white text-slate-800 shadow-inner transition-colors"
            />
            <span className="text-slate-500 font-bold px-2">Answer</span>
          </div>
        </div>

        <Button
          onClick={() => onSubmit({ logic, value })}
          fullWidth
          className="h-14 text-lg bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-lg"
          disabled={!logic.trim() || !value.trim()}
        >
          回答を検証する
        </Button>
      </div>
    </div>
  );
};
