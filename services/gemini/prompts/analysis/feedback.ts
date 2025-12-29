export const getFeedbackPrompt = (
  topic: string,
  isStoryMode: boolean,
  isDemoMode: boolean,
  transcript: string,
  isFacilitationMode: boolean = false
) => {
  if (isDemoMode) {
    return `
    あなたはディベートの審査員兼教育者です。
    ユーザーは模範的なディベート（Alice vs Bob）を視聴しました。
    以下の議論履歴を分析し、学習者向けのフィードバック資料を作成してください。

    テーマ: ${topic}

    [分析タスク]
    1. 議論の概要（Summary）: 全体の流れと結末を要約してください。
    2. 論理構造の可視化と衝突分析（Clash Analysis）: 
       最も議論が白熱した「肯定側の主張」と「否定側の反論」のペアを抽出し、以下の要素に分解してください。
       - agenda: 論点
       - pro: 
          - claim (主張)
          - data (根拠)
          - warrant (論拠/つなぎ): なぜその根拠が主張を支えるのか
       - con:
          - counter (反論)
          - evidence (証拠)
          - impact (重要性/深刻さ): なぜその反論が重要なのか
       - synthesis: その対立がどう処理されたか、論理のぶつかり合いの分析
    3. 戦略的ハイライト（Strategy Highlights）:
       AliceやBobが使用した高度なディベートテクニック（例: 争点の明確化、前提の再定義、ストローマンの回避など）を3〜4つ特定し、その効果を記述してください。
    4. 観察者のための学び（Learning Points）:
       この議論を見ていた学生が学ぶべき、「自分がこの場にいたら何を言うべきか」「次の練習で意識すべきポイント」を3つ挙げてください。

    [出力言語]
    全てのテキストは**自然な日本語**で記述してください。

    議論履歴:
    ${transcript}
    `;
  }

  return `
    以下の「${topic}」に関する議論の履歴を分析し、ディベートの振り返りデータを作成してください。
    ${isStoryMode ? '※これは「世界観シナリオ・ディベート（Story Mode）」です。ユーザーの意思決定とその結果を重点的に評価してください。' : ''}
    ${isFacilitationMode ? '※これは「合意形成モード（Facilitation Mode）」です。ユーザーはファシリテーターとして、AさんとBさんの対話を促進しています。AさんとBさんの各発言を個別に評価してください。ユーザー（ファシリテーター）の発言も評価対象に含めてください。' : ''}

    【重要：採点根拠のSBIモデル化】
    detailedReview内の各発言に対する採点コメントは、以下のSBIモデルを厳格に適用して客観化してください。
    1. Situation（状況）: 議論のどの段階で、相手がどう発言した直後だったか。
    2. Behavior（行動）: ユーザーまたはAIが実際に取った具体的な発言内容、論理構成、修辞表現。
    3. Impact（影響）: その行動が、議論の説得力やジャッジへの印象、または議論の展開にどのようなプラス/マイナスの影響を与えたか。

    【重要：論理構造分析 (logicAnalysis) の抽出】
    ${isFacilitationMode
      ? '合意形成モードでは、AさんとBさんの主要な対立点を1つ抽出し、Toulminモデルで構造化してください。'
      : '議論全体の中で、特に中核となるユーザーの主張を1〜2つ抽出し、Toulminモデルで構造化してください。'}
    - claim, data, warrant の各要素の記述を充実させてください。
    - 各要素の強弱を判定し(strong, weak, missing)、建設的なコメントを付与してください。

    【重要：質問力分析 (questioningAnalysis) の抽出】
    ${isFacilitationMode
      ? 'ファシリテーターが行った主要な問いかけ（最大5つ程度）を抽出し、その有効性を評価してください。'
      : 'ユーザーが行った全ての「問いかけ」を抽出し、その有効性を評価してください。'}
    - OPEN(広げる), CLOSED(詰める), SUBTLE(誘導) に分類してください。
    - 相手の思考を深めることができたか、議論を前進させたかを評価してください。
    - 全体的な質問力スコア (stats.score) は**10点満点**で評価してください。

    【分析的ルーブリックの適用】
    各評価軸に対し、透明性の高いスコアリングを行ってください。
    1. 各項目（Logic, Evidence等）に「重み（Weight）」を設定してください。合計が100%になるように。
    2. 算出したスコアに対し、その達成レベルが具体的にどのようなパフォーマンスを示すのか（ルーブリック記述）を「descriptor」に詳しく記述してください。

    【アンカー事例（Exemplars）の生成】
    ${isFacilitationMode
      ? '合意形成モードでは、「ファシリテーション技術」に関する2つの評価基準（例：中立的な問いかけ、合意形成の促進）のみでベンチマーク事例を作成してください。'
      : '今回のトピック「' + topic + '」において、特定の評価基準（例：論理性、根拠の質）における「具体的ベンチマーク（基準事例）」を作成してください。'}
    - Mastery (10点): 理想的な最高レベルの回答例
    - Secure (7点): 十分なレベルだが改善の余地がある例
    - Developing (4点): 初歩で論理に飛躍がある例
    - Error (2点): 一般的に陥りやすいミスや誤謬（詭弁）を含む非模範例
    これらを「exemplars」配列として出力してください。

    【重要：言語指定】
    出力されるJSONデータの全てのテキストフィールドは、**必ず自然な日本語**で記述してください。

    【分析ルール】
    1. 総合スコア (score) について:
       - 100点満点で採点（1点単位）。
    2. 発言ごとの詳細評価 (detailedReview) について:
       ${isFacilitationMode
         ? '- **合意形成モードでは、重要な発言（スコアが高いまたは低い、誤謬を含む）のみを厳選してレビューしてください（最大10件程度）。**\n       - ファシリテーターの重要な介入、Aさん・Bさんの核心的な主張を優先的に選んでください。'
         : '- **ユーザーとAI双方の全ての発言を対象にしてください。**\n       - **全ての発言に対して、その論理的強度を1-10点でスコアリング(score)してください。**'}
       - sbiオブジェクトを必ず含めてください。
       - ユーザーの発言に対しては、betterResponse（理想的な模範解答）を含めてください。
    3. 全体評価（metrics）について:
       logic, evidence, rebuttal, persuasion, consistency, constructiveness, objectivity, clarity (各10点満点)
    4. 分析的ルーブリック詳細 (rubricDetails)
    5. 行動メトリクス測定 (sessionMetrics)
    6. トレーニング推奨 (trainingRecommendations)
       - ユーザーの弱点に基づいて、具体的なトレーニングを推奨してください（最大2つ）。
       - **actionType と actionPayload を正しく設定してください**:
         * actionType='open_minigame' の場合:
           - minigameType は以下のいずれか必須: EVIDENCE_FILL（根拠穴埋め）, FALLACY_QUIZ（誤謬クイズ）, ISSUE_PUZZLE（論点パズル）, COMBO_REBUTTAL（連続反駁）, FERMI_ESTIMATION（フェルミ推定）, LATERAL_THINKING（水平思考）, ACTIVE_INOCULATION（予防接種）
         * actionType='open_textbook' の場合:
           - textbookChapterId に章番号（1-6）を設定
         * actionType='open_thinking_gym' の場合:
           - thinkingFramework は以下のいずれか: toulmin（トゥールミンモデル）, premise_check（前提チェック）, issue_analysis（論点分析）
         * actionType='start_drill' の場合:
           - drillTopic に練習テーマを設定
         * actionType='start_study' の場合:
           - studyTopic に学習テーマ（誤謬名など）を設定
    7. 論理構造分析 (logicAnalysis): 議論全体の核心的な論理を抽出。
    8. 質問力分析 (questioningAnalysis): 検出された全ての質問を評価。

    ---
    議論履歴:
    ${transcript}
    ---
  `;
};
