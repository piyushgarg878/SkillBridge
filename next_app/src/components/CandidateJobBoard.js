'use client';
import { useEffect, useState, useRef } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { FilePlus, Send, CheckCircle, X, User, Briefcase, BadgeCheck, BarChart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function CandidateJobBoard({ userId }) {
  const [candidate, setCandidate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [showApply, setShowApply] = useState(false);
  const [applyJob, setApplyJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef();
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      fetch(`/api/onboard/status?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.onboarded) {
            fetch(`/api/candidate?userId=${userId}`)
              .then(res => res.json())
              .then(data => setCandidate(data.candidate));
          }
        });
    }
  }, [userId]);

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => setJobs(data.jobs));
  }, []);

  useEffect(() => {
    if (candidate?.id) {
      fetch(`/api/applications?candidateId=${candidate.id}`)
        .then(res => res.json())
        .then(data => setAppliedJobs(data.applications.map(app => app.jobId)));
    }
  }, [candidate]);

  const openApplyDialog = (job) => {
    setApplyJob(job);
    setResume(null);
    setCoverLetter('');
    setShowApply(true);
    setError('');
  };

  const handleResumeChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let resumeUrl = '';
      if (resume) {
        const fileExt = resume.name.split('.').pop();
        // Use userId as the file name
        const fileName = `${userId}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(fileName, resume, { upsert: true });
        console.log('Supabase uploadData:', uploadData, 'uploadError:', uploadError);
        if (uploadError) {
          setError('Resume upload failed');
          setLoading(false);
          toast.error('Resume upload failed');
          return;
        }
        const { data: publicUrlData } = supabase.storage.from('resumes').getPublicUrl(fileName);
        resumeUrl = publicUrlData.publicUrl;
      } else {
        setError('Resume is required');
        setLoading(false);
        return;
      }
      // Submit application
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId: candidate.id, jobId: applyJob.id, resumeUrl, coverLetter })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        toast.error(data.error || 'Something went wrong');
      } else {
        setAppliedJobs([...appliedJobs, applyJob.id]);
        setShowApply(false);
        toast.success('Application submitted!');
      }
    } catch (err) {
      setError('Server error');
      toast.error('Server error');
    } finally {
      setLoading(false);
    }
  };

  if (!userId) return <div className="p-8 text-center">Loading...</div>;
  if (!candidate) return <div className="p-8 text-center">You are not a candidate or onboarding incomplete.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent py-10 px-2 w-full">
      {/* Welcome message outside the main card */}
      <div className="w-full max-w-5xl text-center mb-8 mt-2">
        <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white block">Welcome{candidate?.name ? `, ${candidate.name}` : ''}!</span>
        <span className="block text-lg text-gray-500 dark:text-gray-300 mt-2">Browse and apply to jobs below.</span>
      </div>
      <Card className="w-full max-w-5xl shadow-xl border border-green-200 dark:border-gray-700 p-0 bg-white dark:bg-gray-800">
        <CardHeader className="flex flex-col items-center gap-2 pb-2">
          <div className="flex items-center gap-3">
            <User className="w-10 h-10 text-green-600" />
            <CardTitle className="text-3xl font-bold">Candidate Dashboard</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-semibold mb-8 mt-2">Available Jobs</h2>
          <div className="rounded-xl shadow bg-white dark:bg-gray-900 p-6">
            {jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <BadgeCheck className="w-16 h-16 text-green-200 mb-4" />
                <div className="text-gray-400 text-lg">No jobs available at the moment. Check back soon!</div>
              </div>
            ) : (
              <ul className="grid gap-8 md:grid-cols-2">
                {jobs.map(job => (
                  <Card key={job.id} className="border rounded-lg shadow hover:shadow-lg transition-shadow p-0 bg-white dark:bg-gray-900">
                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                      <div className="flex flex-col gap-1">
                        <CardTitle className="font-bold text-lg truncate">{job.jobName}</CardTitle>
                        <span className="text-xs text-blue-600 bg-blue-50 dark:bg-gray-800 dark:text-blue-300 rounded px-2 py-1 w-fit mt-1">Open</span>
                      </div>
                      <div className="flex gap-2 mt-1 flex-nowrap">
                        <button className="bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded flex items-center gap-1" onClick={() => handleApply(job.id)} disabled={appliedJobs.includes(job.id)} title="Apply">
                          <Send className="w-4 h-4" /> Apply
                        </button>
                        <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded flex items-center gap-1" onClick={() => router.push(`/dashboard/${job.id}`)} title="View Summary">
                          <BarChart className="w-4 h-4" /> Summary
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-gray-700 font-medium mb-1">Role: <span className="font-normal">{job.jobRole}</span></div>
                      <div className="text-gray-700 font-medium mb-1">Location: <span className="font-normal">{job.location || 'N/A'}</span></div>
                      <div className="text-gray-700 font-medium mb-1">Salary: <span className="font-normal">{job.salary || 'N/A'}</span></div>
                      <div className="text-gray-600 mt-2 text-sm line-clamp-3">{job.jobDescription}</div>
                      <div className="text-gray-600 mt-2 text-sm line-clamp-2">Requirements: {job.requirements}</div>
                      <div className="text-xs text-gray-400 mt-2">Posted: {new Date(job.createdAt).toLocaleDateString()}</div>
                    </CardContent>
                  </Card>
                ))}
              </ul>
            )}
          </div>
          <Dialog open={showApply} onOpenChange={setShowApply}>
            <DialogContent className="p-0 max-w-lg">
              <DialogTitle className="sr-only">Apply for Job</DialogTitle>
              <Card className="shadow-lg border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle>Apply for {applyJob?.jobName}</CardTitle>
                  <button onClick={() => setShowApply(false)} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={handleApply}>
                    <div>
                      <label className="block text-sm font-medium mb-1">Resume (PDF)</label>
                      <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleResumeChange} className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-green-500 bg-green-50" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Cover Letter</label>
                      <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} placeholder="Cover Letter" className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-green-500 bg-green-50" />
                    </div>
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    <div className="flex gap-2 justify-end mt-2">
                      <button type="button" className="bg-gray-300 text-gray-700 px-4 py-2 rounded" onClick={() => setShowApply(false)}>Cancel</button>
                      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2" disabled={loading}>
                        {loading && <span className="animate-spin mr-1 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>}
                        Apply <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
} 