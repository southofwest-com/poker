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
    <div className="max-w-md w-full mx-auto">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="bg-primary-600 text-white p-4 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">VoteSync</h1>
        <p className="text-gray-500 mb-3">Anonymous real-time voting for teams</p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 pt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {isCreating ? 'Create a new voting session' : 'Join an existing session'}
          </h2>
          
          <div className="flex mb-6 rounded-lg overflow-hidden">
            <button
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors duration-200 ${
                isCreating 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setIsCreating(true)}
            >
              Create
            </button>
            <button
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors duration-200 ${
                !isCreating 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setIsCreating(false)}
            >
              Join
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2">
          <div className="mb-4">
            <label className="label" htmlFor="username">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input pl-10"
                placeholder="Enter your username"
                maxLength={20}
                required
              />
            </div>
          </div>
          
          {!isCreating && (
            <div className="mb-4">
              <label className="label" htmlFor="sessionId">Session ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="sessionId"
                  type="text"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  className="input pl-10"
                  placeholder="Enter session ID"
                  required
                />
              </div>
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center"
          >
            {isCreating ? 'Create Session' : 'Join Session'}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </form>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-gray-500 text-sm">
          Create or join a voting session to get started.
          <br />
          Share the session link with your team members.
        </p>
      </div>
    </div>
  );
}