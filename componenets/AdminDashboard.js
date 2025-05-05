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
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Session ID: {sessionId}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Connected Users ({users.length}/10)</h2>
            {users.length === 0 ? (
              <p className="text-gray-500">No users connected yet</p>
            ) : (
              <ul className="list-disc pl-5">
                {users.map((user) => (
                  <li key={user.username} className="mb-1">
                    {user.username} {user.isAdmin ? '(Admin)' : ''} {user.hasVoted && isVotingActive ? '✓ Voted' : ''}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Session Controls</h2>
            
            {!isVotingActive && !results && (
              <button
                onClick={startVoting}
                disabled={users.length < 1}
                className={`w-full py-2 px-4 rounded mb-4 ${
                  users.length < 1
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                Start Voting Round
              </button>
            )}
            
            {isVotingActive && (
              <button
                onClick={endVoting}
                className="w-full bg-yellow-500 text-white py-2 px-4 rounded mb-4 hover:bg-yellow-600"
              >
                End Voting Round Early
              </button>
            )}
            
            {results && (
              <button
                onClick={resetVoting}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded mb-4 hover:bg-blue-600"
              >
                Reset for New Round
              </button>
            )}
            
            <button
              onClick={closeSession}
              className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Close Voting Session
            </button>
          </div>
        </div>
        
        <div>
          {!isVotingActive && !results && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <QRCodeDisplay url={sessionUrl} />
            </div>
          )}
          
          {isVotingActive && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-bold mb-4">Your Vote</h2>
              <VotingPanel />
            </div>
          )}
          
          {results && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <ResultsSummary results={results} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
