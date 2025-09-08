// Permite tu front en prod y local. Si prefieres comodín: const allowAny = '*'
const ALLOWED_ORIGINS = [
  'https://graceful-starship-012aa1.netlify.app',
  'http://localhost:5173',
];

exports.withCors = (handler) => async (event, context) => {
  const origin = event.headers?.origin || '';
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]; // o '*' si te da igual

  const baseHeaders = {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: baseHeaders, body: '' };
  }

  const res = await handler(event, context);

  return {
    ...res,
    headers: { ...(res.headers || {}), ...baseHeaders },
  };
};
