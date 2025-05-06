import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useVotingStore from '../lib/useVotingStore';

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isCreating, setIsCreating] = useState(true);
  const { createSession, joinSession, error, clearError } = useVotingStore();

  // Check for join parameter in URL to switch to join mode
  useEffect(() => {
    if (router.query.join) {
      setIsCreating(false);
      setSessionId(router.query.join);
    }
  }, [router.query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }
    
    if (isCreating) {
      const newSessionId = await createSession(username);
      if (newSessionId) {
        router.push(`/vote/${newSessionId}`);
      }
    } else {
      if (!sessionId.trim()) {
        alert('Please enter a session ID');
        return;
      }
      
      const joined = await joinSession(sessionId, username);
      if (joined) {
        router.push(`/vote/${sessionId}`);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Anonymous Voting Tool</h1>
      
      <div className="flex mb-4">
        <button
          className={`flex-1 py-2 ${isCreating ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setIsCreating(true)}
        >
          Create Session
        </button>
        <button
          className={`flex-1 py-2 ${!isCreating ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setIsCreating(false)}
        >
          Join Session
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter your username"
            maxLength={20}
            required
          />
        </div>
        
        {!isCreating && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Session ID</label>
            <input
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter session ID"
              required
            />
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          {isCreating ? 'Create Voting Session' : 'Join Voting Session'}
        </button>
      </form>
    </div>
  );
}