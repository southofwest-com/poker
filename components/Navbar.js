import { useRouter } from 'next/router';
import Link from 'next/link';
import useVotingStore from '../lib/useVotingStore';

export default function Navbar() {
  const router = useRouter();
  const { sessionId, username, isAdmin, leaveSession, closeSession } = useVotingStore();

  const handleExit = () => {
    if (isAdmin) {
      if (confirm('Are you sure you want to close this session for all participants?')) {
        closeSession();
        router.push('/');
      }
    } else {
      if (confirm('Are you sure you want to leave this session?')) {
        leaveSession();
        router.push('/');
      }
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <span className="flex items-center cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-900">VoteSync</span>
              </span>
            </Link>
          </div>

          {sessionId && (
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-1">
                <span className="text-gray-500 text-sm">Session:</span>
                <span className="font-medium text-primary-700">{sessionId}</span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-gray-500 text-sm">Logged in as:</span>
                <span className="font-medium text-primary-700">{username}</span>
                {isAdmin && (
                  <span className="ml-1 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">Admin</span>
                )}
              </div>

              <button
                onClick={handleExit}
                className="inline-flex items-center px-3 py-1 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors duration-150"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {isAdmin ? 'Close Session' : 'Leave'}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}