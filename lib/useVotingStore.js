import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { io } from 'socket.io-client';

const useVotingStore = create(
  persist(
    (set, get) => {
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
        socketConnected: false,
        
        // Connect to socket server
        connectSocket: (sessionId) => {
          if (socket) socket.disconnect();
          
          socket = io({
            path: '/api/socketio',
            query: { sessionId }
          });
          
          socket.on('connect', () => {
            console.log('Socket connected');
            set({ socketConnected: true });
            
            // Re-join session on connect/reconnect
            const { username, isAdmin } = get();
            if (username && sessionId) {
              socket.emit('join', { sessionId, username, isAdmin });
            }
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
          
          socket.on('session-closed', () => {
            socket.disconnect();
            set({ 
              sessionId: null, 
              isAdmin: false, 
              username: '', 
              users: [],
              isVotingActive: false,
              hasVoted: false,
              selectedValue: null,
              results: null,
              socketConnected: false
            });
          });

          socket.on('error', (error) => {
            set({ error });
          });
          
          socket.on('disconnect', () => {
            console.log('Socket disconnected');
            set({ socketConnected: false });
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
            
            set({ 
              sessionId: data.sessionId, 
              isAdmin: true, 
              username,
              error: null
            });
            
            const socket = get().connectSocket(data.sessionId);
            
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
            
            set({ 
              sessionId, 
              isAdmin: false, 
              username,
              error: null
            });
            
            const socket = get().connectSocket(sessionId);
            
            socket.emit('join', { sessionId, username, isAdmin: false });
            
            return true;
          } catch (error) {
            set({ error: error.message });
            return false;
          }
        },
        
        // Initialize stored session (for page refresh)
        initSession: () => {
          const { sessionId, username, isAdmin } = get();
          if (sessionId && username) {
            const socket = get().connectSocket(sessionId);
            socket.emit('join', { sessionId, username, isAdmin });
          }
        },
        
        // Start a voting round
        startVoting: () => {
          if (!socket || !get().socketConnected) return;
          socket.emit('start-voting', { sessionId: get().sessionId });
        },
        
        // Submit a vote
        submitVote: (value) => {
          if (!socket || !get().isVotingActive || !get().socketConnected) return;
          
          socket.emit('submit-vote', { 
            sessionId: get().sessionId, 
            username: get().username,
            vote: value 
          });
          
          set({ hasVoted: true, selectedValue: value });
        },
        
        // End voting round (admin only)
        endVoting: () => {
          if (!socket || !get().isAdmin || !get().socketConnected) return;
          socket.emit('end-voting', { sessionId: get().sessionId });
        },
        
        // Reset for a new voting round
        resetVoting: () => {
          if (!socket || !get().isAdmin || !get().socketConnected) return;
          socket.emit('reset-voting', { sessionId: get().sessionId });
        },
        
        // Close session (admin only)
        closeSession: () => {
          if (!socket || !get().isAdmin || !get().socketConnected) return;
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
            results: null,
            socketConnected: false
          });
        },
        
        // Disconnect from session (non-admin)
        leaveSession: () => {
          if (!socket || !get().socketConnected) return;
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
            results: null,
            socketConnected: false
          });
        },
        
        // Clear error message
        clearError: () => {
          set({ error: null });
        }
      };
    },
    {
      name: 'voting-storage',
      partialize: (state) => ({
        sessionId: state.sessionId,
        isAdmin: state.isAdmin,
        username: state.username,
      }),
    }
  )
);

export default useVotingStore;