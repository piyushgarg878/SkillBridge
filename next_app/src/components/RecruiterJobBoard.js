'use client';
import { useEffect, useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus, X, Users, ExternalLink, BarChart, Briefcase, BadgeCheck, MoreVertical, MapPin, DollarSign, Calendar, Building2 } from 'lucide-react';
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
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome{recruiter?.name ? `, ${recruiter.name}` : ''}! 👋
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Manage your job postings and track applicants
              </p>
            </div>
            <button 
              className="btn-primary group flex items-center gap-2 px-6 py-3 text-lg shadow-strong"
              onClick={openCreateForm}
            >
              <Plus className="w-5 h-5" />
              Create New Job
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{jobs.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Jobs</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {jobs.reduce((total, job) => total + (job.applications?.length || 0), 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Applications</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {jobs.filter(job => job.status === 'open').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Jobs</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {jobs.filter(job => new Date(job.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">This Week</div>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Job Postings</h2>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {jobs.length} job{jobs.length !== 1 ? 's' : ''} posted
            </div>
          </div>

          {jobs.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-16 text-center shadow-soft border border-gray-100 dark:border-gray-700">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No jobs created yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Start building your dream team by creating your first job posting. 
                Our AI-powered platform will help you find the perfect candidates.
              </p>
              <button 
                className="btn-primary group flex items-center gap-2 px-8 py-4 text-lg mx-auto"
                onClick={openCreateForm}
              >
                <Plus className="w-6 h-6" />
                Create Your First Job
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {jobs.map(job => (
                <Card key={job.id} className="card-enhanced card-hover group overflow-hidden border-0 shadow-soft hover:shadow-strong">
                  <div className="relative">
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className="status-badge status-open">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Active
                      </span>
                    </div>
                    
                    {/* Header */}
                    <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                            {job.jobName}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <Building2 className="w-4 h-4" />
                            <span className="font-medium">{job.jobRole}</span>
                          </div>
                        </div>
                        
                        {/* Action Menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus-enhanced" title="More actions">
                              <MoreVertical className="w-5 h-5 text-gray-500" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => openEditForm(job)} className="cursor-pointer">
                              <Pencil className="w-4 h-4 mr-2" /> Edit Job
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setSelectedJobId(job.id); setShowApplicants(true); }} className="cursor-pointer">
                              <Users className="w-4 h-4 mr-2" /> View Applicants
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/${job.id}`)} className="cursor-pointer">
                              <BarChart className="w-4 h-4 mr-2" /> Analytics
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(job.id)} disabled={loading} className="cursor-pointer text-red-600 dark:text-red-400">
                              <Trash2 className="w-4 h-4 mr-2" /> Delete Job
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>

                    {/* Content */}
                    <CardContent className="pt-6">
                      {/* Job Details */}
                      <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>{job.location || 'Remote'}</span>
                        </div>
                        
                        {job.salary && (
                          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <span>{job.salary}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Description & Requirements */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                            {job.jobDescription}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Requirements</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                            {job.requirements}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <button
                          onClick={() => { setSelectedJobId(job.id); setShowApplicants(true); }}
                          className="flex-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                        >
                          <Users className="w-4 h-4" />
                          View Applicants
                        </button>
                        
                        <button
                          onClick={() => router.push(`/dashboard/${job.id}`)}
                          className="flex-1 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                        >
                          <BarChart className="w-4 h-4" />
                          Analytics
                        </button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Job Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="p-0 max-w-2xl">
          <DialogTitle className="sr-only">{editJobId ? 'Edit Job' : 'Create Job'}</DialogTitle>
          <Card className="shadow-strong border-0">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
              <CardTitle className="text-2xl font-bold">{editJobId ? 'Edit Job' : 'Create New Job'}</CardTitle>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
                <X className="w-6 h-6" />
              </button>
            </CardHeader>
            <CardContent className="p-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Job Name *</label>
                    <input 
                      name="jobName" 
                      value={form.jobName} 
                      onChange={handleChange} 
                      placeholder="e.g., Senior Software Engineer" 
                      className="input-enhanced" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Job Role *</label>
                    <input 
                      name="jobRole" 
                      value={form.jobRole} 
                      onChange={handleChange} 
                      placeholder="e.g., Software Development" 
                      className="input-enhanced" 
                      required 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Job Description *</label>
                  <textarea 
                    name="jobDescription" 
                    value={form.jobDescription} 
                    onChange={handleChange} 
                    placeholder="Describe the role, responsibilities, and what makes this position exciting..." 
                    className="input-enhanced min-h-[120px] resize-none" 
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Requirements *</label>
                  <textarea 
                    name="requirements" 
                    value={form.requirements} 
                    onChange={handleChange} 
                    placeholder="List the skills, experience, and qualifications needed..." 
                    className="input-enhanced min-h-[100px] resize-none" 
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Location</label>
                    <input 
                      name="location" 
                      value={form.location} 
                      onChange={handleChange} 
                      placeholder="e.g., San Francisco, CA or Remote" 
                      className="input-enhanced" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Salary Range</label>
                    <input 
                      name="salary" 
                      value={form.salary} 
                      onChange={handleChange} 
                      placeholder="e.g., $80,000 - $120,000" 
                      className="input-enhanced" 
                    />
                  </div>
                </div>
                
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="text-red-800 dark:text-red-200 text-sm">{error}</div>
                  </div>
                )}
                
                <div className="flex gap-4 justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary flex items-center gap-2" 
                    disabled={loading}
                  >
                    {loading && <span className="loading-spinner"></span>}
                    {editJobId ? 'Update Job' : 'Create Job'}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      {/* Applicants Dialog */}
      <ApplicantListDialog open={showApplicants} onOpenChange={setShowApplicants} jobId={selectedJobId} />
    </div>
  );
} 