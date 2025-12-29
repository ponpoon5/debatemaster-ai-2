import { Type, Schema } from '@google/genai';
import { ai } from '../client';
import { MODEL_NAME } from '../../../core/config/gemini.config';
import { TokenUsage, MiniGameType } from '../../../core/types';
import { cleanText } from '../utils/text-cleaner';
import { extractUsage } from '../utils/token-usage';
import { parseApiError } from '../../../core/utils/error-parser';

const FALLACY_TYPES = [
  'ストローマン (藁人形論法)',
  '論点ずらし (Red Herring)',
  '早急な一般化',
  '誤った二分法',
  '人身攻撃 (Ad Hominem)',
  'お前だって論法 (Tu Quoque)',
  '循環論法',
  '権威への訴え',
  '感情に訴える論証',
  'すべり坂論法 (Slippery Slope)',
];

export const generateMiniGameContent = async <T = unknown>(
  gameType: MiniGameType
): Promise<{ data: T; usage: TokenUsage }> => {
  let prompt = '';
  let schema: Schema | undefined;

  switch (gameType) {
    case MiniGameType.EVIDENCE_FILL:
      prompt = `
            不完全な主張（Claim）を1つ生成してください（日本語で）。
            形式: "主張: [主張文]。なぜなら、_________。"
            ユーザーはこの空白部分（根拠）を埋める必要があります。
            JSONで出力: { "incompleteClaim": string }
            `;
      schema = {
        type: Type.OBJECT,
        properties: { incompleteClaim: { type: Type.STRING } },
        required: ['incompleteClaim'],
      };
      break;
    case MiniGameType.FALLACY_QUIZ: {
      const selectedFallacy = FALLACY_TYPES[Math.floor(Math.random() * FALLACY_TYPES.length)];
      prompt = `
            論理的誤謬（Fallacy）に関する4択クイズを作成してください。
            
            ターゲット誤謬: ${selectedFallacy}
            
            タスク:
            1. 「${selectedFallacy}」を含む短い例文を作成し、questionTextとしてください。
            2. その誤謬名（${selectedFallacy}）を正解（correctFallacy）として設定してください。
            3. 他の誤謬名を3つダミーの選択肢として選び、正解と混ぜてoptions配列（計4つ）を作成してください。
            
            全て日本語で出力してください。
            JSON出力:
            {
              "questionText": "誤謬を含む例文",
              "correctFallacy": "正解の誤謬名",
              "options": ["正解", "ダミー1", "ダミー2", "ダミー3"] // シャッフルして,
              "explanation": "なぜこれがその誤謬なのかの解説と、見抜くためのポイント"
            }
            `;
      schema = {
        type: Type.OBJECT,
        properties: {
          questionText: { type: Type.STRING },
          correctFallacy: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          explanation: { type: Type.STRING },
        },
        required: ['questionText', 'correctFallacy', 'options', 'explanation'],
      };
      break;
    }
    case MiniGameType.ISSUE_PUZZLE:
      prompt = `
            論理的な文章を構成する4つの要素（Claim, Data, Warrant, Conclusion）を日本語で生成し、ランダムな順序で配列に格納してください。
            ユーザーはこれを正しい論理的順序に並べ替えます。
            JSON出力:
            {
               "segments": [
                  { "id": "1", "text": "...", "correctOrder": 1 },
                  ...
               ]
            }
            `;
      schema = {
        type: Type.OBJECT,
        properties: {
          segments: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                text: { type: Type.STRING },
                correctOrder: { type: Type.INTEGER },
              },
              required: ['id', 'text', 'correctOrder'],
            },
          },
        },
        required: ['segments'],
      };
      break;
    case MiniGameType.COMBO_REBUTTAL:
      prompt = `
             議論における短い「主張」を1つ日本語で生成してください。ユーザーが即座に反論するためのものです。
             JSON出力: { "claim": string }
             `;
      schema = {
        type: Type.OBJECT,
        properties: { claim: { type: Type.STRING } },
        required: ['claim'],
      };
      break;
    case MiniGameType.FERMI_ESTIMATION:
      prompt = `
             フェルミ推定の問題を1つ日本語で生成してください。
             
             条件:
             - 日本国内の事象に関するもの（例：ピアノ調律師の数、コンビニの数、マンホールの数など）
             - 答えが直感的には分からないが、論理的に分解して概算できるもの。
             - 一般的な難易度。
             
             JSON出力: { "question": string }
             `;
      schema = {
        type: Type.OBJECT,
        properties: { question: { type: Type.STRING } },
        required: ['question'],
      };
      break;
    case MiniGameType.LATERAL_THINKING:
      prompt = `
             水平思考（ラテラルシンキング）パズル、いわゆる「ウミガメのスープ」の問題を1つ作成してください。
             
             タスク:
             1. 不可解だが、理由を聞けば納得できる「状況（Situation）」を作成する。
             2. その背後にある「真相（Hidden Truth）」を作成する。
             
             条件:
             - 状況だけでは意味不明だが、論理と発想の転換で真相にたどり着けるもの。
             - グロテスクすぎたり、不快な内容は避けること。
             
             JSON出力: { "situation": string, "hiddenTruth": string }
             `;
      schema = {
        type: Type.OBJECT,
        properties: {
          situation: { type: Type.STRING },
          hiddenTruth: { type: Type.STRING },
        },
        required: ['situation', 'hiddenTruth'],
      };
      break;
    case MiniGameType.ACTIVE_INOCULATION:
      prompt = `
             能動的接種(Active Inoculation)演習の課題を生成してください。

             タスク:
             ユーザーに「特定の詭弁・論理的誤謬を意図的に使って、説得力のあるメールや主張文を書かせる」クリエイティブな課題を作成します。

             課題の構造:
             1. scenario: シナリオ設定(例: 「あなたは成績不振の学生です。教師を説得して合格させてもらう必要があります」)
             2. requiredFallacies: 必ず使用すべき詭弁・誤謬のリスト(最低4つ)
             3. targetAudience: 説得対象(例: 「厳しい教師」「懐疑的な上司」「慎重な顧客」など)
             4. objective: 達成すべき目標(例: 「単位を取得する」「予算を承認してもらう」など)

             条件:
             - requiredFallaciesには、${FALLACY_TYPES.join(', ')}から4-6個を選択してください
             - シナリオは倫理的に問題ないが、現実的な説得場面を想定してください
             - ユーザーが創造的に詭弁を組み合わせられるよう、適度に挑戦的な課題にしてください

             JSON出力: {
               "scenario": string,
               "requiredFallacies": string[],
               "targetAudience": string,
               "objective": string
             }
             `;
      schema = {
        type: Type.OBJECT,
        properties: {
          scenario: { type: Type.STRING },
          requiredFallacies: { type: Type.ARRAY, items: { type: Type.STRING } },
          targetAudience: { type: Type.STRING },
          objective: { type: Type.STRING },
        },
        required: ['scenario', 'requiredFallacies', 'targetAudience', 'objective'],
      };
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: 'application/json', responseSchema: schema },
    });
    const usage = extractUsage(response);
    if (response.text) {
      const cleaned = cleanText(response.text);
      try {
        return { data: JSON.parse(cleaned), usage };
      } catch (parseError) {
        console.error(`❌ JSON Parse Error for ${gameType}:`, parseError);
        console.error('📝 Cleaned text:', cleaned);
        console.error('📄 Original text:', response.text);
        throw parseError;
      }
    }
    throw new Error('No text');
  } catch (error) {
    const apiError = parseApiError(error);
    console.error(`Mini game content generation failed (${gameType}):`, apiError);
    return { data: null, usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 } };
  }
};

export const evaluateMiniGameAnswer = async (
  gameType: MiniGameType,
  questionData: unknown,
  userAnswer: unknown
): Promise<{ score: number; feedback: string; usage: TokenUsage }> => {
  let specificCriteria = '';

  switch (gameType) {
    case MiniGameType.EVIDENCE_FILL:
      specificCriteria =
        '論理性(Logic)、具体性(Specifics)、説得力(Persuasion)。なぜそのスコアなのか、どうすればより良くなるか（改善点）を具体的に。';
      break;
    case MiniGameType.FALLACY_QUIZ:
      specificCriteria = '正誤判定。なぜその選択肢が正解/不正解なのかの解説。';
      break;
    case MiniGameType.ISSUE_PUZZLE:
      specificCriteria = '論理的な順序の解説。';
      break;
    case MiniGameType.COMBO_REBUTTAL:
      specificCriteria = '反論の有効性と改善点。即座の返しとして鋭いか。';
      break;
    case MiniGameType.FERMI_ESTIMATION:
      specificCriteria = `
            フェルミ推定の評価:
            1. 分解アプローチ（Logic Breakdown）: 問題を適切な要素に分解できているか（例: 人口×普及率×...）。最終的な数値の正確さよりも、この**プロセスの妥当性**を8割重視して採点してください。
            2. 仮説設定: 各要素に置いた仮定の数値が、常識的な範囲から大きく逸脱していないか。
            3. 計算結果: ロジックに基づいた計算ができているか。
            
            フィードバックには、より良い分解モデルの例（模範解答）を含めてください。
            `;
      break;
    case MiniGameType.LATERAL_THINKING:
      specificCriteria = `
            水平思考パズルの評価:
            真相（Hidden Truth）: ${questionData.hiddenTruth}
            
            ユーザーの推論が、真相にどれだけ迫っているかを評価してください。
            - 核心を突いている場合: 高得点。
            - 良い視点だが不完全: 部分点とヒント。
            - 全く見当違い: 低得点と、思考を広げるためのヒント。
            
            フィードバックは、ユーザーの柔軟な発想を褒めつつ、真相への論理的な繋がりを解説してください。
            `;
      break;
    case MiniGameType.ACTIVE_INOCULATION:
      specificCriteria = `
            能動的接種演習の評価:
            必須の詭弁・誤謬: ${questionData.requiredFallacies.join(', ')}

            評価基準:
            1. **詭弁の使用(60点)**: 指定された詭弁を正確に、かつ自然に使用できているか
               - 各詭弁の使用を個別に確認してください
               - 使用されている詭弁: リスト化
               - 欠けている詭弁: リスト化
               - 各詭弁が15点満点(4つで60点、5つで75点、6つで90点)

            2. **説得力(25点)**: 詭弁を使っているにもかかわらず、表面的には説得力があるか
               - 文章の構成が論理的に見えるか
               - 感情に訴える要素が効果的に使われているか
               - ターゲット(${questionData.targetAudience})に適した言葉選びか

            3. **創造性(15点)**: 複数の詭弁を巧みに組み合わせているか
               - 詭弁同士のシナジーがあるか
               - 独創的なアプローチが見られるか

            フィードバック構成:
            - 使用された詭弁の詳細な分析(どこでどの詭弁が使われているか)
            - 欠けている詭弁の指摘
            - 詭弁の効果的な組み合わせ方の提案
            - **重要**: この演習の目的は「詭弁を見抜く力を養うこと」であり、実際に詭弁を使うことを推奨するものではないことを明記してください
            `;
      break;
  }

  const prompt = `
    ミニゲームの回答を採点してください。
    Game Type: ${gameType}
    Question Data: ${JSON.stringify(questionData)}
    User Answer: ${JSON.stringify(userAnswer)}
    
    採点基準:
    ${specificCriteria}
    
    解説（feedback）は日本語で記述し、学習者のためになる詳しいフィードバックを提供してください。
    **特にスコアの根拠（なぜ減点されたか、どうすれば満点だったか）を詳しく説明してください。**

    JSON出力: { "score": number, "feedback": string }
    `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: { score: { type: Type.INTEGER }, feedback: { type: Type.STRING } },
    required: ['score', 'feedback'],
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: 'application/json', responseSchema: schema },
    });
    const usage = extractUsage(response);
    if (response.text) {
      const cleaned = cleanText(response.text);
      try {
        return { ...JSON.parse(cleaned), usage };
      } catch (parseError) {
        console.error(`❌ JSON Parse Error for ${gameType} evaluation:`, parseError);
        console.error('📝 Cleaned text:', cleaned);
        console.error('📄 Original text:', response.text);
        throw parseError;
      }
    }
    throw new Error('No text');
  } catch (error) {
    const apiError = parseApiError(error);
    console.error(`Mini game answer evaluation failed (${gameType}):`, apiError);
    return {
      score: 0,
      feedback: 'Error',
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  }
};
