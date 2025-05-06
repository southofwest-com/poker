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
    <div className="max-w-md w-full mx-auto p-10 bg-white rounded-xl shadow-lg border border-gray-100 transition-all">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Anonymous Voting Tool</h1>
      
      {/* Navigation Bar */}
      <nav className="mb-8">
        <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
          <table>

          <tr>
             <th> <button
                className={`w-full py-4 px-4 font-medium text-lg transition-all flex items-center justify-center ${isCreating 
                  ? 'bg-blue-600 text-white shadow-inner' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                onClick={() => handleModeChange(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create Session
              </button>
       </th><th>
              <button
                className={`w-full py-4 px-4 font-medium text-lg transition-all flex items-center justify-center ${!isCreating 
                  ? 'bg-blue-600 text-white shadow-inner' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                onClick={() => handleModeChange(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3.586a1 1 0 01.707.293l2 2a1 1 0 01.293.707V11a1 1 0 01-1 1h-1a1 1 0 01-1-1V8a1 1 0 00-1-1H4a1 1 0 01-1-1V4zm9 0a1 1 0 00-1 1v3.586a1 1 0 00.293.707l2 2a1 1 0 00.707.293H17a1 1 0 001-1V7a1 1 0 00-1-1h-1a1 1 0 01-1-1V4a1 1 0 00-1-1h-3z" clipRule="evenodd" />
                </svg>
                Join Session
              </button>
              </th>
              </tr>
              </table>
        </div>
      </nav>
      
      <form onSubmit={handleSubmit} className="space-y-8 transition-all duration-300">
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
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-all font-medium text-lg shadow-md hover:shadow-lg"
        >
          {isCreating ? (
            <span className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Create Voting Session
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
              Join Voting Session
            </span>
          )}
        </button>
      </form>
    </div>
  );
}