// CORS middleware for API routes
export function setCorsHeaders(req, res) {
  const allowedOrigins = [
    'https://debatemaster-ai-2.vercel.app',
    'https://debatemaster-ai-2-git-main-ponpons-projects-8e7cf0e3.vercel.app',
  ];

  // Allow localhost in development
  const origin = req.headers.origin;
  if (origin && (allowedOrigins.includes(origin) || origin.startsWith('http://localhost:'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }

  return false;
}
