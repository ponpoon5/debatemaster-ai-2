import React, { useState } from 'react';
import {
  X,
  Server,
  Database,
  Cpu,
  Code2,
  Layers,
  Zap,
  Layout,
  Folder,
  FileCode,
  FileJson,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
} from 'lucide-react';

interface SystemInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FileNode {
  name: string;
  type: 'folder' | 'file';
  children?: FileNode[];
}

const FILE_TREE_DATA: FileNode[] = [
  {
    name: 'components',
    type: 'folder',
    children: [
      {
        name: 'chat',
        type: 'folder',
        children: [
          {
            name: 'message',
            type: 'folder',
            children: [
              { name: 'DemoMessage.tsx', type: 'file' },
              { name: 'MessageHighlighter.tsx', type: 'file' },
              { name: 'MultiSpeakerMessage.tsx', type: 'file' },
              { name: 'StandardMessage.tsx', type: 'file' },
              { name: 'StructureHeatmap.tsx', type: 'file' },
            ],
          },
          { name: 'ArgumentBuilderModal.tsx', type: 'file' },
          { name: 'DebatePhaseBar.tsx', type: 'file' },
          { name: 'InputArea.tsx', type: 'file' },
          { name: 'MessageItem.tsx', type: 'file' },
          { name: 'SummaryModal.tsx', type: 'file' },
          { name: 'SupportPanel.tsx', type: 'file' },
          { name: 'ThinkingGymModal.tsx', type: 'file' },
          { name: 'ThinkingIndicator.tsx', type: 'file' },
          { name: 'WhiteboardModal.tsx', type: 'file' },
        ],
      },
      {
        name: 'common',
        type: 'folder',
        children: [{ name: 'LoadingOverlay.tsx', type: 'file' }],
      },
      {
        name: 'feedback',
        type: 'folder',
        children: [
          { name: 'DemoAnalysisView.tsx', type: 'file' },
          { name: 'DetailedReviewSection.tsx', type: 'file' },
          { name: 'ExemplarSection.tsx', type: 'file' },
          { name: 'FacilitationCard.tsx', type: 'file' },
          { name: 'LogicSection.tsx', type: 'file' },
          { name: 'MetricsRadarChart.tsx', type: 'file' },
          { name: 'QuestioningCard.tsx', type: 'file' },
          { name: 'QuestioningSection.tsx', type: 'file' },
          { name: 'RhetoricCard.tsx', type: 'file' },
          { name: 'ScoreTrendChart.tsx', type: 'file' },
          { name: 'StoryAnalysisCard.tsx', type: 'file' },
          { name: 'SummarySection.tsx', type: 'file' },
          { name: 'ToulminCard.tsx', type: 'file' },
        ],
      },
      {
        name: 'history',
        type: 'folder',
        children: [{ name: 'HistoryItem.tsx', type: 'file' }],
      },
      {
        name: 'minigame',
        type: 'folder',
        children: [
          { name: 'ComboRebuttalView.tsx', type: 'file' },
          { name: 'EvidenceFillView.tsx', type: 'file' },
          { name: 'FallacyQuizView.tsx', type: 'file' },
          { name: 'FermiEstimationView.tsx', type: 'file' },
          { name: 'GameFeedbackOverlay.tsx', type: 'file' },
          { name: 'GameResultView.tsx', type: 'file' },
          { name: 'IssuePuzzleView.tsx', type: 'file' },
          { name: 'LateralThinkingView.tsx', type: 'file' },
        ],
      },
      {
        name: 'premise',
        type: 'folder',
        children: [
          { name: 'LoadingView.tsx', type: 'file' },
          { name: 'PremiseEditor.tsx', type: 'file' },
        ],
      },
      {
        name: 'setup',
        type: 'folder',
        children: [
          { name: 'AppHeader.tsx', type: 'file' },
          { name: 'DebateTypeCards.tsx', type: 'file' },
          { name: 'DifficultyCards.tsx', type: 'file' },
          { name: 'ModeGrid.tsx', type: 'file' },
          { name: 'ModeSettings.tsx', type: 'file' },
          { name: 'SpecificationModal.tsx', type: 'file' },
          { name: 'SystemInfoModal.tsx', type: 'file' },
          { name: 'TokenStatus.tsx', type: 'file' },
          { name: 'TopicInput.tsx', type: 'file' },
        ],
      },
      {
        name: 'textbook',
        type: 'folder',
        children: [
          { name: 'AttackQuizView.tsx', type: 'file' },
          { name: 'DefinitionLab.tsx', type: 'file' },
          { name: 'DefinitionQuizView.tsx', type: 'file' },
          { name: 'StandardQuizView.tsx', type: 'file' },
          { name: 'ToulminLab.tsx', type: 'file' },
          { name: 'WeighingQuizView.tsx', type: 'file' },
          { name: 'chapters.tsx', type: 'file' },
        ],
      },
      { name: 'Button.tsx', type: 'file' },
      { name: 'ChatScreen.tsx', type: 'file' },
      { name: 'FeedbackScreen.tsx', type: 'file' },
      { name: 'HistoryScreen.tsx', type: 'file' },
      { name: 'MiniGameScreen.tsx', type: 'file' },
      { name: 'PremiseCheckScreen.tsx', type: 'file' },
      { name: 'SetupScreen.tsx', type: 'file' },
      { name: 'TextbookScreen.tsx', type: 'file' },
    ],
  },
  {
    name: 'core',
    type: 'folder',
    children: [
      {
        name: 'config',
        type: 'folder',
        children: [
          { name: 'constants.ts', type: 'file' },
          { name: 'gemini.config.ts', type: 'file' },
        ],
      },
      {
        name: 'types',
        type: 'folder',
        children: [
          { name: 'common.types.ts', type: 'file' },
          { name: 'debate.types.ts', type: 'file' },
          { name: 'feedback.types.ts', type: 'file' },
          { name: 'homework.types.ts', type: 'file' },
          { name: 'index.ts', type: 'file' },
          { name: 'minigame.types.ts', type: 'file' },
          { name: 'mode.types.ts', type: 'file' },
          { name: 'persistence.types.ts', type: 'file' },
          { name: 'story.types.ts', type: 'file' },
          { name: 'textbook.types.ts', type: 'file' },
        ],
      },
    ],
  },
  {
    name: 'hooks',
    type: 'folder',
    children: [
      { name: 'useChatTools.ts', type: 'file' },
      { name: 'useDebateApp.ts', type: 'file' },
      { name: 'useDebateArchives.ts', type: 'file' },
      { name: 'useFeedbackLogic.ts', type: 'file' },
      { name: 'useHistoryLogic.ts', type: 'file' },
      { name: 'useLoadingSimulation.ts', type: 'file' },
      { name: 'useMessageAnalysis.ts', type: 'file' },
      { name: 'useMiniGameLogic.ts', type: 'file' },
      { name: 'usePremiseLogic.ts', type: 'file' },
      { name: 'useSetupLogic.ts', type: 'file' },
      { name: 'useTextbookLogic.ts', type: 'file' },
    ],
  },
  {
    name: 'services',
    type: 'folder',
    children: [
      {
        name: 'gemini',
        type: 'folder',
        children: [
          {
            name: 'analysis',
            type: 'folder',
            children: [
              { name: 'advice.ts', type: 'file' },
              { name: 'fact-check.ts', type: 'file' },
              { name: 'feedback.ts', type: 'file' },
              { name: 'phase.ts', type: 'file' },
              { name: 'strategy.ts', type: 'file' },
              { name: 'structure.ts', type: 'file' },
              { name: 'summary.ts', type: 'file' },
            ],
          },
          {
            name: 'prompts',
            type: 'folder',
            children: [
              { name: 'analysis', type: 'folder' },
              { name: 'modes', type: 'folder' },
              { name: 'setup', type: 'folder' },
              { name: 'session', type: 'folder' },
              { name: 'core.ts', type: 'file' },
            ],
          },
          { name: 'training', type: 'folder' },
          { name: 'utils', type: 'folder' },
          { name: 'chat-service.ts', type: 'file' },
          { name: 'client.ts', type: 'file' },
          { name: 'index.ts', type: 'file' },
          { name: 'instructions.ts', type: 'file' },
        ],
      },
      {
        name: 'persistence',
        type: 'folder',
        children: [{ name: 'backup.ts', type: 'file' }],
      },
    ],
  },
  { name: 'App.tsx', type: 'file' },
  { name: 'index.html', type: 'file' },
  { name: 'index.tsx', type: 'file' },
  { name: 'metadata.json', type: 'file' },
  { name: 'SPECIFICATION.md', type: 'file' },
];

interface FileTreeItemProps {
  name: string;
  type: 'folder' | 'file';
  children?: React.ReactNode;
  level?: number;
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({ name, type, children, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(level < 1); // Only root components open by default
  const indent = level * 16;

  if (type === 'folder') {
    return (
      <div>
        <div
          className="flex items-center gap-1.5 py-1 px-2 hover:bg-slate-100 rounded cursor-pointer text-xs font-medium text-slate-700 select-none transition-colors"
          style={{ paddingLeft: `${indent + 8}px` }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <ChevronDown size={14} className="text-slate-400" />
          ) : (
            <ChevronRight size={14} className="text-slate-400" />
          )}
          <Folder size={14} className="text-blue-400 fill-blue-100" />
          <span>{name}</span>
        </div>
        {isOpen && children}
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-1.5 py-1 px-2 hover:bg-slate-50 rounded text-xs text-slate-600 ml-5"
      style={{ paddingLeft: `${indent + 8}px` }}
    >
      {name.endsWith('json') ? (
        <FileJson size={14} className="text-amber-500" />
      ) : name.endsWith('md') ? (
        <FileCode size={14} className="text-slate-400" />
      ) : (
        <FileCode size={14} className="text-cyan-500" />
      )}
      <span>{name}</span>
    </div>
  );
};

export const SystemInfoModal: React.FC<SystemInfoModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const renderTree = (nodes: FileNode[], level = 0) => {
    return nodes.map(node => (
      <FileTreeItem key={node.name} name={node.name} type={node.type} level={level}>
        {node.children && renderTree(node.children, level + 1)}
      </FileTreeItem>
    ));
  };

  const generateFileTreeText = (nodes: FileNode[], level = 0): string => {
    return nodes
      .map(node => {
        const indent = '  '.repeat(level);
        const icon = node.type === 'folder' ? '📁 ' : '📄 ';
        const line = `${indent}${icon}${node.name}`;
        if (node.children) {
          return `${line}\n${generateFileTreeText(node.children, level + 1)}`;
        }
        return line;
      })
      .join('\n');
  };

  const generateSystemReport = () => {
    const fileTree = generateFileTreeText(FILE_TREE_DATA);

    return `
# DebateMaster AI vv3.4.1 - System Architecture Report

## Technology Stack
- Frontend: React 19 / TypeScript
- Styling: Tailwind CSS
- AI Model: Google Gemini 2.5 Flash
- Persistence: Browser Local Storage with Schema Versioning (v4)
- Intelligence: Walton Argumentation Schemes & Toulmin Model Integration

## Architecture Features
- Client-side inference (Serverless)
- Advanced logical structure mapping
- Real-time debate phase detection
- SBI-model based feedback generation

## File Structure
${fileTree}
    `.trim();
  };

  const handleCopy = () => {
    const report = generateSystemReport();
    navigator.clipboard.writeText(report).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-pop-in border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Cpu size={24} className="text-blue-600" />
            System Architecture
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                copied
                  ? 'bg-green-50 text-green-600 border-green-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-blue-600'
              }`}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Export Text'}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-slate-200 text-slate-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <div className="space-y-8">
            {/* Tech Stack */}
            <section>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                <Code2 size={14} /> Intelligence Core
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    name: 'Gemini 2.5',
                    desc: 'AI Engine',
                    color: 'text-blue-600',
                    bg: 'bg-blue-50',
                    border: 'border-blue-100',
                  },
                  {
                    name: 'Toulmin',
                    desc: 'Logic Model',
                    color: 'text-indigo-600',
                    bg: 'bg-indigo-50',
                    border: 'border-indigo-100',
                  },
                  {
                    name: 'Walton',
                    desc: 'Argument Schemes',
                    color: 'text-violet-600',
                    bg: 'bg-violet-50',
                    border: 'border-violet-100',
                  },
                  {
                    name: 'SBI Model',
                    desc: 'Feedback Logic',
                    color: 'text-emerald-600',
                    bg: 'bg-emerald-50',
                    border: 'border-emerald-100',
                  },
                ].map(tech => (
                  <div
                    key={tech.name}
                    className={`p-3 rounded-xl border ${tech.border} ${tech.bg} flex flex-col items-center text-center`}
                  >
                    <span className={`font-bold text-sm ${tech.color}`}>{tech.name}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{tech.desc}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Architecture */}
            <section>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                <Server size={14} /> Persistence & Data
              </h4>
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                    <Database size={24} className="text-indigo-500" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-700">
                      Storage Version: v4.0 (Latest)
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Local Storage JSON with automatic migration logic for legacy archives (v1-v3).
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* File Structure */}
            <section>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                <Folder size={14} /> Source File Tree
              </h4>
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 font-mono overflow-x-auto text-[11px] leading-relaxed">
                {renderTree(FILE_TREE_DATA)}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
