/**
 * MECE軸承認判定フック
 * AIの応答を解析し、軸が承認されたかどうかを判定する
 */

export const useMECEAnalyzer = () => {
  /**
   * AI応答から軸承認を判定
   * @param aiResponse AI from the coach
   * @returns true if axis is approved, false otherwise
   */
  const analyzeAxisApproval = (aiResponse: string): boolean => {
    if (!aiResponse) {
      console.log('🔍 analyzeAxisApproval: No response');
      return false;
    }

    // 承認キーワード
    const approvalKeywords = [
      '軸OK',
      '軸は合格',
      '軸を承認',
      '軸が明確',
      '軸は適切',
      '軸は良い',
      'その軸で要素を分解しろ',
      '要素を分解',
    ];

    // 却下キーワード
    const rejectionKeywords = [
      '軸が不明確',
      '軸が混ざっている',
      '軸を再考',
      '軸が曖昧',
      '軸がダメ',
      '軸を1つに固定しろ',
      '軸を変えろ',
      '軸を見直せ',
    ];

    // スコア抽出: "軸の明確さ: XX点" or "軸評価: XX点" or "軸: XX点"
    const scorePatterns = [
      /軸の明確さ[:\s]*(\d+)\s*点/,
      /軸評価[:\s]*(\d+)\s*点/,
      /軸[:\s]*(\d+)\s*点/,
    ];

    let axisScore = 0;
    for (const pattern of scorePatterns) {
      const match = aiResponse.match(pattern);
      if (match) {
        axisScore = parseInt(match[1]);
        console.log('🔍 analyzeAxisApproval: Found score:', axisScore, 'via pattern:', pattern);
        break;
      }
    }

    // 却下キーワードが含まれていたら即却下
    const hasRejection = rejectionKeywords.some(kw => aiResponse.includes(kw));
    if (hasRejection) {
      console.log('🔍 analyzeAxisApproval: Has rejection keyword');
      return false;
    }

    // 承認キーワードが含まれているか、スコアが80点以上なら承認
    const hasApproval = approvalKeywords.some(kw => aiResponse.includes(kw));
    const scoreApproval = axisScore >= 80;

    console.log('🔍 analyzeAxisApproval: hasApproval:', hasApproval, 'scoreApproval:', scoreApproval, '(score:', axisScore, ')');

    return hasApproval || scoreApproval;
  };

  /**
   * ユーザーメッセージから軸を抽出
   * @param message User's message containing axis
   * @returns extracted axis string or null
   */
  const extractAxisFromMessage = (message: string): string | null => {
    if (!message) return null;

    // パターン1: [MECE_AXIS_CHECK] 軸: ○○
    const pattern1 = /\[MECE_AXIS_CHECK\]\s*軸:\s*(.+)/;
    const match1 = message.match(pattern1);
    if (match1) {
      return match1[1].trim();
    }

    // パターン2: [切り口・軸] ○○
    const pattern2 = /\[切り口・軸\]\s*(.+)/;
    const match2 = message.match(pattern2);
    if (match2) {
      return match2[1].trim();
    }

    // パターン3: 軸: ○○
    const pattern3 = /軸:\s*(.+?)(?:\n|$)/;
    const match3 = message.match(pattern3);
    if (match3) {
      return match3[1].trim();
    }

    return null;
  };

  /**
   * メッセージが軸チェックリクエストかどうかを判定
   * @param message User's message
   * @returns true if this is an axis check request
   */
  const isAxisCheckRequest = (message: string): boolean => {
    if (!message) return false;
    return message.includes('[MECE_AXIS_CHECK]') || message.startsWith('軸:');
  };

  /**
   * メッセージがリライト（書き直し）かどうかを判定
   * @param message User's message
   * @returns true if this is a rewrite submission
   */
  const isRewriteSubmission = (message: string): boolean => {
    if (!message) return false;
    return message.includes('[GYM_REWRITE]') || message.includes('(再提出)');
  };

  return {
    analyzeAxisApproval,
    extractAxisFromMessage,
    isAxisCheckRequest,
    isRewriteSubmission,
  };
};
