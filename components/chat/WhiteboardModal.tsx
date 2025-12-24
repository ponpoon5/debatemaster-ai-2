import React from 'react';
import { X, Presentation, Loader2, Handshake } from 'lucide-react';
import { FacilitationBoardData } from '../../core/types';

interface WhiteboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardData: FacilitationBoardData | null;
  isGenerating: boolean;
}

export const WhiteboardModal: React.FC<WhiteboardModalProps> = ({
  isOpen,
  onClose,
  boardData,
  isGenerating,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full h-[85vh] overflow-hidden animate-pop-in flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-green-50/50">
          <div className="flex items-center gap-2 font-bold text-green-800">
            <Presentation size={24} className="text-green-600" />
            <span>仮想ホワイトボード (Live)</span>
          </div>
          <button onClick={onClose}>
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400">
              <Loader2 size={40} className="animate-spin text-green-500" />
              <span className="text-base font-medium">議論を整理中...</span>
            </div>
          ) : boardData ? (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Current Agenda
                </h3>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-lg font-bold text-slate-800">
                  {boardData.currentAgenda}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
                  <h4 className="font-bold text-red-800 mb-2">Aさんの主張</h4>
                  <p className="text-sm font-bold text-red-900 mb-3">
                    {boardData.opinionA.summary}
                  </p>
                  <ul className="list-disc pl-4 text-sm text-slate-700 space-y-1">
                    {boardData.opinionA.pros.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                  <h4 className="font-bold text-blue-800 mb-2">Bさんの主張</h4>
                  <p className="text-sm font-bold text-blue-900 mb-3">
                    {boardData.opinionB.summary}
                  </p>
                  <ul className="list-disc pl-4 text-sm text-slate-700 space-y-1">
                    {boardData.opinionB.pros.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <h4 className="flex items-center gap-2 font-bold text-emerald-800 mb-2">
                  <Handshake size={18} /> 合意点
                </h4>
                <ul className="space-y-1 pl-4 list-disc text-sm text-emerald-900">
                  {boardData.agreedPoints.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-400 mt-20">データがありません</div>
          )}
        </div>
      </div>
    </div>
  );
};
