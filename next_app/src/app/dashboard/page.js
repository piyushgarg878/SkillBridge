'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import RecruiterJobBoard from '@/components/RecruiterJobBoard';
import CandidateJobBoard from '@/components/CandidateJobBoard';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [role, setRole] = useState(null); // 'recruiter' | 'candidate' | null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/recruiter?userId=${userId}`).then(res => res.json()),
      fetch(`/api/candidate?userId=${userId}`).then(res => res.json()),
    ]).then(([recruiterRes, candidateRes]) => {
      if (recruiterRes.recruiter) setRole('recruiter');
      else if (candidateRes.candidate) setRole('candidate');
      else setRole(null);
      setLoading(false);
    });
  }, [userId]);

  if (status === 'loading' || loading) return <div className="p-8 text-center">Loading...</div>;
  if (!userId) return <div className="p-8 text-center">You are not signed in.</div>;
  if (role === 'recruiter') return <RecruiterJobBoard userId={userId} />;
  if (role === 'candidate') return <CandidateJobBoard userId={userId} />;
  return <div className="p-8 text-center">Onboarding incomplete.</div>;
}