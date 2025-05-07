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

  const handleModeChange = (mode) => {
    if ((mode === true && isCreating) || (mode === false && !isCreating)) {
      return; // Already in this mode
    }
    
    // Clear any previous errors when switching modes
    clearError();
    setIsCreating(mode);
  };

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
    <div className="max-w-md w-full mx-auto p-6 sm:p-10 bg-white rounded-xl shadow-lg border border-gray-100 transition-all">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-indigo-600">Anonymous Voting Tool</h1>
      
      {/* Navigation Tabs */}
      <div className="flex mb-8 border-b border-gray-200">
        <button
          type="button"
          className={`flex-1 py-3 px-4 text-sm sm:text-base font-medium transition-all ${
            isCreating 
              ? 'text-indigo-600 border-b-2 border-indigo-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => handleModeChange(true)}
        >
          Create a new session
        </button>
        <button
          type="button"
          className={`flex-1 py-3 px-4 text-sm sm:text-base font-medium transition-all ${
            !isCreating 
              ? 'text-indigo-600 border-b-2 border-indigo-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => handleModeChange(false)}
        >
          Join an existing voting session
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm sm:text-base text-gray-700 font-medium mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            placeholder="Enter your username"
            maxLength={20}
            required
          />
        </div>
        
        {!isCreating && (
          <div>
            <label className="block text-sm sm:text-base text-gray-700 font-medium mb-2">Session ID</label>
            <input
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="Enter session ID"
              required
            />
          </div>
        )}
        
        {error && (
          <div className="p-3 sm:p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 text-sm">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 sm:py-4 px-6 rounded-lg hover:bg-indigo-700 transition-all font-medium text-sm sm:text-base shadow-md hover:shadow-lg"
        >
          {isCreating ? 'Start A Voting Session' : 'Join Voting Session'}
        </button>
      </form>
    </div>
  );
}