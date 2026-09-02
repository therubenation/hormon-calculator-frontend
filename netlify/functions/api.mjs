const BACKEND = 'https://hclab-api.rubensteijn.de';

export default async (req) => {
  const { pathname, search } = new URL(req.url);
  const target = BACKEND + pathname + search;

  const init = {
    method: req.method,
    headers: { 'content-type': 'application/json' },
  };

  let body;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = await req.text();
    init.body = body;
  }

  console.log(`[proxy] ${req.method} ${target}`, body ?? '');

  let upstream;
  try {
    upstream = await fetch(target, init);
  } catch (err) {
    console.error(`[proxy] fetch failed:`, err.message);
    return new Response(JSON.stringify({ error: 'Backend unreachable', detail: err.message }), {
      status: 502,
      headers: { 'content-type': 'application/json' },
    });
  }

  const text = await upstream.text();
  if (!upstream.ok) {
    console.error(`[proxy] backend ${upstream.status} for ${req.method} ${target}:`, text);
  }

  return new Response(text, {
    status: upstream.status,
    headers: { 'content-type': upstream.headers.get('content-type') ?? 'application/json' },
  });
};

export const config = { path: '/api/*' };
