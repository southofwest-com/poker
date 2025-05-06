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
    <div className="content-wrapper py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-3">Voting Session</h1>
        <div className="flex flex-col items-center justify-center space-y-1">
          <p className="text-gray-600 text-lg">Session ID: <span className="font-semibold">{sessionId}</span></p>
          <p className="text-gray-600 text-lg">Logged in as: <span className="font-semibold">{username}</span></p>
        </div>
      </div>
      
      <div className="max-w-xl mx-auto">
        <div className="card mb-8 hover:shadow-lg">
          {!isVotingActive && !results && (
            <div className="text-center py-16">
              <div className="animate-pulse mb-4">
                <svg className="w-16 h-16 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 5 5" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-3">Waiting for admin to start voting...</h2>
              <p className="text-gray-500">The voting round will begin soon</p>
            </div>
          )}
          
          {isVotingActive && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-blue-700 border-b border-gray-100 pb-3">Vote Now</h2>
              <VotingPanel />
            </div>
          )}
          
          {results && (
            <ResultsSummary results={results} />
          )}
        </div>
        
        <div className="text-center py-4">
          <button
            onClick={leaveSession}
            className="bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition-all hover:shadow-md font-medium"
          >
            Leave Session
          </button>
        </div>
      </div>
    </div>
  );
}