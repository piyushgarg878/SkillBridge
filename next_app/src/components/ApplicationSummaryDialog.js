"use client";
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { ExternalLink } from 'lucide-react';

export default function ApplicationSummaryDialog({ open, onOpenChange, job }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mlResults, setMlResults] = useState({});

  useEffect(() => {
    if (open && job?.id) {
      setLoading(true);
      fetch(`/api/jobs/${job.id}/applicants`)
        .then(res => res.json())
        .then(data => {
          setApplications(data.applicants || []);
          setLoading(false);
        });
    }
  }, [open, job]);

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogTitle>Application Summary for {job?.jobName}</DialogTitle>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No applications yet.</div>
        ) : (
          <ul className="space-y-6">
            {applications.map(app => (
              <Card key={app.id} className="border rounded p-4 flex flex-col gap-2">
                <div className="font-semibold">{app.candidate?.name || 'Unknown'} ({app.candidate?.user?.email || 'No email'})</div>
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
                  <div className="mt-2">
                    <div className="font-bold">Summary:</div>
                    <div className="text-sm">{mlResults[app.id].summary}</div>
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
      </DialogContent>
    </Dialog>
  );
} 