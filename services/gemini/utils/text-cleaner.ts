export const cleanText = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/<think>[\s\S]*?(?:<\/think>|$)/gi, '')
    .replace(/^\s*THINK:[\s\S]*?(?:\n\n|$)/gim, '')
    .replace(/^\s*Thinking:[\s\S]*?(?:\n\n|$)/gim, '')
    .replace(/^\s*Thinking Process:[\s\S]*?(?:\n\n|$)/gim, '')
    .replace(/^\s*Thinking\.\.\.[\s\S]*?(?:\n\n|$)/gim, '')
    .replace(/\*\*/g, '')
    .trim();
};
