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
        totalVotes: 0,
        totalParticipants: 0,
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
        totalVotes: 0,
        totalParticipants: skipped,
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
      median: median.toFixed(1),
      distribution,
      totalVotes: numericVotes.length,
      totalParticipants: numericVotes.length + skipped,
    };
  }, [votes, skipped]);

  const maxDistributionCount = Math.max(...stats.distribution);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Simple Header */}
      <div className="bg-indigo-600 text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-bold">Voting Results</h2>
        <p className="text-indigo-100 text-sm mt-1">Complete analysis of the voting round</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Summary Statistics Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Summary Statistics</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metric
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    Total Participants
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-semibold">
                    {stats.totalParticipants}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    All users who joined the voting session
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    Votes Cast
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 font-semibold">
                    {stats.totalVotes}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    Number of numeric votes submitted
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    Votes Skipped
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-orange-600 font-semibold">
                    {skipped}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    Participants who chose to skip voting
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    Participation Rate
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600 font-semibold">
                    {stats.totalParticipants ? ((stats.totalVotes / stats.totalParticipants) * 100).toFixed(1) : 0}%
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    Percentage of participants who voted
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    Average Score
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-purple-600 font-semibold">
                    {stats.average}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    Mean of all numeric votes
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    Median Score
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-purple-600 font-semibold">
                    {stats.median}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    Middle value when votes are sorted
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    Lowest Score
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600 font-semibold">
                    {stats.min || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    Minimum vote received
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    Highest Score
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 font-semibold">
                    {stats.max || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    Maximum vote received
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    Score Range
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-indigo-600 font-semibold">
                    {stats.max - stats.min || 0}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    Difference between highest and lowest
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    Most Common Score
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-indigo-600 font-semibold">
                    {stats.distribution.indexOf(Math.max(...stats.distribution)) + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    Score that received the most votes
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Vote Distribution Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Vote Distribution</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vote Count
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visual
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.distribution.map((count, index) => {
                  const percentage = stats.totalVotes ? (count / stats.totalVotes) * 100 : 0;
                  const barWidth = maxDistributionCount ? (count / maxDistributionCount) * 100 : 0;
                  
                  return (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {count}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {percentage.toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-24 h-4 bg-gray-200 rounded-sm overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                index < 3 ? 'bg-red-400' :
                                index < 6 ? 'bg-yellow-400' :
                                'bg-green-400'
                              }`}
                              style={{ width: `${barWidth}%` }}
                            ></div>
                          </div>
                          {count > 0 && (
                            <span className="ml-2 text-xs text-gray-600">
                              {count} {count === 1 ? 'vote' : 'votes'}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}