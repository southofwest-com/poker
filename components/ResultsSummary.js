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
    
    // Calculate median
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
    
    // Calculate distribution
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
      'bg-blue-100', 'bg-blue-200', 'bg-blue-300', 'bg-blue-400', 'bg-blue-500',
      'bg-blue-500', 'bg-blue-600', 'bg-blue-700', 'bg-blue-800', 'bg-blue-900'
    ];
    return colors[index];
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-blue-700 border-b border-gray-200 pb-3">Voting Results</h2>
      
      <div className="mb-8">
        <h3 className="font-bold mb-4 text-lg text-gray-700">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-600 font-medium mb-1">Total Votes</p>
            <p className="text-2xl font-bold text-gray-800">{votes.length}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-600 font-medium mb-1">Average</p>
            <p className="text-2xl font-bold text-gray-800">{stats.average}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-600 font-medium mb-1">Median</p>
            <p className="text-2xl font-bold text-gray-800">{stats.median}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-600 font-medium mb-1">Skipped</p>
            <p className="text-2xl font-bold text-gray-800">{skipped}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-600 font-medium mb-1">Lowest Vote</p>
            <p className="text-2xl font-bold text-gray-800">{stats.min || 'N/A'}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-600 font-medium mb-1">Highest Vote</p>
            <p className="text-2xl font-bold text-gray-800">{stats.max || 'N/A'}</p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="font-bold mb-4 text-lg text-gray-700 border-t border-gray-200 pt-4">Vote Distribution</h3>
        <div className="space-y-3">
          {stats.distribution.map((count, index) => {
            const percentage = votes.length ? (count / votes.length) * 100 : 0;
            return (
              <div key={index} className="flex items-center">
                <span className="w-8 text-center font-medium text-gray-700">{index + 1}</span>
                <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden mx-2">
                  <div 
                    className={`h-full ${getDistributionColor(index)} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-12 text-center font-medium">
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