export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const { sessionId, username } = req.body;
  
  if (!sessionId || sessionId.trim() === '') {
    return res.status(400).json({ message: 'Session ID is required' });
  }
  
  if (!username || username.trim() === '') {
    return res.status(400).json({ message: 'Username is required' });
  }
  
  // In a real implementation, we would check if the session exists
  // For now, we'll assume the session exists and handle validation in socket.io
  
  res.status(200).json({ success: true });
}
