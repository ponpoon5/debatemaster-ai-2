import React, { useState, useEffect } from 'react';
import { Button } from '../Button';

interface FallacyQuizViewProps {
  data: { questionText: string; options: string[] };
  onSubmit: (selectedIndex: number) => void;
}

export const FallacyQuizView: React.FC<FallacyQuizViewProps> = React.memo(({ data, onSubmit }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    setSelectedOption(null);
  }, [data]);

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 w-full">
      <h3 className="text-sm font-bold text-slate-400 uppercase mb-6 text-center tracking-wider">
        誤謬を特定せよ (Identify the Fallacy)
      </h3>
      <div className="bg-white p-6 rounded-2xl mb-8 text-center border-2 border-pink-100 shadow-sm">
        <p className="text-xl font-bold text-pink-700">"{data.questionText}"</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.options.map((opt: string, idx: number) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedOption(idx);
            }}
            className={`p-5 rounded-2xl border-2 transition-all font-bold text-left shadow-sm ${
              selectedOption === idx
                ? 'border-pink-500 bg-pink-50 text-pink-700 ring-2 ring-pink-200'
                : 'border-slate-200 hover:border-pink-300 bg-white text-slate-700 hover:shadow-md'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Button
          onClick={() => selectedOption !== null && onSubmit(selectedOption)}
          disabled={selectedOption === null}
          className="bg-pink-600 hover:bg-pink-700 text-white px-16 h-14 text-lg font-bold shadow-lg"
        >
          決定
        </Button>
      </div>
    </div>
  );
});
