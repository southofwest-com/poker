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
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-4">
      {hasVoted ? (
        <div className="text-center py-8 sm:py-12">
          {selectedValue === 'skip' ? (
            <div className="animate-fade-in">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-700">You skipped this round</p>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-indigo-100 flex items-center justify-center mb-4 sm:mb-6 transform transition-all duration-500 hover:scale-110">
                <span className="text-3xl sm:text-4xl font-bold text-indigo-600">{selectedValue}</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-700">You voted: {selectedValue}</p>
            </div>
          )}
          <p className="text-gray-500 mb-4 sm:mb-6">Waiting for others to complete voting...</p>
          <div className="flex justify-center space-x-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      ) : (
        <>
          <p className="mb-6 sm:mb-8 text-base sm:text-lg text-center text-gray-600">Select a value from 1-10 or skip this round:</p>
          <div className="grid grid-cols-5 gap-2 sm:gap-4 mb-6 sm:mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
              <button
                key={value}
                onClick={() => handleVote(value)}
                onMouseEnter={() => setHoveredValue(value)}
                onMouseLeave={() => setHoveredValue(null)}
                className={`py-4 sm:py-6 rounded-lg sm:rounded-xl text-lg sm:text-xl font-bold transition-all duration-200 transform ${
                  hoveredValue === value
                    ? 'bg-indigo-600 text-white scale-105 sm:scale-110 shadow-lg'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:scale-105'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          <button
            onClick={() => handleVote('skip')}
            className="w-full py-3 sm:py-4 bg-gray-100 rounded-lg sm:rounded-xl hover:bg-gray-200 transition-all text-gray-700 font-medium flex items-center justify-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Skip this round</span>
          </button>
        </>
      )}
    </div>
  );
}