// /api/cms.js
// Webflow CMS proxy for TFL Fireside page
// Add this file to your /api folder in the tfl-program-quiz Vercel repo

const WEBFLOW_TOKEN = 'eff84056421f2bb27cf785f18747ab3572e44de0b7bd76c4a920aa9340779daa';

const COLLECTIONS = {
  blogs:    '6934896dc906e9db8a0764f1',
  podcasts: '6934896dc906e9db8a076512',
  featured: '6a3d23d5fad9bb903f3d53cc',
};

export default async function handler(req, res) {
  // CORS — allow fitnessleagueapp.com and local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const col    = req.query.col;
  const offset = parseInt(req.query.offset || '0', 10);
  const limit  = 100;

  if (!col || !COLLECTIONS[col]) {
    return res.status(400).json({ error: 'Unknown collection: ' + col });
  }

  const collectionId = COLLECTIONS[col];
  const url = `https://api.webflow.com/v2/collections/${collectionId}/items?offset=${offset}&limit=${limit}`;

  try {
    const upstream = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${WEBFLOW_TOKEN}`,
        'accept-version': '2.0.0',
      },
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      return res.status(upstream.status).json({ error: text });
    }

    const data = await upstream.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
