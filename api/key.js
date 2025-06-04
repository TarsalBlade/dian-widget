export default function handler(req, res) {
  const apiKey = process.env.DIAN_WIDGET_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }
  res.status(200).json({ apiKey });
}
