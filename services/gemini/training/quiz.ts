import { Type, Schema } from '@google/genai';
import { ai } from '../client';
import { MODEL_NAME } from '../../../core/config/gemini.config';
import { TokenUsage } from '../../../core/types';
import { cleanText } from '../utils/text-cleaner';
import { extractUsage } from '../utils/token-usage';
import { parseApiError } from '../../../core/utils/error-parser';

export const generateAttackPointQuiz = async (
  targetTypeIndex: number
): Promise<{
  opponentClaim: string;
  rebuttal: string;
  correctTypeIndex: number;
  explanation: string;
  usage: TokenUsage;
}> => {
  let constraints = '';
  if (targetTypeIndex === 1)
    constraints = '「理由」という単語を使わずに、論理の欠陥を指摘してください。';
  if (targetTypeIndex === 2)
    constraints =
      '「証拠」「データ」「不十分」「ソース」という単語を使わずに、具体的な事実関係で反論してください。';
  if (targetTypeIndex === 3)
    constraints = '「論理」「飛躍」「前提」という単語を使わずに、具体的に指摘してください。';
  if (targetTypeIndex === 4)
    constraints = '「定義」という単語を使わずに、言葉の意味の違いを指摘してください。';
  if (targetTypeIndex === 5)
    constraints = '「比重」「重要」という単語を使わずに、優先順位の違いを指摘してください。';
  if (targetTypeIndex === 6)
    constraints =
      '「論点」「話がずれてる」という単語を使わずに、「それはAの話ではなくBの話だ」のように具体的に軌道修正してください。';

  const prompt = `
    ディベート教科書の第2章「反論の型（7 Attack Points）」の理解度クイズを作成してください。
    
    以下の7つの反論タイプのうち、ID: ${targetTypeIndex} のタイプに該当する「相手の主張」と「反論の例」を生成してください。
    
    攻撃タイプ一覧:
    0: Claim攻撃 (結論そのものを否定)
    1: Reason攻撃 (理由が不適切)
    2: Evidence攻撃 (証拠が不十分・古い)
    3: Warrant攻撃 (論理の飛躍を突く)
    4: 定義攻撃 (言葉の定義を突く)
    5: 比重攻撃 (Weighing: メリットよりデメリットが大きい)
    6: 論点ずらし指摘 (相手が話を逸らしたことを指摘)

    【重要: 出力制約】
    反論の例文（rebuttal）を作成する際、そのタイプ名（「証拠」「定義」「論点」など）や、正解を直接示唆するメタな単語（「不十分」「ずれている」など）は**絶対に使わないでください**。
    ${constraints}
    学習者が文脈から推測できるように、自然な会話文で作成してください。

    出力形式(JSON):
    {
      "opponentClaim": "相手の短い主張文",
      "rebuttal": "それに対する反論の例文（ID:${targetTypeIndex}のテクニックを使用）",
      "correctTypeIndex": ${targetTypeIndex}, // 固定
      "explanation": "なぜそのタイプに分類されるのかの簡潔な解説"
    }
    `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      opponentClaim: { type: Type.STRING },
      rebuttal: { type: Type.STRING },
      correctTypeIndex: { type: Type.INTEGER },
      explanation: { type: Type.STRING },
    },
    required: ['opponentClaim', 'rebuttal', 'correctTypeIndex', 'explanation'],
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: 'application/json', responseSchema: schema },
    });
    const usage = extractUsage(response);
    if (response.text) {
      return { ...JSON.parse(cleanText(response.text)), usage };
    }
    throw new Error('No text');
  } catch (error) {
    const apiError = parseApiError(error);
    console.error('Attack point quiz generation failed:', apiError);
    return {
      opponentClaim: '生成エラー',
      rebuttal: 'エラー',
      correctTypeIndex: 0,
      explanation: '生成に失敗しました',
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  }
};

export const generateWeighingQuiz = async (): Promise<{
  scenario: string;
  optionA: string;
  optionB: string;
  correctCriteria: string;
  explanation: string;
  usage: TokenUsage;
}> => {
  const prompt = `
    ディベート教科書の第3章「重み付け（Weighing）」の理解度クイズを作成してください。
    
    相反する2つの価値（AとB）が衝突するジレンマ的なシナリオを作成し、
    その対立を解決するために最も重視すべき「比較基準（Criteria）」を1つ選んでください。
    
    比較基準の選択肢:
    - Magnitude (大きさ・影響範囲)
    - Probability (発生確率・確実性)
    - Timeframe (時間軸・即効性vs持続性)
    - Reversibility (可逆性・取り返しがつくか)

    出力形式(JSON):
    {
      "scenario": "ジレンマを含むシナリオ説明",
      "optionA": "選択肢Aの内容",
      "optionB": "選択肢Bの内容",
      "correctCriteria": "Magnitude", "Probability", "Timeframe", "Reversibility" のいずれか,
      "explanation": "なぜその基準で判断するのが適切かの解説"
    }
    `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      scenario: { type: Type.STRING },
      optionA: { type: Type.STRING },
      optionB: { type: Type.STRING },
      correctCriteria: {
        type: Type.STRING,
        enum: ['Magnitude', 'Probability', 'Timeframe', 'Reversibility'],
      },
      explanation: { type: Type.STRING },
    },
    required: ['scenario', 'optionA', 'optionB', 'correctCriteria', 'explanation'],
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: 'application/json', responseSchema: schema },
    });
    const usage = extractUsage(response);
    if (response.text) {
      return { ...JSON.parse(cleanText(response.text)), usage };
    }
    throw new Error('No text');
  } catch (error) {
    const apiError = parseApiError(error);
    console.error('Weighing quiz generation failed:', apiError);
    return {
      scenario: '生成エラー',
      optionA: '-',
      optionB: '-',
      correctCriteria: 'Magnitude',
      explanation: 'エラー',
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  }
};

export const generateDefinitionQuiz = async (): Promise<{
  word: string;
  definition: string;
  counterExample: string;
  flawType: string;
  explanation: string;
  usage: TokenUsage;
}> => {
  const prompt = `
    ディベート教科書の第4章「定義闘争」の理解度クイズを作成してください。
    
    ある「言葉」に対して、わざと欠陥のある「定義」を設定し、その定義に対する「反例（Counter-example）」を挙げてください。
    そして、その定義がどのような論理的欠陥を持っているか（過包摂、過小包摂、循環定義）を指定してください。

    欠陥の種類:
    - Over-inclusive (過包摂): 定義が広すぎて、本来含まれないものまで含んでしまう（例: 「鳥とは卵を産む動物」→爬虫類も含まれる）
    - Under-inclusive (過小包摂): 定義が狭すぎて、本来含むべきものを除外してしまう（例: 「鳥とは空を飛ぶ動物」→ペンギンが含まれない）
    - Circular (循環定義): 定義の中にその言葉自体や同義語を使ってしまっている

    出力形式(JSON):
    {
      "word": "定義する言葉",
      "definition": "欠陥のある定義",
      "counterExample": "その定義の矛盾を突く反例",
      "flawType": "Over-inclusive", "Under-inclusive", "Circular" のいずれか,
      "explanation": "なぜその欠陥に分類されるのかの解説"
    }
    `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      word: { type: Type.STRING },
      definition: { type: Type.STRING },
      counterExample: { type: Type.STRING },
      flawType: { type: Type.STRING, enum: ['Over-inclusive', 'Under-inclusive', 'Circular'] },
      explanation: { type: Type.STRING },
    },
    required: ['word', 'definition', 'counterExample', 'flawType', 'explanation'],
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: 'application/json', responseSchema: schema },
    });
    const usage = extractUsage(response);
    if (response.text) {
      return { ...JSON.parse(cleanText(response.text)), usage };
    }
    throw new Error('No text');
  } catch (error) {
    const apiError = parseApiError(error);
    console.error('Definition quiz generation failed:', apiError);
    return {
      word: 'エラー',
      definition: '-',
      counterExample: '-',
      flawType: 'Over-inclusive',
      explanation: '生成エラー',
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  }
};
