import { create } from 'zustand';
import { io } from 'socket.io-client';

const useVotingStore = create((set, get) => {
  // Initialize with no socket connection
  let socket = null;

  return {
    // Session state
    sessionId: null,
    isAdmin: false,
    username: '',
    users: [],
    isVotingActive: false,
    hasVoted: false,
    selectedValue: null,
    results: null,
    error: null,
    
    // Connect to socket server
    connectSocket: (sessionId) => {
      if (socket) socket.disconnect();
      
      socket = io({
        path: '/api/socketio',
        query: { sessionId }
      });
      
      socket.on('connect', () => {
        console.log('Socket connected');
      });

      socket.on('users-updated', (users) => {
        set({ users });
      });

      socket.on('voting-started', () => {
        set({ isVotingActive: true, hasVoted: false, selectedValue: null, results: null });
      });

      socket.on('voting-ended', (results) => {
        set({ isVotingActive: false, results });
      });

      socket.on('session-reset', () => {
        set({ isVotingActive: false, hasVoted: false, selectedValue: null, results: null });
      });

      socket.on('error', (error) => {
        set({ error });
      });

      return socket;
    },
    
    // Create a new voting session
    createSession: async (username) => {
      try {
        const response = await fetch('/api/session/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username })
        });
        
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message || 'Failed to create session');
        
        const socket = get().connectSocket(data.sessionId);
        
        set({ 
          sessionId: data.sessionId, 
          isAdmin: true, 
          username,
          error: null
        });
        
        socket.emit('join', { sessionId: data.sessionId, username, isAdmin: true });
        
        return data.sessionId;
      } catch (error) {
        set({ error: error.message });
        return null;
      }
    },
    
    // Join an existing session
    joinSession: async (sessionId, username) => {
      try {
        const response = await fetch(`/api/session/join`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, username })
        });
        
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message || 'Failed to join session');
        
        const socket = get().connectSocket(sessionId);
        
        set({ 
          sessionId, 
          isAdmin: false, 
          username,
          error: null
        });
        
        socket.emit('join', { sessionId, username, isAdmin: false });
        
        return true;
      } catch (error) {
        set({ error: error.message });
        return false;
      }
    },
    
    // Start a voting round
    startVoting: () => {
      if (!socket) return;
      socket.emit('start-voting', { sessionId: get().sessionId });
    },
    
    // Submit a vote
    submitVote: (value) => {
      if (!socket || !get().isVotingActive) return;
      
      socket.emit('submit-vote', { 
        sessionId: get().sessionId, 
        username: get().username,
        vote: value 
      });
      
      set({ hasVoted: true, selectedValue: value });
    },
    
    // End voting round (admin only)
    endVoting: () => {
      if (!socket || !get().isAdmin) return;
      socket.emit('end-voting', { sessionId: get().sessionId });
    },
    
    // Reset for a new voting round
    resetVoting: () => {
      if (!socket || !get().isAdmin) return;
      socket.emit('reset-voting', { sessionId: get().sessionId });
    },
    
    // Close session (admin only)
    closeSession: () => {
      if (!socket || !get().isAdmin) return;
      socket.emit('close-session', { sessionId: get().sessionId });
      socket.disconnect();
      set({ 
        sessionId: null, 
        isAdmin: false, 
        username: '', 
        users: [],
        isVotingActive: false,
        hasVoted: false,
        selectedValue: null,
        results: null
      });
    },
    
    // Disconnect from session (non-admin)
    leaveSession: () => {
      if (!socket) return;
      socket.emit('leave', { 
        sessionId: get().sessionId,
        username: get().username
      });
      socket.disconnect();
      set({ 
        sessionId: null, 
        isAdmin: false, 
        username: '', 
        users: [],
        isVotingActive: false,
        hasVoted: false,
        selectedValue: null,
        results: null
      });
    },
    
    // Clear error message
    clearError: () => {
      set({ error: null });
    }
  };
});

export default useVotingStore;
