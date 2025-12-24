import React, { useState, useEffect } from 'react';
import { Button } from '../Button';

interface Segment {
  id: string;
  text: string;
  correctOrder: number;
}

interface IssuePuzzleViewProps {
  data: { segments: Segment[] };
  onSubmit: (orderedIds: string[]) => void;
}

export const IssuePuzzleView: React.FC<IssuePuzzleViewProps> = ({ data, onSubmit }) => {
  const [puzzleOrder, setPuzzleOrder] = useState<Segment[]>([]);

  useEffect(() => {
    // Initial shuffle
    setPuzzleOrder([...data.segments].sort(() => Math.random() - 0.5));
  }, [data]);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...puzzleOrder];
    if (direction === 'up') {
      if (index === 0) return;
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    } else {
      if (index === newOrder.length - 1) return;
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    setPuzzleOrder(newOrder);
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 w-full">
      <h3 className="text-sm font-bold text-slate-400 uppercase mb-6 text-center tracking-wider">
        論理を並べ替えよ (Reorder Logic)
      </h3>
      <div className="space-y-3">
        {puzzleOrder.map((seg, idx) => (
          <div key={seg.id} className="flex gap-4 items-center group">
            <div className="flex flex-col gap-1 shrink-0">
              <button
                onClick={() => moveItem(idx, 'up')}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                disabled={idx === 0}
              >
                ▲
              </button>
              <button
                onClick={() => moveItem(idx, 'down')}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                disabled={idx === puzzleOrder.length - 1}
              >
                ▼
              </button>
            </div>
            <div className="flex-1 p-5 bg-white border-2 border-slate-200 rounded-2xl font-bold text-slate-700 flex items-center shadow-sm group-hover:border-blue-300 transition-colors">
              {seg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Button
          onClick={() => onSubmit(puzzleOrder.map(s => s.id))}
          className="bg-pink-600 hover:bg-pink-700 text-white px-16 h-14 text-lg font-bold shadow-lg"
        >
          完了
        </Button>
      </div>
    </div>
  );
};
