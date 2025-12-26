import React from 'react';
import { Button } from '../Button';

interface ComboRebuttalViewProps {
  data: { claim: string };
  onSubmit: (answer: string) => void;
}

export const ComboRebuttalView: React.FC<ComboRebuttalViewProps> = React.memo(({ data, onSubmit }) => {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center w-full">
      <h3 className="text-sm font-bold text-slate-400 uppercase mb-6 tracking-wider">
        即座に反論せよ (Instant Rebuttal)
      </h3>
      <p className="text-2xl font-bold text-slate-800 mb-8 leading-relaxed px-4">"{data.claim}"</p>
      <form
        onSubmit={e => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const text = formData.get('rebuttal') as string;
          if (text.trim()) onSubmit(text);
        }}
      >
        <textarea
          name="rebuttal"
          autoFocus
          placeholder="反論を入力..."
          className="w-full p-5 rounded-2xl border-2 border-slate-200 focus:border-pink-400 outline-none text-lg mb-6 bg-white text-slate-800 shadow-inner resize-none transition-colors"
          rows={4}
        />
        <Button
          type="submit"
          fullWidth
          className="h-14 text-lg bg-pink-600 hover:bg-pink-700 text-white font-bold shadow-lg"
        >
          反撃する
        </Button>
      </form>
    </div>
  );
});
