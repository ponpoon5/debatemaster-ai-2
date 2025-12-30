import { useState, useEffect } from 'react';

interface ApprovedSWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

/**
 * SWOT分析の承認を検出し、クロスSWOT戦略入力を管理するフック
 */
export const useSWOTAnalyzer = () => {
  const [swotApproved, setSWOTApproved] = useState(false);
  const [approvedSWOT, setApprovedSWOT] = useState<ApprovedSWOT | null>(null);
  const [userSWOTInput, setUserSWOTInput] = useState('');

  /**
   * AI応答からSWOT承認を検出
   */
  const analyzeSWOTApproval = (aiResponse: string): boolean => {
    // SWOT承認のキーワード
    const approvalKeywords = [
      'SWOT分析OK',
      'SWOT OK',
      'クロスSWOT戦略を立案',
      'SO/WO/ST/WTの4つ',
      'これらを組み合わせて',
    ];

    // 拒否のキーワード
    const rejectionKeywords = [
      'SWOT分析の改善',
      'リライト',
      '書き直せ',
      '再考',
    ];

    // スコア抽出（80点以上で承認）
    const scoreMatch = aiResponse.match(/(\d+)点/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;

    const hasApprovalKeyword = approvalKeywords.some((kw) =>
      aiResponse.includes(kw)
    );
    const hasRejectionKeyword = rejectionKeywords.some((kw) =>
      aiResponse.includes(kw)
    );

    return (
      (hasApprovalKeyword && !hasRejectionKeyword) ||
      (score >= 80 && !hasRejectionKeyword)
    );
  };

  /**
   * ユーザーのSWOT入力からSWOT要素を抽出
   */
  const extractSWOTElements = (userInput: string): ApprovedSWOT | null => {
    try {
      const swot: ApprovedSWOT = {
        strengths: [],
        weaknesses: [],
        opportunities: [],
        threats: [],
      };

      // Strengths（強み）を抽出 - [Strengths (強み)] 形式に対応
      const strengthsMatch = userInput.match(
        /\[Strengths\s*\(強み\)\]\s*\n([^\[]+)/i
      );
      if (strengthsMatch) {
        const content = strengthsMatch[1].trim();
        swot.strengths = content
          .split(/\n/)
          .map((s) => s.trim())
          .filter((s) => s && s.length > 0 && s !== '-');
      }

      // Weaknesses（弱み）を抽出
      const weaknessesMatch = userInput.match(
        /\[Weaknesses\s*\(弱み\)\]\s*\n([^\[]+)/i
      );
      if (weaknessesMatch) {
        const content = weaknessesMatch[1].trim();
        swot.weaknesses = content
          .split(/\n/)
          .map((s) => s.trim())
          .filter((s) => s && s.length > 0 && s !== '-');
      }

      // Opportunities（機会）を抽出
      const opportunitiesMatch = userInput.match(
        /\[Opportunities\s*\(機会\)\]\s*\n([^\[]+)/i
      );
      if (opportunitiesMatch) {
        const content = opportunitiesMatch[1].trim();
        swot.opportunities = content
          .split(/\n/)
          .map((s) => s.trim())
          .filter((s) => s && s.length > 0 && s !== '-');
      }

      // Threats（脅威）を抽出
      const threatsMatch = userInput.match(
        /\[Threats\s*\(脅威\)\]\s*\n(.+?)(?:\n\n|$)/is
      );
      if (threatsMatch) {
        const content = threatsMatch[1].trim();
        swot.threats = content
          .split(/\n/)
          .map((s) => s.trim())
          .filter((s) => s && s.length > 0 && s !== '-');
      }

      // 最低限の要素があるかチェック
      if (
        swot.strengths.length > 0 ||
        swot.weaknesses.length > 0 ||
        swot.opportunities.length > 0 ||
        swot.threats.length > 0
      ) {
        return swot;
      }

      return null;
    } catch (error) {
      return null;
    }
  };

  /**
   * クロスSWOT戦略をテキスト形式に変換
   */
  const formatCrossSWOTStrategies = (strategies: {
    so: { name: string; rationale: string; action: string; expectedOutcome: string };
    wo: { name: string; rationale: string; action: string; expectedOutcome: string };
    st: { name: string; rationale: string; action: string; expectedOutcome: string };
    wt: { name: string; rationale: string; action: string; expectedOutcome: string };
  }): string => {
    return `
【クロスSWOT戦略】

■ SO戦略（積極戦略）
戦略名: ${strategies.so.name}
根拠: ${strategies.so.rationale}
アクション: ${strategies.so.action}
期待効果: ${strategies.so.expectedOutcome}

■ WO戦略（改善戦略）
戦略名: ${strategies.wo.name}
根拠: ${strategies.wo.rationale}
アクション: ${strategies.wo.action}
期待効果: ${strategies.wo.expectedOutcome}

■ ST戦略（差別化戦略）
戦略名: ${strategies.st.name}
根拠: ${strategies.st.rationale}
アクション: ${strategies.st.action}
期待効果: ${strategies.st.expectedOutcome}

■ WT戦略（防衛/撤退戦略）
戦略名: ${strategies.wt.name}
根拠: ${strategies.wt.rationale}
アクション: ${strategies.wt.action}
期待効果: ${strategies.wt.expectedOutcome}
    `.trim();
  };

  return {
    swotApproved,
    setSWOTApproved,
    approvedSWOT,
    setApprovedSWOT,
    userSWOTInput,
    setUserSWOTInput,
    analyzeSWOTApproval,
    extractSWOTElements,
    formatCrossSWOTStrategies,
  };
};
