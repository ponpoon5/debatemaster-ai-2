import React, { useState } from 'react';
import { Button } from '../Button';
import { Lightbulb, HelpCircle } from 'lucide-react';

interface LateralThinkingViewProps {
  data: { situation: string; hiddenTruth?: string };
  onSubmit: (answer: string) => void;
}

export const LateralThinkingView: React.FC<LateralThinkingViewProps> = ({ data, onSubmit }) => {
  const [hypothesis, setHypothesis] = useState('');

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 w-full">
      <div className="flex items-center justify-center gap-2 mb-6 text-indigo-600">
        <Lightbulb size={24} />
        <h3 className="text-sm font-bold uppercase tracking-wider">
          水平思考パズル (Lateral Thinking)
        </h3>
      </div>

      <div className="bg-white p-6 rounded-2xl mb-8 relative overflow-hidden border border-indigo-100 shadow-sm">
        <HelpCircle
          size={100}
          className="absolute -right-4 -bottom-4 text-indigo-50 -rotate-12 pointer-events-none"
        />
        <span className="text-xs font-bold text-indigo-600 block mb-2">SITUATION (状況)</span>
        <p className="text-xl font-bold text-slate-800 leading-relaxed relative z-10">
          {data.situation}
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            あなたの推理 (Hypothesis)
          </label>
          <p className="text-xs text-slate-500 mb-3">
            なぜこのような状況になったのか？常識にとらわれず、隠された真相を推理してください。
          </p>
          <textarea
            value={hypothesis}
            onChange={e => setHypothesis(e.target.value)}
            placeholder="真相は..."
            className="w-full p-5 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-base min-h-[140px] bg-white text-slate-800 shadow-inner resize-none transition-colors"
          />
        </div>

        <Button
          onClick={() => onSubmit(hypothesis)}
          fullWidth
          className="h-14 text-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg"
          disabled={!hypothesis.trim()}
        >
          推理する
        </Button>
      </div>
    </div>
  );
};
