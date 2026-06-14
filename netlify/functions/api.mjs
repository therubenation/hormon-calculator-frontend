const BACKEND = 'http://188.138.38.172:8080';

export default async (req) => {
  const { pathname, search } = new URL(req.url);
  const target = BACKEND + pathname + search;

  const init = {
    method: req.method,
    headers: { 'content-type': 'application/json' },
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = await req.text();
  }

  const upstream = await fetch(target, init);
  const text = await upstream.text();

  return new Response(text, {
    status: upstream.status,
    headers: { 'content-type': upstream.headers.get('content-type') ?? 'application/json' },
  });
};

export const config = { path: '/api/*' };
