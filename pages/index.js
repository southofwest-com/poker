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
      
      <div className="container-center bg-gradient-to-b from-blue-50 to-gray-100">
        <LoginForm />
      </div>
    </>
  );
}