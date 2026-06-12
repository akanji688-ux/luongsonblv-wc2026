// Luongson BLV Worker — Cloudflare KV: BLV_LUONGSON
const PASS = 'luongson2026';
const KV_KEY = 'blvs';

export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    };
    if (request.method === 'OPTIONS') return new Response(null, {headers: cors});

    if (request.method === 'GET') {
      const raw = await env.BLV_LUONGSON.get(KV_KEY);
      const data = raw ? JSON.parse(raw) : {blvs: []};
      return new Response(JSON.stringify(data), {
        headers: {...cors, 'Content-Type': 'application/json'},
      });
    }

    if (request.method === 'PUT') {
      const auth = request.headers.get('Authorization') || '';
      if (auth !== 'Bearer ' + PASS) {
        return new Response(JSON.stringify({ok: false, error: 'Unauthorized'}), {
          status: 401, headers: {...cors, 'Content-Type': 'application/json'},
        });
      }
      const body = await request.json();
      await env.BLV_LUONGSON.put(KV_KEY, JSON.stringify(body));
      return new Response(JSON.stringify({ok: true}), {
        headers: {...cors, 'Content-Type': 'application/json'},
      });
    }

    return new Response('Not Found', {status: 404});
  },
};
