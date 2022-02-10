import log from '../../../lib/log/logger.js';
import create from '../../../lib/controllers/operation.controller.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      res.status(201).json(create(req));
    } catch (error) {
      log.error(error);
      res.status(400).json({success: false});
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
