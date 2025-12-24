import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LogicSection } from './LogicSection';
import { LogicStructure, UtteranceStructureScore } from '../../core/types';

// Mock ToulminCard component
vi.mock('./ToulminCard', () => ({
  ToulminCard: ({ structure }: { structure: LogicStructure }) => (
    <div data-testid="toulmin-card">{structure.messageIndex}</div>
  ),
}));

describe('LogicSection', () => {
  const mockLogicAnalysis: LogicStructure[] = [
    {
      messageIndex: 0,
      claim: '気候変動は深刻な問題である',
      data: '世界の平均気温が上昇している',
      warrant: '気温上昇は環境に悪影響を与える',
      backing: '科学的データが証明している',
      qualifier: 'おそらく',
      rebuttal: '一部の地域では寒冷化している',
      schemeLabel: 'Expert Opinion',
    },
  ];

  const mockMessages = [
    {
      id: 'msg1',
      text: 'これは最初のメッセージです',
      role: 'user',
      structureAnalysis: {
        overall: 8.0,
        claim: 8.5,
        warrant: 7.5,
        backing: 8.0,
        qualifier: 7.0,
        rebuttal: 8.0,
        scheme: {
          label: 'Expert Opinion',
          description: '専門家の意見に基づく論証',
        },
        criticalQuestions: [
          {
            question: '専門家は信頼できるか？',
            isAddressed: true,
            aiComment: '対応済み',
          },
          {
            question: '他の専門家の意見はどうか？',
            isAddressed: false,
            aiComment: '他の専門家の見解についても触れると良いでしょう',
          },
        ],
        messageId: 'msg1',
      } as UtteranceStructureScore,
    },
    {
      id: 'msg2',
      text: 'これは2番目のメッセージです',
      role: 'model',
      structureAnalysis: undefined,
    },
    {
      id: 'msg3',
      text: 'これは3番目のメッセージです',
      role: 'user',
      structureAnalysis: {
        overall: 7.0,
        claim: 7.5,
        warrant: 6.5,
        backing: 7.0,
        qualifier: 6.0,
        rebuttal: 7.5,
        scheme: {
          label: 'Causal Argument',
          description: '因果関係に基づく論証',
        },
        criticalQuestions: [
          {
            question: '因果関係は明確か？',
            isAddressed: true,
            aiComment: '対応済み',
          },
        ],
        messageId: 'msg3',
      } as UtteranceStructureScore,
    },
  ];

  describe('rendering', () => {
    it('should render section header', () => {
      render(<LogicSection />);

      expect(screen.getByText('論理構造と妥当性の詳細分析')).toBeInTheDocument();
    });

    it('should render description', () => {
      render(<LogicSection />);

      expect(screen.getByText(/「主張の型（Toulmin）」だけでなく/)).toBeInTheDocument();
    });

    it('should render Toulmin section header', () => {
      render(<LogicSection />);

      expect(screen.getByText('Toulmin Model Visualizations')).toBeInTheDocument();
    });
  });

  describe('with logic analysis', () => {
    it('should render ToulminCard for each analysis', () => {
      render(<LogicSection logicAnalysis={mockLogicAnalysis} />);

      const cards = screen.getAllByTestId('toulmin-card');
      expect(cards).toHaveLength(1);
      expect(cards[0]).toHaveTextContent('0');
    });

    it('should render multiple ToulminCards', () => {
      const multipleAnalysis = [
        mockLogicAnalysis[0],
        { ...mockLogicAnalysis[0], messageIndex: 1 },
        { ...mockLogicAnalysis[0], messageIndex: 2 },
      ];
      render(<LogicSection logicAnalysis={multipleAnalysis} />);

      const cards = screen.getAllByTestId('toulmin-card');
      expect(cards).toHaveLength(3);
    });
  });

  describe('without logic analysis', () => {
    it('should show empty state when no logic analysis', () => {
      render(<LogicSection />);

      expect(screen.getByText('基本構造分析データが不足しています')).toBeInTheDocument();
    });

    it('should show empty state when logic analysis is empty array', () => {
      render(<LogicSection logicAnalysis={[]} />);

      expect(screen.getByText('基本構造分析データが不足しています')).toBeInTheDocument();
    });
  });

  describe('argument schemes section', () => {
    it('should render argument schemes section when messages have structure analysis', () => {
      render(<LogicSection logicAnalysis={mockLogicAnalysis} messages={mockMessages} />);

      expect(screen.getByText('採用された議論スキームと論理の穴')).toBeInTheDocument();
    });

    it('should not render argument schemes section when no messages', () => {
      render(<LogicSection logicAnalysis={mockLogicAnalysis} messages={[]} />);

      expect(screen.queryByText('採用された議論スキームと論理の穴')).not.toBeInTheDocument();
    });

    it('should filter only user messages with structure analysis', () => {
      render(<LogicSection messages={mockMessages} />);

      // Should show 2 user messages with structure analysis
      expect(screen.getByText('Message #1')).toBeInTheDocument();
      expect(screen.getByText('Message #2')).toBeInTheDocument();
    });

    it('should display message text', () => {
      render(<LogicSection messages={mockMessages} />);

      expect(screen.getByText('"これは最初のメッセージです"')).toBeInTheDocument();
      expect(screen.getByText('"これは3番目のメッセージです"')).toBeInTheDocument();
    });

    it('should display scheme labels', () => {
      render(<LogicSection messages={mockMessages} />);

      expect(screen.getByText('Expert Opinion')).toBeInTheDocument();
      expect(screen.getByText('Causal Argument')).toBeInTheDocument();
    });

    it('should display scheme descriptions', () => {
      render(<LogicSection messages={mockMessages} />);

      expect(screen.getByText('専門家の意見に基づく論証')).toBeInTheDocument();
      expect(screen.getByText('因果関係に基づく論証')).toBeInTheDocument();
    });
  });

  describe('critical questions', () => {
    it('should render critical questions', () => {
      render(<LogicSection messages={mockMessages} />);

      expect(screen.getByText('専門家は信頼できるか？')).toBeInTheDocument();
      expect(screen.getByText('他の専門家の意見はどうか？')).toBeInTheDocument();
      expect(screen.getByText('因果関係は明確か？')).toBeInTheDocument();
    });

    it('should show addressed questions with checkmark icon', () => {
      const { container } = render(<LogicSection messages={mockMessages} />);

      const checkIcons = container.querySelectorAll('.text-emerald-500');
      expect(checkIcons.length).toBeGreaterThan(0);
    });

    it('should show unaddressed questions with alert icon', () => {
      const { container } = render(<LogicSection messages={mockMessages} />);

      const alertIcons = container.querySelectorAll('.text-rose-500');
      expect(alertIcons.length).toBeGreaterThan(0);
    });

    it('should show AI comment for unaddressed questions', () => {
      render(<LogicSection messages={mockMessages} />);

      expect(
        screen.getByText('他の専門家の見解についても触れると良いでしょう')
      ).toBeInTheDocument();
    });

    it('should not show AI comment for addressed questions', () => {
      render(<LogicSection messages={mockMessages} />);

      expect(screen.queryByText('対応済み')).not.toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle messages without structureAnalysis', () => {
      const messagesWithoutAnalysis = [
        {
          id: 'msg1',
          text: 'メッセージ',
          role: 'user',
        },
      ];
      render(<LogicSection messages={messagesWithoutAnalysis} />);

      expect(screen.queryByText('採用された議論スキームと論理の穴')).not.toBeInTheDocument();
    });

    it('should handle messages without scheme', () => {
      const messagesWithoutScheme = [
        {
          id: 'msg1',
          text: 'メッセージ',
          role: 'user',
          structureAnalysis: {
            overall: 8.0,
            claim: 8.5,
            warrant: 7.5,
            backing: 8.0,
            qualifier: 7.0,
            rebuttal: 8.0,
            messageId: 'msg1',
          } as UtteranceStructureScore,
        },
      ];
      render(<LogicSection messages={messagesWithoutScheme} />);

      expect(screen.queryByText('Expert Opinion')).not.toBeInTheDocument();
    });

    it('should handle messages without critical questions', () => {
      const messagesWithoutCQ = [
        {
          id: 'msg1',
          text: 'メッセージ',
          role: 'user',
          structureAnalysis: {
            overall: 8.0,
            claim: 8.5,
            warrant: 7.5,
            backing: 8.0,
            qualifier: 7.0,
            rebuttal: 8.0,
            scheme: {
              label: 'Expert Opinion',
              description: '専門家の意見に基づく論証',
            },
            messageId: 'msg1',
          } as UtteranceStructureScore,
        },
      ];
      render(<LogicSection messages={messagesWithoutCQ} />);

      expect(screen.getByText('採用された議論スキームと論理の穴')).toBeInTheDocument();
    });

    it('should handle empty messages array', () => {
      render(<LogicSection messages={[]} logicAnalysis={mockLogicAnalysis} />);

      expect(screen.queryByText('採用された議論スキームと論理の穴')).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper heading structure', () => {
      render(<LogicSection messages={mockMessages} />);

      const mainHeading = screen.getByText('論理構造と妥当性の詳細分析');
      expect(mainHeading.tagName).toBe('H3');

      const subHeading = screen.getByText('採用された議論スキームと論理の穴');
      expect(subHeading.tagName).toBe('H4');
    });
  });
});
