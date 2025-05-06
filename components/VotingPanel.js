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
    <div className="max-w-2xl mx-auto">
      {hasVoted ? (
        <div className="text-center py-12">
          {selectedValue === 'skip' ? (
            <div className="animate-fade-in">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-2xl font-bold mb-3 text-gray-700">You skipped this round</p>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="w-24 h-24 mx-auto rounded-full bg-indigo-100 flex items-center justify-center mb-6 transform transition-all duration-500 hover:scale-110">
                <span className="text-4xl font-bold text-indigo-600">{selectedValue}</span>
              </div>
              <p className="text-2xl font-bold mb-3 text-gray-700">You voted: {selectedValue}</p>
            </div>
          )}
          <p className="text-gray-500 mb-6">Waiting for others to complete voting...</p>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      ) : (
        <>
          <p className="mb-8 text-lg text-center text-gray-600">Select a value from 1-10 or skip this round:</p>
          <div className="grid grid-cols-5 gap-4 mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
              <button
                key={value}
                onClick={() => handleVote(value)}
                onMouseEnter={() => setHoveredValue(value)}
                onMouseLeave={() => setHoveredValue(null)}
                className={`py-6 rounded-xl text-xl font-bold transition-all duration-200 transform ${
                  hoveredValue === value
                    ? 'bg-indigo-600 text-white scale-110 shadow-lg'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:scale-105'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          <button
            onClick={() => handleVote('skip')}
            className="w-full py-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all text-gray-700 font-medium flex items-center justify-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Skip this round</span>
          </button>
        </>
      )}
    </div>
  );
}