export const getFacilitationBoardPrompt = (topic: string, transcript: string) => {
  return `
    以下のファシリテーション（合意形成）シミュレーションの現状を分析し、
    「仮想ホワイトボード」に書き出す内容を整理してください。
    
    テーマ: ${topic}
    
    [議論履歴]
    ${transcript}
    
    [タスク]
    1. Aさん（感情派/赤）とBさん（論理派/青）の現在の主張を整理する。
    2. 双方が合意している点（Agreed Points）と、対立している点（Conflicts）を抽出する。
    3. ファシリテーターへの次のアクション（Hint）を提案する。
    
    JSON形式で出力してください。
  `;
};
