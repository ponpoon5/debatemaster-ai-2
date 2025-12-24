import { DebateType } from '../../../../core/types';

export const getRandomTopicPrompt = (type?: DebateType) => {
  let typeDesc = '議論（ディベート）のテーマとして適した、興味深く、かつ賛否が分かれるトピック';
  if (type === DebateType.POLICY) {
    typeDesc =
      '「政策論題（Policy）」として、具体的な行動、制度変更、社会的ルールの是非を問うトピック（例：～を禁止すべきか、～を導入すべきか）';
  } else if (type === DebateType.FACT) {
    typeDesc =
      '「推定論題（Fact/Conjecture）」として、事実の真偽や存在、あるいは未来の予測を問うトピック（例：AIは意識を持つか、宇宙人は存在するか、歴史的解釈など）';
  } else if (type === DebateType.VALUE) {
    typeDesc =
      '「価値論題（Value）」として、物事の善悪、重要性、優劣といった価値観や倫理を問うトピック（例：自由は安全より重要か、嘘は常に悪か）';
  }

  return `
  ${typeDesc}を日本語で1つだけ提案してください。
  
  【出力の絶対ルール】
  1. トピックの文字列のみを出力してください。
  2. <think>タグや思考プロセスは**絶対に出力しないでください**。
  3. 余計な前置き、挨拶、引用符、Markdown装飾は含めないでください。
  `;
};

export const getTopicSuggestionsPrompt = (type?: DebateType) => {
  let context = '多様なジャンル（社会、テクノロジー、倫理、政治、経済など）の論題';
  if (type === DebateType.POLICY)
    context = '「政策論題（～すべきか）」に特化した、具体的かつ社会的な論題';
  if (type === DebateType.FACT)
    context = '「推定論題（～であるか）」に特化した、事実の真偽や可能性を問う論題';
  if (type === DebateType.VALUE)
    context = '「価値論題（～は善か、どちらが重要か）」に特化した、倫理的・哲学的な論題';

  return `
    ディベートの練習に適した、${context}を5つ提案してください。
    
    条件:
    1. 賛否が明確に分かれるもの。
    2. 日本語で出力する。
    3. JSON配列形式のみを出力する（例: ["テーマ1", "テーマ2"]）。
  `;
};
