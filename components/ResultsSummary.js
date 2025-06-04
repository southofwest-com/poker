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
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-xl">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Voting Results
        </h2>
        <p className="text-indigo-100 mt-2">Complete analysis of the voting round</p>
      </div>

      <div className="p-6 space-y-8">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Votes</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalVotes}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Average</p>
                <p className="text-2xl font-bold text-green-900">{stats.average}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Median</p>
                <p className="text-2xl font-bold text-purple-900">{stats.median}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Skipped</p>
                <p className="text-2xl font-bold text-orange-900">{skipped}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Range Information */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Vote Range
          </h3>
          <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Lowest</p>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mt-2">
                <span className="text-xl font-bold text-red-700">{stats.min || 'N/A'}</span>
              </div>
            </div>
            
            <div className="flex-1 mx-8">
              <div className="relative">
                <div className="h-2 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-indigo-600 rounded-full border-2 border-white shadow-lg"></div>
                </div>
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">Range: {stats.min} - {stats.max}</p>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Highest</p>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mt-2">
                <span className="text-xl font-bold text-green-700">{stats.max || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vote Distribution Chart */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Vote Distribution
          </h3>
          
          <div className="space-y-3">
            {stats.distribution.map((count, index) => {
              const percentage = stats.totalVotes ? (count / stats.totalVotes) * 100 : 0;
              const barWidth = maxDistributionCount ? (count / maxDistributionCount) * 100 : 0;
              
              return (
                <div key={index} className="group">
                  <div className="flex items-center mb-1">
                    <span className="w-8 text-sm font-semibold text-gray-700">{index + 1}</span>
                    <div className="flex-1 mx-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>{count} votes</span>
                        <span>{percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="w-8"></span>
                    <div className="flex-1 mx-3">
                      <div className="h-8 bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ease-out flex items-center justify-end pr-2 ${
                            index < 3 ? 'bg-gradient-to-r from-red-400 to-red-500' :
                            index < 6 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                            'bg-gradient-to-r from-green-400 to-green-500'
                          }`}
                          style={{ width: `${barWidth}%` }}
                        >
                          {count > 0 && (
                            <span className="text-white text-xs font-bold">
                              {count}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m9-6a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Statistical Summary
            </h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Total Participants:</span>
                  <span className="font-bold text-gray-900">{stats.totalParticipants}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Votes Cast:</span>
                  <span className="font-bold text-green-600">{stats.totalVotes}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Votes Skipped:</span>
                  <span className="font-bold text-orange-600">{skipped}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Participation Rate:</span>
                  <span className="font-bold text-blue-600">
                    {stats.totalParticipants ? ((stats.totalVotes / stats.totalParticipants) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Score Range:</span>
                  <span className="font-bold text-purple-600">{stats.max - stats.min || 0}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Most Common:</span>
                  <span className="font-bold text-indigo-600">
                    {stats.distribution.indexOf(Math.max(...stats.distribution)) + 1}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}