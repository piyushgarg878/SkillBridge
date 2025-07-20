'use client';
import { useEffect, useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus, X, Users, ExternalLink, BarChart, Briefcase, BadgeCheck, MoreVertical } from 'lucide-react';
import ApplicationSummaryDialog from './ApplicationSummaryDialog';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

function VisuallyHidden({ children }) {
  return <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>{children}</span>;
}

function ApplicantListDialog({ open, onOpenChange, jobId }) {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && jobId) {
      setLoading(true);
      fetch(`/api/jobs/${jobId}/applicants`)
        .then(res => res.json())
        .then(data => {
          setApplicants(data.applicants || []);
          setLoading(false);
        });
    }
  }, [open, jobId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogTitle>Applicants</DialogTitle>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : applicants.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No applicants yet.</div>
        ) : (
          <ul className="space-y-4">
            {applicants.map(app => (
              <Card key={app.id} className="border rounded p-4 flex flex-col gap-2">
                <div className="font-semibold">{app.candidate?.name || 'Unknown'}</div>
                <div className="text-sm text-gray-600">{app.candidate?.user?.email || 'No email'}</div>
                <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                  <ExternalLink className="w-4 h-4" /> View Resume
                </a>
                {app.coverLetter && <div className="text-xs text-gray-500 mt-2">Cover Letter: {app.coverLetter}</div>}
              </Card>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function RecruiterJobBoard({ userId }) {
  const [recruiter, setRecruiter] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ jobName: '', jobRole: '', jobDescription: '', requirements: '', location: '', salary: '' });
  const [editJobId, setEditJobId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showApplicants, setShowApplicants] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      fetch(`/api/onboard/status?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.onboarded) {
            fetch(`/api/recruiter?userId=${userId}`)
              .then(res => res.json())
              .then(data => setRecruiter(data.recruiter));
          }
        });
    }
  }, [userId]);

  useEffect(() => {
    if (recruiter?.id) {
      fetch('/api/jobs')
        .then(res => res.json())
        .then(data => {
          setJobs(data.jobs.filter(job => job.recruiterId === recruiter.id));
        });
    }
  }, [recruiter]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openCreateForm = () => {
    setForm({ jobName: '', jobRole: '', jobDescription: '', requirements: '', location: '', salary: '' });
    setEditJobId(null);
    setShowForm(true);
  };

  const openEditForm = (job) => {
    setForm({
      jobName: job.jobName,
      jobRole: job.jobRole,
      jobDescription: job.jobDescription,
      requirements: job.requirements,
      location: job.location || '',
      salary: job.salary || '',
    });
    setEditJobId(job.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let res, data;
      if (editJobId) {
        res = await fetch(`/api/jobs/${editJobId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recruiterId: recruiter.id, ...form })
        });
        data = await res.json();
      } else {
        res = await fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recruiterId: recruiter.id, ...form })
        });
        data = await res.json();
      }
      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        toast.error(data.error || 'Something went wrong');
      } else {
        if (editJobId) {
          setJobs(jobs.map(j => j.id === editJobId ? data.job : j));
          toast.success('Job updated successfully!');
        } else {
          setJobs([data.job, ...jobs]);
          toast.success('Job created successfully!');
        }
        setShowForm(false);
        setEditJobId(null);
        setForm({ jobName: '', jobRole: '', jobDescription: '', requirements: '', location: '', salary: '' });
      }
    } catch (err) {
      setError('Server error');
      toast.error('Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
      if (res.ok) {
        setJobs(jobs.filter(j => j.id !== jobId));
        toast.success('Job deleted successfully!');
      } else {
        toast.error('Failed to delete job');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!userId) return <div className="p-8 text-center">Loading...</div>;
  if (!recruiter) return <div className="p-8 text-center">You are not a recruiter or onboarding incomplete.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent py-10 px-2 w-full">
      {/* Welcome message outside the main card */}
      <div className="w-full max-w-5xl text-center mb-8 mt-2">
        <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white block">Welcome{recruiter?.name ? `, ${recruiter.name}` : ''}!</span>
        <span className="block text-lg text-gray-500 dark:text-gray-300 mt-2">Manage your jobs and applicants below.</span>
      </div>
      <Card className="w-full max-w-5xl shadow-xl border border-blue-200 dark:border-gray-700 p-0 bg-white dark:bg-gray-800">
        <CardHeader className="flex flex-col items-center gap-2 pb-2">
          
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-8 mt-2">
            <h2 className="text-2xl font-semibold">Your Jobs</h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow flex items-center gap-2" onClick={openCreateForm}>
              <Plus className="w-5 h-5" /> Create Job
            </button>
          </div>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogContent className="p-0 max-w-lg">
              {/* DialogTitle must be a direct child for accessibility */}
              <DialogTitle className="sr-only">{editJobId ? 'Edit Job' : 'Create Job'}</DialogTitle>
              <Card className="shadow-lg border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle>{editJobId ? 'Edit Job' : 'Create Job'}</CardTitle>
                  <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-sm font-medium mb-1">Job Name</label>
                      <input name="jobName" value={form.jobName} onChange={handleChange} placeholder="Job Name" className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 bg-blue-50" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Job Role</label>
                      <input name="jobRole" value={form.jobRole} onChange={handleChange} placeholder="Job Role" className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 bg-blue-50" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Job Description</label>
                      <textarea name="jobDescription" value={form.jobDescription} onChange={handleChange} placeholder="Job Description" className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 bg-blue-50" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Requirements</label>
                      <textarea name="requirements" value={form.requirements} onChange={handleChange} placeholder="Requirements" className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 bg-blue-50" required />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 bg-blue-50" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">Salary</label>
                        <input name="salary" value={form.salary} onChange={handleChange} placeholder="Salary" className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 bg-blue-50" />
                      </div>
                    </div>
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    <div className="flex gap-2 justify-end mt-2">
                      <button type="button" className="bg-gray-300 text-gray-700 px-4 py-2 rounded" onClick={() => setShowForm(false)}>Cancel</button>
                      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2" disabled={loading}>
                        {loading && <span className="animate-spin mr-1 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>}
                        {editJobId ? 'Save' : 'Create Job'}
                      </button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </DialogContent>
          </Dialog>
          <div className="rounded-xl shadow bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-800 dark:to-gray-900 p-8">
            {jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <BadgeCheck className="w-16 h-16 text-blue-200 mb-4" />
                <div className="text-gray-400 text-lg">No jobs created yet. Click "Create Job" to get started!</div>
              </div>
            ) : (
              <ul className="grid gap-8 md:grid-cols-2">
                {jobs.map(job => (
                  <Card key={job.id} className="border rounded-lg shadow hover:shadow-lg transition-shadow p-5 bg-white dark:bg-gray-900">
                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                      <div className="flex flex-col gap-1">
                        <CardTitle className="font-bold text-lg truncate">{job.jobName}</CardTitle>
                        <span className="text-xs text-blue-600 bg-blue-50 dark:bg-gray-800 dark:text-blue-300 rounded px-2 py-1 w-fit mt-1">Open</span>
                      </div>
                      <div className="flex gap-2 mt-1 flex-nowrap">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" title="More actions">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditForm(job)}>
                              <Pencil className="w-4 h-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(job.id)} disabled={loading}>
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setSelectedJobId(job.id); setShowApplicants(true); }}>
                              <Users className="w-4 h-4 mr-2" /> Applicants
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/${job.id}`)}>
                              <BarChart className="w-4 h-4 mr-2" /> Summary
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-gray-800 dark:text-gray-200 font-medium mb-1">Role: <span className="font-normal">{job.jobRole}</span></div>
                      <div className="text-gray-800 dark:text-gray-200 font-medium mb-1">Location: <span className="font-normal">{job.location || 'N/A'}</span></div>
                      <div className="text-gray-800 dark:text-gray-200 font-medium mb-1">Salary: <span className="font-normal">{job.salary || 'N/A'}</span></div>
                      <div className="text-gray-700 dark:text-gray-300 mt-2 text-sm line-clamp-3">{job.jobDescription}</div>
                      <div className="text-gray-700 dark:text-gray-300 mt-2 text-sm line-clamp-2">Requirements: {job.requirements}</div>
                      <div className="text-xs text-gray-400 mt-2">Posted: {new Date(job.createdAt).toLocaleDateString()}</div>
                    </CardContent>
                  </Card>
                ))}
              </ul>
            )}
          </div>
          <ApplicantListDialog open={showApplicants} onOpenChange={setShowApplicants} jobId={selectedJobId} />
        </CardContent>
      </Card>
    </div>
  );
} 