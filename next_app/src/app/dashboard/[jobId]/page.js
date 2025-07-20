'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { ExternalLink } from 'lucide-react';
import { Briefcase, Users, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function JobSummaryPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mlResults, setMlResults] = useState({});

  useEffect(() => {
    if (!jobId) return;
    setLoading(true);
    fetch('/api/jobs')
      .then(res => res.json())
      .then(({ jobs }) => {
        const found = jobs.find(j => j.id === jobId);
        setJob(found || null);
      });
  }, [jobId]);

  useEffect(() => {
    if (!job) return;
    fetch(`/api/jobs/${job.id}/applicants`)
      .then(res => res.json())
      .then(data => {
        setApplications(data.applicants || []);
        setLoading(false);
      });
  }, [job]);

  const fetchSummaryAndScore = async (appId, resumeUrl, jobDescription) => {
    setMlResults(prev => ({ ...prev, [appId]: { loading: true } }));
    try {
      const res = await fetch('/api/ml/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeUrl, jobDescription }),
      });
      if (!res.ok) {
        throw new Error('ML API error');
      }
      const result = await res.json();
      setMlResults(prev => ({ ...prev, [appId]: result }));
    } catch (e) {
      toast.error('ML analysis failed');
      setMlResults(prev => ({ ...prev, [appId]: { error: true } }));
    }
  };

  if (!job || loading) return <div className="p-8 text-center">Loading job...</div>;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-gray-900 text-white flex flex-col gap-8 p-8 md:min-h-screen shadow-xl">
        <Link href="/dashboard" className="flex items-center gap-2 text-blue-300 hover:text-white mb-8">
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </Link>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Briefcase className="w-7 h-7 text-blue-400" />
            <span className="text-xl font-bold">{job.jobName}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <FileText className="w-5 h-5" />
            <span className="truncate">{job.jobDescription?.slice(0, 40) || 'No description'}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <Users className="w-5 h-5" />
            <span>{applications.length} Applicants</span>
          </div>
        </div>
        <div className="mt-auto text-xs text-gray-500">Job ID: {job.id}</div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start py-12 px-2 md:px-12 min-h-screen">
        <Card className="w-full max-w-3xl shadow-xl border-2 border-blue-100 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-7 h-7 text-blue-500" /> Application Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-gray-500 text-center py-8">No applications yet.</div>
            ) : (
              <ul className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                {applications.map(app => (
                  <Card key={app.id} className="border rounded p-4 flex flex-col gap-2 bg-gray-50 dark:bg-gray-800">
                    <div className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-400" />
                      {app.candidate?.name || 'Unknown'} <span className="text-xs text-gray-400 ml-2">({app.candidate?.user?.email || 'No email'})</span>
                    </div>
                    <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                      <ExternalLink className="w-4 h-4" /> View Resume
                    </a>
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded w-fit mt-2"
                      onClick={() => fetchSummaryAndScore(app.id, app.resumeUrl, job.jobDescription)}
                      disabled={mlResults[app.id]?.loading}
                    >
                      {mlResults[app.id]?.loading ? 'Analyzing...' : 'Get Summary & Match Score'}
                    </button>
                    {mlResults[app.id]?.summary && (
                      <div className="mt-2 bg-white dark:bg-gray-900 rounded p-3 border">
                        <div className="font-bold mb-1">Summary:</div>
                        <div className="text-sm text-gray-700 dark:text-gray-200">{mlResults[app.id].summary}</div>
                        <div className="font-bold mt-2">Match Score: <span className="text-green-600">{mlResults[app.id].score}</span></div>
                      </div>
                    )}
                    {mlResults[app.id]?.error && (
                      <div className="text-red-500 text-sm mt-2">ML analysis failed.</div>
                    )}
                    <a
                      href={`mailto:${app.candidate?.user?.email}?subject=Regarding your job application`}
                      className="bg-green-600 text-white px-3 py-1 rounded w-fit mt-2 inline-block"
                    >
                      Send Email
                    </a>
                  </Card>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
} 