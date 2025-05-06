import { useState, useEffect } from 'react';
import useVotingStore from '../lib/useVotingStore';
import QRCodeDisplay from './QRCodeDisplay';
import VotingPanel from './VotingPanel';
import ResultsSummary from './ResultsSummary';

export default function AdminDashboard() {
  const {
    sessionId,
    users,
    isVotingActive,
    hasVoted,
    results,
    startVoting,
    endVoting,
    resetVoting,
    closeSession,
  } = useVotingStore();
  
  const [sessionUrl, setSessionUrl] = useState('');
  
  useEffect(() => {
    if (sessionId) {
      const url = `${window.location.origin}/vote/${sessionId}`;
      setSessionUrl(url);
    }
  }, [sessionId]);
  
  return (
    <div className="content-wrapper py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-3">Admin Dashboard</h1>
        <p className="text-gray-600 text-lg">Session ID: <span className="font-semibold">{sessionId}</span></p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="card mb-8 hover:shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-blue-700 border-b border-gray-100 pb-3">
              Connected Users ({users.length}/10)
            </h2>
            {users.length === 0 ? (
              <p className="text-gray-500 py-4">No users connected yet</p>
            ) : (
              <ul className="space-y-2 py-2">
                {users.map((user) => (
                  <li key={user.username} className="flex items-center p-2 rounded-lg hover:bg-blue-50">
                   <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold mr-3">
                   //{user.username.charAt(0).toUpperCase()}
                   </div> 
                    <span className="flex-1">
                      {user.username} {user.isAdmin ? <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded ml-2">Admin</span> : ''}
                    </span>
                    {user.hasVoted && isVotingActive && 
                      <span className="text-green-500 ml-2">✓ Voted</span>
                    }
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="card">
            <h2 className="text-2xl font-bold mb-6 text-blue-700 border-b border-gray-100 pb-3">Session Controls</h2>
            
            <div className="space-y-4 py-2">
              {!isVotingActive && !results && (
                <button
                  onClick={startVoting}
                  disabled={users.length < 1}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-lg shadow-sm transition-all ${
                    users.length < 1
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600 hover:shadow-md'
                  }`}
                >
                  Start Voting Round
                </button>
              )}
              
              {isVotingActive && (
                <button
                  onClick={endVoting}
                  className="w-full bg-yellow-500 text-white py-3 px-4 rounded-lg font-medium text-lg shadow-sm hover:bg-yellow-600 hover:shadow-md transition-all"
                >
                  End Voting Round Early
                </button>
              )}
              
              {results && (
                <button
                  onClick={resetVoting}
                  className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium text-lg shadow-sm hover:bg-blue-600 hover:shadow-md transition-all"
                >
                  Reset for New Round
                </button>
              )}
              
              <button
                onClick={closeSession}
                className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-medium text-lg shadow-sm hover:bg-red-600 hover:shadow-md transition-all"
              >
                Close Voting Session
              </button>
            </div>
          </div>
        </div>
        
        <div>
          {!isVotingActive && !results && (
            <div className="card mb-8 hover:shadow-lg">
              <QRCodeDisplay url={sessionUrl} />
            </div>
          )}
          
          {isVotingActive && (
            <div className="card mb-8 hover:shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-blue-700 border-b border-gray-100 pb-3">Your Vote</h2>
              <VotingPanel />
            </div>
          )}
          
          {results && (
            <div className="card mb-8 hover:shadow-lg">
              <ResultsSummary results={results} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}