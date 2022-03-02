export default async function handler(req, res) {
  if (req.query.secret !== process.env.REVALIDATION_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    const path = req.query.path ? req.query.path : '';
    await res.unstable_revalidate('/' + path);
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
}
