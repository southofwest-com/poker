import { nanoid } from 'nanoid';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const { username } = req.body;
  
  if (!username || username.trim() === '') {
    return res.status(400).json({ message: 'Username is required' });
  }
  
  // Generate a short unique session ID
  const sessionId = nanoid(6);
  
  res.status(200).json({ sessionId });
}
