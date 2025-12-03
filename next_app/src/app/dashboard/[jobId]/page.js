'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { ExternalLink, Mail, BarChart3, Clock, CheckCircle, AlertCircle } from 'lucide-react';
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

  if (!job || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      {/* Sidebar */}
      <aside className="w-full lg:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="p-6">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> 
            Back to Dashboard
          </Link>
          
          <div className="space-y-6">
            {/* Job Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{job.jobName}</h2>
                  <p className="text-blue-100 text-sm">Job Details</p>
                </div>
              </div>
            </div>

            {/* Job Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <FileText className="w-5 h-5 text-gray-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Description</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {job.jobDescription?.slice(0, 60) || 'No description available'}...
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Users className="w-5 h-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Applicants</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{applications.length}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Clock className="w-5 h-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Status</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">Job ID: {job.id}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Application Summary
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Review and analyze applications for <span className="font-semibold text-blue-600">{job.jobName}</span>
            </p>
          </div>

          {/* Applications List */}
          {applications.length === 0 ? (
            <Card className="text-center py-16 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">No Applications Yet</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Applications will appear here once candidates start applying for this position.
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              {applications.map((app, index) => (
                <Card key={app.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    {/* Applicant Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          {app.candidate?.name?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {app.candidate?.name || 'Unknown Candidate'}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {app.candidate?.user?.email || 'No email available'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          <Clock className="w-3 h-3 mr-1" />
                          New
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 mb-4">
                      <a 
                        href={app.resumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" /> 
                        View Resume
                      </a>
                      
                      <button
                        onClick={() => fetchSummaryAndScore(app.id, app.resumeUrl, job.jobDescription)}
                        disabled={mlResults[app.id]?.loading}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
                      >
                        <BarChart3 className="w-4 h-4" />
                        {mlResults[app.id]?.loading ? 'Analyzing...' : 'Get Summary & Score'}
                      </button>
                      
                      <a
                        href={`mailto:${app.candidate?.user?.email}?subject=Regarding your application for ${job.jobName}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        Send Email
                      </a>
                    </div>

                    {/* ML Results */}
                    {mlResults[app.id]?.summary && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2 mb-3">
                          <BarChart3 className="w-5 h-5 text-blue-600" />
                          <h4 className="font-semibold text-gray-900 dark:text-white">AI Analysis Results</h4>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Summary:</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 rounded p-3 border">
                              {mlResults[app.id].summary}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Match Score:</span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              {mlResults[app.id].score}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {mlResults[app.id]?.error && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span className="text-sm text-red-700 dark:text-red-400">ML analysis failed. Please try again.</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 