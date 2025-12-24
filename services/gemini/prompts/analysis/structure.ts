export const getStructureAnalysisPrompt = (text: string) => {
  return `
    以下の発言の「論理構造」をトゥールミンモデルおよびWaltonの議論スキーム（Argumentation Schemes）に基づいて詳細に分析してください。

    発言内容:
    "${text}"

    [分析タスク1: Toulmin Components]
    各要素が含まれている度合いを 0.0〜1.0 でスコアリングし、該当部分の抜粋(snippet)を作成してください。
    1. CLAIM (主張), 2. REASON (理由), 3. EVIDENCE (証拠), 4. WARRANT (論拠), 5. BACKING (裏付け), 6. REBUTTAL (反駁への考慮), 7. QUALIFICATION (限定)

    [分析タスク2: Argumentation Scheme & Critical Questions]
    この発言が採用している「論理の型（議論スキーム）」を特定し、それを評価するための「批判的質問（Critical Questions: CQs）」を提示してください。

    1. scheme: 以下の代表的なスキームから最も近いものを1つ選択し、日本語のラベルと説明を付与してください。
       - Argument from Expert Opinion (専門家の意見)
       - Argument from Analogy (類推)
       - Argument from Cause to Effect (因果関係)
       - Argument from Sign (兆候・指標)
       - Argument from Example (例証)
       - Argument from Consequences (帰結)

    2. criticalQuestions: 特定したスキームを検証するためにAI（あなた）が内部で用いた評価質問を3〜4つリストアップしてください。
       - question: 質問内容
       - isAddressed: この発言内でその質問に対する回答や考慮が含まれているか (boolean)
       - aiComment: なぜそう判断したか、または不十分な点があれば具体的に。

    [サマリー]
    summaryには、この発言の論理性に関する強みと「回答されていないCQ（論理の穴）」を、日本語2文以内で簡潔に記述してください。

    【重要】全ての出力は**必ず日本語**で記述してください。英語は一切使用しないでください。
    JSON形式で出力してください。
  `;
};
