'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import RecruiterJobBoard from '@/components/RecruiterJobBoard';
import CandidateJobBoard from '@/components/CandidateJobBoard';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [role, setRole] = useState(null); // 'recruiter' | 'candidate' | null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkRole = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    console.log('[Dashboard] Checking role for userId:', userId);

    try {
      const [recruiterRes, candidateRes] = await Promise.all([
        fetch(`/api/recruiter?userId=${userId}`).then(res => res.json()),
        fetch(`/api/candidate?userId=${userId}`).then(res => res.json()),
      ]);

      console.log('[Dashboard] API Responses:', { recruiterRes, candidateRes });

      if (recruiterRes.recruiter) {
        console.log('[Dashboard] User is recruiter');
        setRole('recruiter');
      } else if (candidateRes.candidate) {
        console.log('[Dashboard] User is candidate');
        setRole('candidate');
      } else {
        console.warn('[Dashboard] User has no role found');
        setRole(null);
      }
    } catch (err) {
      console.error('[Dashboard] Error checking role:', err);
      setError('Failed to fetch user role');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      checkRole();
    } else if (status !== 'loading') {
      setLoading(false);
    }
  }, [userId, status, checkRole]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Not Signed In</h2>
          <p className="text-gray-500">Please sign in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  if (role === 'recruiter') return <RecruiterJobBoard userId={userId} />;
  if (role === 'candidate') return <CandidateJobBoard userId={userId} />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Onboarding Incomplete</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          We couldn't find your profile information. This might be a temporary issue.
        </p>

        <div className="bg-gray-100 dark:bg-gray-900 rounded p-3 mb-6 text-xs font-mono text-left overflow-auto">
          <p>User ID: {userId}</p>
          <p>Status: {status}</p>
          {error && <p className="text-red-500">Error: {error}</p>}
        </div>

        <div className="flex gap-3 justify-center">
          <Button
            onClick={checkRole}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
          <Button
            onClick={() => window.location.href = '/onboard'}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Go to Onboarding
          </Button>
        </div>
      </div>
    </div>
  );
}