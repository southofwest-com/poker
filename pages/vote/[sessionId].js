import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminDashboard from '../../components/AdminDashboard';
import UserDashboard from '../../components/UserDashboard';
import LoginForm from '../../components/LoginForm';
import useVotingStore from '../../lib/useVotingStore';

export default function VotingSession() {
  const router = useRouter();
  const { sessionId: routeSessionId } = router.query;
  const { sessionId, isAdmin, username, initSession } = useVotingStore();
  
  useEffect(() => {
    // If we have a stored session, re-initialize it
    if (sessionId && username) {
      initSession();
    } else if (!username && routeSessionId) {
      // User has the session ID but isn't logged in
      router.push('/?join=' + routeSessionId);
    }
  }, [sessionId, username, routeSessionId, router, initSession]);
  
  return (
    <>
      <Head>
        <title>Voting Session | Anonymous Voting Tool</title>
      </Head>
      
      <div className="min-h-screen bg-gray-100">
        {!username ? (
          <div className="flex items-center justify-center min-h-screen">
            <p>Redirecting to login...</p>
          </div>
        ) : isAdmin ? (
          <AdminDashboard />
        ) : (
          <UserDashboard />
        )}
      </div>
    </>
  );
}