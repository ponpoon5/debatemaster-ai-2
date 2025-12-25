// Input validation for Gemini API requests
const ALLOWED_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash-exp',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
];

const MAX_CONTENT_LENGTH = 50000; // characters
const MAX_HISTORY_LENGTH = 100; // messages

export function validateGenerateRequest(body) {
  const { model, contents, config } = body;

  // Validate model
  if (!model || typeof model !== 'string') {
    return { valid: false, error: 'Invalid model' };
  }

  if (!ALLOWED_MODELS.includes(model)) {
    return { valid: false, error: 'Model not allowed' };
  }

  // Validate contents
  if (!contents || !Array.isArray(contents)) {
    return { valid: false, error: 'Invalid contents' };
  }

  if (contents.length > MAX_HISTORY_LENGTH) {
    return { valid: false, error: 'Contents too long' };
  }

  // Validate content length
  const totalLength = JSON.stringify(contents).length;
  if (totalLength > MAX_CONTENT_LENGTH) {
    return { valid: false, error: 'Content exceeds maximum length' };
  }

  // Validate config (optional)
  if (config && typeof config !== 'object') {
    return { valid: false, error: 'Invalid config' };
  }

  return { valid: true };
}

export function validateChatRequest(body) {
  const { model, history, message, config } = body;

  // Validate model
  if (!model || typeof model !== 'string') {
    return { valid: false, error: 'Invalid model' };
  }

  if (!ALLOWED_MODELS.includes(model)) {
    return { valid: false, error: 'Model not allowed' };
  }

  // Validate message
  if (!message || typeof message !== 'string') {
    return { valid: false, error: 'Invalid message' };
  }

  if (message.length > 10000) {
    return { valid: false, error: 'Message too long' };
  }

  // Validate history (optional)
  if (history && !Array.isArray(history)) {
    return { valid: false, error: 'Invalid history' };
  }

  if (history && history.length > MAX_HISTORY_LENGTH) {
    return { valid: false, error: 'History too long' };
  }

  return { valid: true };
}
