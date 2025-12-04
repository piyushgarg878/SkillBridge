'use client';
import { useEffect, useState, useRef } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FilePlus, Send, CheckCircle, X, User, Briefcase, BadgeCheck, BarChart, MapPin, DollarSign, Clock, Search, Filter, UploadCloud } from 'lucide-react';
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
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      e.target.value = null;
      setResume(null);
      return;
    }
    setResume(file);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let resumeUrl = '';
      if (resume) {
        const formData = new FormData();
        formData.append('file', resume);
        formData.append('userId', userId);

        const uploadRes = await fetch('/api/upload/resume', {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          const errorMessage = uploadData.error || 'Resume upload failed';
          console.error('Upload API Error:', errorMessage);
          setError(errorMessage);
          setLoading(false);
          toast.error(errorMessage);
          return;
        }

        resumeUrl = uploadData.url;
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
      console.error('Application error:', err);
      setError('Server error');
      toast.error('Server error');
    } finally {
      setLoading(false);
    }
  };

  if (!userId) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    </div>
  );

  if (!candidate) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Profile Not Found</h2>
        <p className="text-gray-500 mb-4">Please complete your onboarding to continue.</p>
        <Button onClick={() => router.push('/onboard')}>Go to Onboarding</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-950 text-white pb-24 pt-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                Welcome back, {candidate.name}!
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl">
                Find your next dream job. We've curated the best opportunities just for you.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <p className="text-blue-100 text-sm font-medium">Applied Jobs</p>
                <p className="text-3xl font-bold">{appliedJobs.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <p className="text-blue-100 text-sm font-medium">Available Jobs</p>
                <p className="text-3xl font-bold">{jobs.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        {/* Search & Filter (Visual Only for now) */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-8 flex flex-col md:flex-row gap-4 items-center border border-gray-100 dark:border-gray-700">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for jobs, skills, or companies..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4" /> Filters
          </Button>
        </div>

        {/* Jobs Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              Latest Opportunities
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Showing {jobs.length} jobs
            </span>
          </div>

          {jobs.length === 0 ? (
            <Card className="text-center py-16 border-dashed">
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No jobs found</h3>
                <p className="text-gray-500 dark:text-gray-400">Check back later for new opportunities.</p>
              </div>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {jobs.map(job => (
                <Card key={job.id} className="group hover:shadow-xl transition-all duration-300 border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                        {job.jobName.charAt(0)}
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        New
                      </span>
                    </div>
                    <CardTitle className="text-lg font-bold line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {job.jobName}
                    </CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{job.jobRole}</p>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-4">
                    <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {job.location || 'Remote'}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        {job.salary || 'Competitive'}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                      {job.jobDescription}
                    </p>

                    <div className="pt-2">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white mb-2">Requirements:</p>
                      <div className="flex flex-wrap gap-2">
                        {job.requirements?.split(',').slice(0, 3).map((req, i) => (
                          <span key={i} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                            {req.trim()}
                          </span>
                        ))}
                        {(job.requirements?.split(',').length || 0) > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 dark:bg-gray-800 text-gray-500">
                            +{job.requirements.split(',').length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-4 border-t border-gray-100 dark:border-gray-800 flex gap-3 bg-gray-50/50 dark:bg-gray-900/50">
                    <Button
                      onClick={() => openApplyDialog(job)}
                      disabled={appliedJobs.includes(job.id)}
                      className={`flex-1 ${appliedJobs.includes(job.id) ? 'bg-green-600 hover:bg-green-700' : ''}`}
                    >
                      {appliedJobs.includes(job.id) ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" /> Applied
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" /> Apply Now
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/dashboard/${job.id}`)}
                      className="px-3"
                      title="View Details"
                    >
                      <BarChart className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Apply Dialog */}
      <Dialog open={showApply} onOpenChange={setShowApply}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              Apply for <span className="text-blue-600">{applyJob?.jobName}</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleApply} className="space-y-6 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Resume (PDF)
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer relative"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeChange}
                    className="hidden"
                    required
                  />
                  {resume ? (
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                      <CheckCircle className="w-6 h-6" />
                      <span className="truncate max-w-[200px]">{resume.name}</span>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="w-10 h-10 text-blue-500 mb-2" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Click to upload resume</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF up to 5MB</p>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Cover Letter (Optional)
                </label>
                <textarea
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  placeholder="Tell us why you're a great fit..."
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
                <X className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="outline" onClick={() => setShowApply(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application <Send className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
