import log from "../../lib/log/logger";

export default async function handler(req, res) {
  if (req.query.secret !== process.env.REVALIDATION_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    const path = req.query.path ? req.query.path : '';
    await res.revalidate('/' + path);
    return res.json({ revalidated: true });
  } catch (err) {
    log.error('Error revalidating :');
    log.error(err);
    return res.status(500).send('Error revalidating');
  }
}
