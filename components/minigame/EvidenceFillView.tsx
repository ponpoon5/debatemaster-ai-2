import React, { useState, useEffect } from 'react';
import { Button } from '../Button';

interface EvidenceFillViewProps {
  data: { incompleteClaim: string };
  onSubmit: (answer: string) => void;
}

export const EvidenceFillView: React.FC<EvidenceFillViewProps> = React.memo(({ data, onSubmit }) => {
  const [textInput, setTextInput] = useState('');

  // Reset input when data changes
  useEffect(() => {
    setTextInput('');
  }, [data]);

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center w-full">
      <h3 className="text-sm font-bold text-slate-400 uppercase mb-6 tracking-wider">
        議論を完成させよ (Complete the Argument)
      </h3>
      <p className="text-2xl font-bold text-slate-800 mb-8 leading-relaxed">
        {data.incompleteClaim.split('_________').map((part: string, i: number) => (
          <React.Fragment key={i}>
            {part}
            {i === 0 && (
              <span className="text-pink-500 border-b-2 border-pink-500 px-2 italic bg-pink-50 mx-1 rounded">
                根拠は？
              </span>
            )}
          </React.Fragment>
        ))}
      </p>
      <textarea
        autoFocus
        value={textInput}
        onChange={e => setTextInput(e.target.value)}
        placeholder="ここに入る根拠を入力..."
        className="w-full p-5 rounded-2xl border-2 border-slate-200 focus:border-pink-400 outline-none text-lg mb-6 bg-white text-slate-800 shadow-inner resize-none transition-colors"
        rows={4}
      />
      <Button
        onClick={() => onSubmit(textInput)}
        fullWidth
        className="h-14 text-lg bg-pink-600 hover:bg-pink-700 text-white font-bold shadow-lg"
        disabled={!textInput.trim()}
      >
        送信する
      </Button>
    </div>
  );
});
