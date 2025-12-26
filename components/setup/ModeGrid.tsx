import React from 'react';
import { DebateMode } from '../../core/types';
import {
  Swords,
  Book,
  Joystick,
  MonitorPlay,
  Handshake,
  Globe,
  BrainCircuit,
  GraduationCap,
  Dumbbell,
  Target,
} from 'lucide-react';

interface ModeGridProps {
  activeMode: DebateMode;
  onSelectMode: (mode: DebateMode) => void;
}

export const ModeGrid: React.FC<ModeGridProps> = React.memo(({ activeMode, onSelectMode }) => {
  const modes = [
    { mode: DebateMode.DEBATE, label: '議論実践', icon: Swords, color: 'text-blue-600' },
    { mode: DebateMode.TEXTBOOK, label: '教科書', icon: Book, color: 'text-emerald-600' },
    { mode: DebateMode.MINIGAME, label: 'ミニゲーム', icon: Joystick, color: 'text-pink-600' },
    { mode: DebateMode.DEMO, label: '模範視聴', icon: MonitorPlay, color: 'text-sky-600' },
    { mode: DebateMode.FACILITATION, label: '合意形成', icon: Handshake, color: 'text-green-600' },
    { mode: DebateMode.STORY, label: 'シナリオ', icon: Globe, color: 'text-teal-600' },
    {
      mode: DebateMode.THINKING_GYM,
      label: '思考ジム',
      icon: BrainCircuit,
      color: 'text-indigo-600',
    },
    { mode: DebateMode.STUDY, label: '詭弁学習', icon: GraduationCap, color: 'text-purple-600' },
    { mode: DebateMode.DRILL, label: 'ドリル', icon: Dumbbell, color: 'text-orange-600' },
    { mode: DebateMode.TRAINING, label: '弱点特訓', icon: Target, color: 'text-red-600' },
  ];

  return (
    <div className="flex flex-wrap justify-center bg-slate-100 p-1 rounded-xl mb-6 shadow-inner animate-fade-in-up delay-100 gap-1">
      {modes.map(item => (
        <button
          key={item.mode}
          onClick={() => onSelectMode(item.mode)}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
            activeMode === item.mode
              ? `bg-white ${item.color} shadow-sm`
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <item.icon size={14} />
          {item.label}
        </button>
      ))}
    </div>
  );
});
