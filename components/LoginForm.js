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
    <div className="max-w-md w-full mx-auto p-10 bg-white rounded-xl shadow-lg border border-gray-100">
      <h1 className="text-3xl font-bold mb-10 text-center text-blue-600">Anonymous Voting Tool</h1>
      
      {/* Navigation Bar */}
      <nav className="mb-8">
        <ul className="flex rounded-lg overflow-hidden shadow-md">
          <li className="flex-1">
            <button
              className={`w-full py-4 font-medium transition-colors ${isCreating 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              onClick={() => setIsCreating(true)}
            >
              Create Session
            </button>
          </li>
          <li className="flex-1">
            <button
              className={`w-full py-4 font-medium transition-colors ${!isCreating 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              onClick={() => setIsCreating(false)}
            >
              Join Session
            </button>
          </li>
        </ul>
      </nav>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Enter your username"
            maxLength={20}
            required
          />
        </div>
        
        {!isCreating && (
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium mb-2">Session ID</label>
            <input
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter session ID"
              required
            />
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg shadow-md"
        >
          {isCreating ? 'Create Voting Session' : 'Join Voting Session'}
        </button>
      </form>
    </div>
  );
}