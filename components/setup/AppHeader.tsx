import React from 'react';
import { DebateMode } from '../../core/types';
import { APP_VERSION } from '../../core/config/version';
import {
  MessageSquare,
  Target,
  GraduationCap,
  Dumbbell,
  Handshake,
  BrainCircuit,
  Globe,
  MonitorPlay,
  Book,
  Joystick,
} from 'lucide-react';

interface AppHeaderProps {
  activeMode: DebateMode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ activeMode }) => {
  const getHeaderStyle = () => {
    switch (activeMode) {
      case DebateMode.TRAINING:
        return { iconBg: 'bg-red-100', iconColor: 'text-red-600', Icon: Target };
      case DebateMode.STUDY:
        return { iconBg: 'bg-purple-100', iconColor: 'text-purple-600', Icon: GraduationCap };
      case DebateMode.DRILL:
        return { iconBg: 'bg-orange-100', iconColor: 'text-orange-600', Icon: Dumbbell };
      case DebateMode.FACILITATION:
        return { iconBg: 'bg-green-100', iconColor: 'text-green-600', Icon: Handshake };
      case DebateMode.THINKING_GYM:
        return { iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600', Icon: BrainCircuit };
      case DebateMode.STORY:
        return { iconBg: 'bg-teal-100', iconColor: 'text-teal-600', Icon: Globe };
      case DebateMode.DEMO:
        return { iconBg: 'bg-sky-100', iconColor: 'text-sky-600', Icon: MonitorPlay };
      case DebateMode.TEXTBOOK:
        return { iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', Icon: Book };
      case DebateMode.MINIGAME:
        return { iconBg: 'bg-pink-100', iconColor: 'text-pink-600', Icon: Joystick };
      default:
        return { iconBg: 'bg-blue-100', iconColor: 'text-blue-600', Icon: MessageSquare };
    }
  };

  const style = getHeaderStyle();

  return (
    <div className="mb-6 text-center animate-fade-in-up mt-8 sm:mt-0 w-full">
      <div
        key={activeMode}
        className={`w-16 h-16 ${style.iconBg} ${style.iconColor} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm animate-pop-in transition-colors duration-300`}
      >
        <style.Icon size={32} />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center justify-center gap-3">
        {APP_VERSION.name}
        <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-1 rounded-full border border-slate-200">
          vv{APP_VERSION.full}
        </span>
      </h1>
      <p className="text-slate-600">AIと議論して、ロジカルシンキングと説得力を鍛えましょう。</p>
      <p className="text-xs text-slate-400 mt-1">Release: {APP_VERSION.releaseDate} | Codename: {APP_VERSION.codename}</p>
    </div>
  );
};
