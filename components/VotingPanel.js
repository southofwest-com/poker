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
        <div className="text-center py-4">
          <p className="text-xl font-bold mb-2">
            {selectedValue === 'skip' 
              ? 'You skipped this round' 
              : `You voted: ${selectedValue}`}
          </p>
          <p className="text-gray-500">Waiting for others to complete voting...</p>
        </div>
      ) : (
        <>
          <p className="mb-4">Select a value from 1-10 or skip this round:</p>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
              <button
                key={value}
                onClick={() => handleVote(value)}
                onMouseEnter={() => setHoveredValue(value)}
                onMouseLeave={() => setHoveredValue(null)}
                className={`py-4 rounded text-lg font-bold ${
                  hoveredValue === value
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          <button
            onClick={() => handleVote('skip')}
            className="w-full py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Skip this round
          </button>
        </>
      )}
    </div>
  );
}
