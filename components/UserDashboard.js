import { useState, useEffect } from 'react';
import useVotingStore from '../lib/useVotingStore';
import VotingPanel from './VotingPanel';
import ResultsSummary from './ResultsSummary';

export default function UserDashboard() {
  const {
    sessionId,
    username,
    isVotingActive,
    results,
    leaveSession,
  } = useVotingStore();
  
  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Voting Session</h1>
        <p className="text-gray-600">Session ID: {sessionId}</p>
        <p className="text-gray-600">Logged in as: {username}</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        {!isVotingActive && !results && (
          <div className="text-center py-8">
            <h2 className="text-xl font-bold mb-2">Waiting for admin to start voting...</h2>
            <p className="text-gray-500">The voting round will begin soon</p>
          </div>
        )}
        
        {isVotingActive && (
          <div>
            <h2 className="text-xl font-bold mb-4">Vote Now</h2>
            <VotingPanel />
          </div>
        )}
        
        {results && (
          <ResultsSummary results={results} />
        )}
      </div>
      
      <div className="text-center">
        <button
          onClick={leaveSession}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Leave Session
        </button>
      </div>
    </div>
  );
}
