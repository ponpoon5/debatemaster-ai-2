import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QuestioningCard } from './QuestioningCard';
import { QuestioningStats, QuestionAnalysis } from '../../core/types';

describe('QuestioningCard', () => {
  const mockStats: QuestioningStats = {
    score: 7.5,
    openCount: 3,
    closedCount: 2,
    subtleCount: 1,
    advice: 'より多くのオープン質問を使用することで、議論を深めることができます。',
  };

  const mockDetails: QuestionAnalysis[] = [
    {
      questionText: 'この問題についてどう考えますか？',
      type: 'OPEN',
      effectiveness: 8,
      comment: '相手の思考を促す良い質問です。',
      messageIndex: 0,
    },
    {
      questionText: 'その証拠はありますか？',
      type: 'CLOSED',
      effectiveness: 6,
      comment: '事実確認に有効な質問です。',
      messageIndex: 2,
    },
    {
      questionText: '本当にそれで良いと思いますか？',
      type: 'SUBTLE',
      effectiveness: 9,
      comment: '相手の本音を引き出す巧みな質問です。',
      messageIndex: 4,
    },
  ];

  describe('rendering', () => {
    it('should render component with title', () => {
      render(<QuestioningCard stats={mockStats} details={mockDetails} />);

      expect(screen.getByText('質問力分析 (Questioning Skills)')).toBeInTheDocument();
      expect(
        screen.getByText('相手の思考を深め、議論を展開させる質問の質を評価')
      ).toBeInTheDocument();
    });

    it('should display clamped score', () => {
      render(<QuestioningCard stats={mockStats} details={mockDetails} />);

      expect(screen.getByText('7.5/10')).toBeInTheDocument();
    });

    it('should display type counts', () => {
      render(<QuestioningCard stats={mockStats} details={mockDetails} />);

      expect(screen.getByText('3')).toBeInTheDocument(); // openCount
      expect(screen.getByText('2')).toBeInTheDocument(); // closedCount
      expect(screen.getByText('1')).toBeInTheDocument(); // subtleCount
    });

    it('should display advice', () => {
      render(<QuestioningCard stats={mockStats} details={mockDetails} />);

      expect(screen.getByText('コーチからのアドバイス')).toBeInTheDocument();
      expect(screen.getByText(mockStats.advice)).toBeInTheDocument();
    });
  });

  describe('score clamping', () => {
    it('should clamp score above 10 to 10', () => {
      const highStats = { ...mockStats, score: 15 };
      render(<QuestioningCard stats={highStats} details={[]} />);

      expect(screen.getByText('10/10')).toBeInTheDocument();
    });

    it('should clamp negative score to 0', () => {
      const negativeStats = { ...mockStats, score: -5 };
      render(<QuestioningCard stats={negativeStats} details={[]} />);

      expect(screen.getByText('0/10')).toBeInTheDocument();
    });

    it('should handle score of 0', () => {
      const zeroStats = { ...mockStats, score: 0 };
      render(<QuestioningCard stats={zeroStats} details={[]} />);

      expect(screen.getByText('0/10')).toBeInTheDocument();
    });

    it('should handle score of 10', () => {
      const perfectStats = { ...mockStats, score: 10 };
      render(<QuestioningCard stats={perfectStats} details={[]} />);

      expect(screen.getByText('10/10')).toBeInTheDocument();
    });
  });

  describe('question details list', () => {
    it('should render all questions', () => {
      render(<QuestioningCard stats={mockStats} details={mockDetails} />);

      expect(screen.getByText('"この問題についてどう考えますか？"')).toBeInTheDocument();
      expect(screen.getByText('"その証拠はありますか？"')).toBeInTheDocument();
      expect(screen.getByText('"本当にそれで良いと思いますか？"')).toBeInTheDocument();
    });

    it('should display question types as badges', () => {
      render(<QuestioningCard stats={mockStats} details={mockDetails} />);

      const openBadges = screen.getAllByText('OPEN');
      const closedBadges = screen.getAllByText('CLOSED');
      const subtleBadges = screen.getAllByText('SUBTLE');

      expect(openBadges.length).toBeGreaterThan(0);
      expect(closedBadges.length).toBeGreaterThan(0);
      expect(subtleBadges.length).toBeGreaterThan(0);
    });

    it('should display effectiveness scores', () => {
      render(<QuestioningCard stats={mockStats} details={mockDetails} />);

      expect(screen.getByText('効果: 8/10')).toBeInTheDocument();
      expect(screen.getByText('効果: 6/10')).toBeInTheDocument();
      expect(screen.getByText('効果: 9/10')).toBeInTheDocument();
    });

    it('should display message indices', () => {
      render(<QuestioningCard stats={mockStats} details={mockDetails} />);

      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText('#3')).toBeInTheDocument();
      expect(screen.getByText('#5')).toBeInTheDocument();
    });

    it('should display comments', () => {
      render(<QuestioningCard stats={mockStats} details={mockDetails} />);

      expect(screen.getByText('相手の思考を促す良い質問です。')).toBeInTheDocument();
      expect(screen.getByText('事実確認に有効な質問です。')).toBeInTheDocument();
      expect(screen.getByText('相手の本音を引き出す巧みな質問です。')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('should show empty message when no questions', () => {
      render(<QuestioningCard stats={mockStats} details={[]} />);

      expect(
        screen.getByText('今回の議論では明確な質問が検出されませんでした。')
      ).toBeInTheDocument();
    });

    it('should still show stats when no questions', () => {
      render(<QuestioningCard stats={mockStats} details={[]} />);

      expect(screen.getByText('7.5/10')).toBeInTheDocument();
      expect(screen.getByText(mockStats.advice)).toBeInTheDocument();
    });
  });

  describe('visual indicators', () => {
    it('should render score dots', () => {
      const { container } = render(<QuestioningCard stats={mockStats} details={[]} />);

      // Score of 7.5 should show 3-4 filled dots out of 5
      const dots = container.querySelectorAll('.rounded-full');
      expect(dots.length).toBe(5);
    });
  });

  describe('accessibility', () => {
    it('should have proper heading structure', () => {
      render(<QuestioningCard stats={mockStats} details={mockDetails} />);

      const mainHeading = screen.getByText('質問力分析 (Questioning Skills)');
      expect(mainHeading.tagName).toBe('H3');

      const subHeading = screen.getByText('検出された質問リスト');
      expect(subHeading.tagName).toBe('H4');
    });
  });

  describe('edge cases', () => {
    it('should handle single question', () => {
      const singleDetail = [mockDetails[0]];
      render(<QuestioningCard stats={mockStats} details={singleDetail} />);

      expect(screen.getByText('"この問題についてどう考えますか？"')).toBeInTheDocument();
      expect(screen.queryByText('"その証拠はありますか？"')).not.toBeInTheDocument();
    });

    it('should handle zero counts', () => {
      const zeroStats = {
        ...mockStats,
        openCount: 0,
        closedCount: 0,
        subtleCount: 0,
      };
      render(<QuestioningCard stats={zeroStats} details={[]} />);

      const zeros = screen.getAllByText('0');
      expect(zeros.length).toBeGreaterThanOrEqual(3);
    });

    it('should handle large numbers', () => {
      const largeStats = {
        ...mockStats,
        openCount: 999,
        closedCount: 888,
        subtleCount: 777,
      };
      render(<QuestioningCard stats={largeStats} details={[]} />);

      expect(screen.getByText('999')).toBeInTheDocument();
      expect(screen.getByText('888')).toBeInTheDocument();
      expect(screen.getByText('777')).toBeInTheDocument();
    });

    it('should handle long advice text', () => {
      const longAdviceStats = {
        ...mockStats,
        advice: 'これは非常に長いアドバイステキストです。'.repeat(10),
      };
      render(<QuestioningCard stats={longAdviceStats} details={[]} />);

      expect(screen.getByText(/これは非常に長いアドバイステキストです/)).toBeInTheDocument();
    });
  });
});
