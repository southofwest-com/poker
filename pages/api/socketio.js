import { Server } from 'socket.io';

// In-memory storage for active sessions
const sessions = new Map();

// Helper to get session or create new one
const getOrCreateSession = (sessionId) => {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      users: [],
      isVotingActive: false,
      votes: new Map(),
      results: null,
      createdAt: Date.now(),
    });
  }
  return sessions.get(sessionId);
};

// Clean up expired sessions (older than 24 hours)
const cleanupSessions = () => {
  const now = Date.now();
  const expireTime = 24 * 60 * 60 * 1000; // 24 hours
  
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.createdAt > expireTime) {
      sessions.delete(sessionId);
    }
  }
};

// Run cleanup every hour
setInterval(cleanupSessions, 60 * 60 * 1000);

export default function SocketHandler(req, res) {
  // Only handle WebSocket connections
  if (!res.socket.server.io) {
    console.log('Setting up socket.io server...');
    
    const io = new Server(res.socket.server, {
      path: '/api/socketio',
      addTrailingSlash: false,
    });
    
    io.on('connection', (socket) => {
      console.log('New connection:', socket.id);
      const { sessionId } = socket.handshake.query;
      
      if (!sessionId) {
        socket.emit('error', 'No session ID provided');
        socket.disconnect();
        return;
      }
      
      // Join room based on session ID
      socket.join(sessionId);
      
      socket.on('join', ({ sessionId, username, isAdmin }) => {
        const session = getOrCreateSession(sessionId);
        
        // Check if username already exists in this session but with a different socket ID
        const existingUserIndex = session.users.findIndex(user => 
          user.username === username && user.id !== socket.id
        );
        
        if (existingUserIndex >= 0) {
          socket.emit('error', 'Username already taken');
          return;
        }
        
        // Remove any previous instances of this socket ID
        session.users = session.users.filter(user => user.id !== socket.id);
        
        // Check if max users reached (10)
        if (session.users.length >= 10) {
          socket.emit('error', 'Session is full (max 10 users)');
          return;
        }
        
        // Add user to session
        session.users.push({ 
          id: socket.id, 
          username, 
          isAdmin,
          hasVoted: session.votes.has(username)
        });
        
        // Notify all users in the session
        io.to(sessionId).emit('users-updated', session.users);
        
        // If voting is active or results exist, sync the state for the new user
        if (session.isVotingActive) {
          socket.emit('voting-started');
        } else if (session.results) {
          socket.emit('voting-ended', session.results);
        }
      });
      
      socket.on('start-voting', ({ sessionId }) => {
        const session = getOrCreateSession(sessionId);
        
        // Reset voting state
        session.isVotingActive = true;
        session.votes = new Map();
        session.results = null;
        
        // Reset user voting status
        session.users = session.users.map(user => ({
          ...user,
          hasVoted: false
        }));
        
        // Notify all users
        io.to(sessionId).emit('voting-started');
        io.to(sessionId).emit('users-updated', session.users);
      });
      
      socket.on('submit-vote', ({ sessionId, username, vote }) => {
        const session = getOrCreateSession(sessionId);
        
        if (!session.isVotingActive) {
          socket.emit('error', 'Voting is not active');
          return;
        }
        
        // Record the vote
        session.votes.set(username, vote);
        
        // Update user's voting status
        session.users = session.users.map(user => 
          user.username === username ? { ...user, hasVoted: true } : user
        );
        
        // Notify all users about updated status
        io.to(sessionId).emit('users-updated', session.users);
        
        // Check if all users have voted
        const allVoted = session.users.every(user => user.hasVoted);
        if (allVoted) {
          // End voting round automatically
          endVotingRound(io, sessionId);
        }
      });
      
      socket.on('end-voting', ({ sessionId }) => {
        endVotingRound(io, sessionId);
      });
      
      socket.on('reset-voting', ({ sessionId }) => {
        const session = getOrCreateSession(sessionId);
        
        // Clear voting state
        session.isVotingActive = false;
        session.votes = new Map();
        session.results = null;
        
        // Reset user voting status
        session.users = session.users.map(user => ({
          ...user,
          hasVoted: false
        }));
        
        // Notify all users
        io.to(sessionId).emit('session-reset');
        io.to(sessionId).emit('users-updated', session.users);
      });
      
      socket.on('close-session', ({ sessionId }) => {
        // Remove session from memory
        sessions.delete(sessionId);
        
        // Notify all users and close connections
        io.to(sessionId).emit('session-closed');
        io.in(sessionId).disconnectSockets();
      });
      
      socket.on('leave', ({ sessionId, username }) => {
        const session = getOrCreateSession(sessionId);
        
        // Remove user from session
        session.users = session.users.filter(user => user.username !== username);
        
        // Notify remaining users
        io.to(sessionId).emit('users-updated', session.users);
        
        // Remove empty sessions
        if (session.users.length === 0) {
          sessions.delete(sessionId);
        }
      });
      
      socket.on('disconnect', () => {
        console.log('Disconnected:', socket.id);
        
        // Find session this user was in
        for (const [sessionId, session] of sessions.entries()) {
          const userIndex = session.users.findIndex(user => user.id === socket.id);
          
          if (userIndex !== -1) {
            // Remove user from session
            session.users.splice(userIndex, 1);
            
            // Notify remaining users
            io.to(sessionId).emit('users-updated', session.users);
            
            // Remove empty sessions
            if (session.users.length === 0) {
              sessions.delete(sessionId);
            }
            
            break;
          }
        }
      });
    });
    
    // Helper function to end voting round
    function endVotingRound(io, sessionId) {
      const session = getOrCreateSession(sessionId);
      
      if (!session.isVotingActive) return;
      
      // Mark voting as inactive
      session.isVotingActive = false;
      
      // Prepare results
      const votes = [];
      let skipped = 0;
      
      session.votes.forEach((vote) => {
        if (vote === 'skip') {
          skipped++;
        } else {
          votes.push(vote);
        }
      });
      
      session.results = { votes, skipped };
      
      // Notify all users
      io.to(sessionId).emit('voting-ended', session.results);
    }
    
    res.socket.server.io = io;
  }
  
  res.end();
}