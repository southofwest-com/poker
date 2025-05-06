import { useState } from 'react';
import useVotingStore from '../lib/useVotingStore';

export default function VotingPanel() {
  const { submitVote, hasVoted, selectedValue } = useVotingStore();
  const [hoveredValue, setHoveredValue] = useState(null);
  
  const handleVote = (value) => {
    if (hasVoted) return;
    submitVote(value);
  };
  
  return (
    <div>
      {hasVoted ? (
        <div className="text-center py-8">
          {selectedValue === 'skip' ? (
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <p className="text-2xl font-bold mb-3 text-gray-700">You skipped this round</p>
            </div>
          ) : (
            <div>
              <div className="h-24 w-24 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <span className="text-4xl font-bold text-blue-600">{selectedValue}</span>
              </div>
              <p className="text-2xl font-bold mb-3 text-gray-700">You voted: {selectedValue}</p>
            </div>
          )}
          <p className="text-gray-500">Waiting for others to complete voting...</p>
          <div className="mt-6 flex justify-center">
            <div className="animate-pulse flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <p className="mb-6 text-lg text-center">Select a value from 1-10 or skip this round:</p>
          <div className="grid grid-cols-5 gap-3 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
              <button
                key={value}
                onClick={() => handleVote(value)}
                onMouseEnter={() => setHoveredValue(value)}
                onMouseLeave={() => setHoveredValue(null)}
                className={`py-5 rounded-lg text-xl font-bold transition-all transform ${
                  hoveredValue === value
                    ? 'bg-blue-600 text-white scale-105 shadow-md'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          <button
            onClick={() => handleVote('skip')}
            className="w-full py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all text-gray-700 font-medium"
          >
            Skip this round
          </button>
        </>
      )}
    </div>
  );
}