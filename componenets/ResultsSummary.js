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
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Voting Results</h2>
      
      <div className="mb-6">
        <h3 className="font-bold mb-2">Summary</h3>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-gray-100 p-3 rounded">
            <p className="text-sm text-gray-500">Total Votes</p>
            <p className="text-xl font-bold">{votes.length}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded">
            <p className="text-sm text-gray-500">Average</p>
            <p className="text-xl font-bold">{stats.average}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded">
            <p className="text-sm text-gray-500">Median</p>
            <p className="text-xl font-bold">{stats.median}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded">
            <p className="text-sm text-gray-500">Skipped</p>
            <p className="text-xl font-bold">{skipped}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-100 p-3 rounded">
            <p className="text-sm text-gray-500">Lowest Vote</p>
            <p className="text-xl font-bold">{stats.min || 'N/A'}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded">
            <p className="text-sm text-gray-500">Highest Vote</p>
            <p className="text-xl font-bold">{stats.max || 'N/A'}</p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="font-bold mb-2">Vote Distribution</h3>
        <div className="space-y-2">
          {stats.distribution.map((count, index) => (
            <div key={index} className="flex items-center">
              <span className="w-8 text-center">{index + 1}</span>
              <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500"
                  style={{ 
                    width: `${votes.length ? (count / votes.length) * 100 : 0}%` 
                  }}
                />
              </div>
              <span className="w-8 text-center">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
