import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import LoginForm from '../components/LoginForm';
import useVotingStore from '../lib/useVotingStore';

export default function Home() {
  const router = useRouter();
  const { sessionId } = useVotingStore();
  
  useEffect(() => {
    if (sessionId) {
      router.push(`/vote/${sessionId}`);
    }
  }, [sessionId, router]);
  
  return (
    <>
      <Head>
        <title>Anonymous Voting Tool</title>
        <meta name="description" content="Anonymous voting tool for teams" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <LoginForm />
          
          <div className="mt-8 text-center text-gray-600">
            <p className="text-sm">Simple, anonymous voting for teams and groups</p>
            <p className="text-xs mt-4">© 2025 Anonymous Voting Tool</p>
          </div>
        </div>
      </div>
    </>
  );
}