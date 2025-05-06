import { useMemo } from 'react';

export default function ResultsSummary({ results }) {
  const { votes, skipped } = results;
  
  const stats = useMemo(() => {
    if (!votes || votes.length === 0) {
      return {
        average: 0,
        min: 0,
        max: 0,
        median: 0,
        distribution: Array(10).fill(0),
      };
    }
    
    const numericVotes = votes.filter(v => typeof v === 'number');
    
    if (numericVotes.length === 0) {
      return {
        average: 0,
        min: 0,
        max: 0,
        median: 0,
        distribution: Array(10).fill(0),
      };
    }
    
    const sorted = [...numericVotes].sort((a, b) => a - b);
    const sum = sorted.reduce((acc, val) => acc + val, 0);
    
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
    
    const distribution = Array(10).fill(0);
    for (const vote of numericVotes) {
      distribution[vote - 1]++;
    }
    
    return {
      average: (sum / numericVotes.length).toFixed(1),
      min: sorted[0],
      max: sorted[sorted.length - 1],
      median,
      distribution,
    };
  }, [votes]);

  // Helper function to get background color based on vote value
  const getDistributionColor = (index) => {
    // Color gradient from light blue to dark blue
    const colors = [
      'bg-indigo-100', 'bg-indigo-200', 'bg-indigo-300', 'bg-indigo-400', 'bg-indigo-500',
      'bg-indigo-500', 'bg-indigo-600', 'bg-indigo-700', 'bg-indigo-800', 'bg-indigo-900'
    ];
    return colors[index];
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 border border-gray-100">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-indigo-700 border-b border-gray-200 pb-3 sm:pb-4">Voting Results</h2>
      
      <div className="mb-8 sm:mb-10">
        <h3 className="font-bold mb-4 sm:mb-6 text-base sm:text-lg text-gray-700">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-indigo-50 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-indigo-100 transform transition-all duration-200 hover:scale-105">
            <p className="text-xs sm:text-sm text-indigo-600 font-medium mb-1 sm:mb-2">Total Votes</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">{votes.length}</p>
          </div>
          <div className="bg-indigo-50 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-indigo-100 transform transition-all duration-200 hover:scale-105">
            <p className="text-xs sm:text-sm text-indigo-600 font-medium mb-1 sm:mb-2">Average</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.average}</p>
          </div>
          <div className="bg-indigo-50 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-indigo-100 transform transition-all duration-200 hover:scale-105">
            <p className="text-xs sm:text-sm text-indigo-600 font-medium mb-1 sm:mb-2">Median</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.median}</p>
          </div>
          <div className="bg-indigo-50 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-indigo-100 transform transition-all duration-200 hover:scale-105">
            <p className="text-xs sm:text-sm text-indigo-600 font-medium mb-1 sm:mb-2">Skipped</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">{skipped}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 sm:gap-6">
          <div className="bg-indigo-50 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-indigo-100 transform transition-all duration-200 hover:scale-105">
            <p className="text-xs sm:text-sm text-indigo-600 font-medium mb-1 sm:mb-2">Lowest Vote</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.min || 'N/A'}</p>
          </div>
          <div className="bg-indigo-50 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-indigo-100 transform transition-all duration-200 hover:scale-105">
            <p className="text-xs sm:text-sm text-indigo-600 font-medium mb-1 sm:mb-2">Highest Vote</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.max || 'N/A'}</p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="font-bold mb-4 sm:mb-6 text-base sm:text-lg text-gray-700 border-t border-gray-200 pt-4 sm:pt-6">Vote Distribution</h3>
        <div className="space-y-3 sm:space-y-4">
          {stats.distribution.map((count, index) => {
            const percentage = votes.length ? (count / votes.length) * 100 : 0;
            return (
              <div key={index} className="flex items-center group">
                <span className="w-6 sm:w-8 text-center text-sm sm:text-base font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">{index + 1}</span>
                <div className="flex-1 h-6 sm:h-8 bg-gray-100 rounded-lg overflow-hidden mx-2 sm:mx-3">
                  <div 
                    className={`h-full ${getDistributionColor(index)} transition-all duration-500 ease-out`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-14 sm:w-16 text-center text-sm sm:text-base font-medium group-hover:text-indigo-600 transition-colors">
                  {count} <span className="text-xs text-gray-500">({percentage.toFixed(0)}%)</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}