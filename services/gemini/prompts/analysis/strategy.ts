export const getStrategyPrompt = (topic: string, transcript: string) => {
  return `
    あなたはディベートの「リアルタイム戦略ナビゲーター」です。
    ユーザーは現在、以下の議論を行っています。
    相手（Opponent）の最新の発言を分析し、ユーザーが次に取るべき戦略をアドバイスしてください。

    テーマ: ${topic}
    
    [直近の議論]
    ${transcript}

    [タスク]
    1. 相手の発言の論理構造（Claim, Evidence, Weakness）を分析してください。
    2. 議論の現在のフェーズを判定してください。
    3. ユーザーが取るべき「3つの異なる戦略（Moves）」を提案してください。
       - 各Moveには、**なぜそのフェーズでその戦略が有効なのかの理由 (reason)** を必ず含めてください。
    
    4. 【新機能: 反論カード生成】
       相手の主張に対する効果的な反論を構成するための「テンプレート」を作成してください。
       以下の4つのフィールドに対し、相手の発言内容に基づいた**具体的なヒント（hint）**を生成してください。
       
       - Field 1: 相手の主張の弱点（Weak Point）
       - Field 2: 反証・対案（Counter-example / Alternative）
       - Field 3: 重要性（Impact / Why it matters）
       - Field 4: 結論（My Conclusion）

    【重要】全ての出力は**必ず日本語**で記述してください。英語は一切使用しないでください。
    JSON形式で出力してください。
  `;
};
