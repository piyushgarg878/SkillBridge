'use client';
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Briefcase, Users, ShieldCheck, Rocket, Globe, Mail, ArrowRight, Star, Zap, Target } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      

      {/* Hero Section */}
      <section className="w-full max-w-6xl mx-auto text-center py-24 px-4 relative z-10">
        <div className="fade-in">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm font-medium mb-8 border border-blue-200 dark:border-blue-800">
            <Star className="w-4 h-4 mr-2" />
            AI-Powered Job Matching Platform
          </div>
          
          <h1 className="heading-responsive font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight">
            Find Your Dream Job or{' '}
            <span className="gradient-text">Hire Top Talent</span>
          </h1>
          
          <p className="text-responsive text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Connect with the best opportunities and candidates using advanced AI algorithms. 
            Whether you're looking for your next career move or building your dream team, 
            we've got you covered with intelligent matching and insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              className="btn-primary group"
              onClick={() => router.push('/onboard')}
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </button>
            
            <button
              className="btn-secondary group"
              onClick={() => router.push('/auth/signin')}
            >
              Sign In
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">10K+</div>
              <div className="text-gray-600 dark:text-gray-400">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">50K+</div>
              <div className="text-gray-600 dark:text-gray-400">Candidates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">95%</div>
              <div className="text-gray-600 dark:text-gray-400">Match Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-7xl mx-auto py-20 px-4 relative z-10">
        <div className="text-center mb-16 slide-in-left">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Why Choose <span className="gradient-text">SkillBridge</span>?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experience the future of job matching with cutting-edge AI technology and seamless user experience.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="card-enhanced card-hover p-8 text-center group">
            <CardHeader className="mb-4 flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-semibold">Fast & Easy</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300">
              Quick job posting and application process that saves you time and effort.
            </CardContent>
          </Card>
          
          <Card className="card-enhanced card-hover p-8 text-center group">
            <CardHeader className="mb-4 flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-semibold">AI-Powered Matching</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300">
              Advanced algorithms ensure the best candidate-job matches with high accuracy.
            </CardContent>
          </Card>
          
          <Card className="card-enhanced card-hover p-8 text-center group">
            <CardHeader className="mb-4 flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-semibold">Secure & Private</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300">
              Your data is protected with enterprise-grade security and privacy controls.
            </CardContent>
          </Card>
          
          <Card className="card-enhanced card-hover p-8 text-center group">
            <CardHeader className="mb-4 flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-semibold">Smart Insights</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300">
              Get intelligent analytics and insights to make better hiring decisions.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full max-w-6xl mx-auto py-20 px-4 relative z-10">
        <div className="text-center mb-16 slide-in-right">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Simple steps to connect talent with opportunity
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
              1
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Sign Up & Onboard</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create your account and complete your profile as a candidate or recruiter.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
              2
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">AI Matching</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our AI analyzes resumes and job requirements for perfect matches.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
              3
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Connect & Hire</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Connect with your matches and start building successful partnerships.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full max-w-4xl mx-auto py-20 px-4 relative z-10">
        <Card className="card-enhanced p-12 text-center shadow-strong border-0">
          <div className="scale-in">
            <CardHeader className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Get Started?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl text-gray-700 dark:text-gray-200 mb-8 leading-relaxed">
                Join thousands of professionals and companies already using SkillBridge to find their perfect match. 
                Sign up today and experience the future of job matching.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  className="btn-primary group"
                  onClick={() => router.push('/onboard')}
                >
                  Start Onboarding
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </button>
                
                <button
                  className="btn-secondary group"
                  onClick={() => router.push('/auth/signin')}
                >
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </CardContent>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16 px-4 mt-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="fade-in">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <h3 className="ml-3 text-2xl font-bold">SkillBridge</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Connecting talent with opportunity through intelligent AI-powered matching. 
                Building the future of recruitment, one perfect match at a time.
              </p>
            </div>
            
            <div className="fade-in">
              <h4 className="text-lg font-semibold mb-6 text-white">For Employers</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Post a Job</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Pricing Plans</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Recruitment Tools</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Analytics Dashboard</a></li>
              </ul>
            </div>
            
            <div className="fade-in">
              <h4 className="text-lg font-semibold mb-6 text-white">For Job Seekers</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Browse Jobs</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Career Advice</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Resume Builder</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Interview Prep</a></li>
              </ul>
            </div>
            
            <div className="fade-in">
              <h4 className="text-lg font-semibold mb-6 text-white">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors duration-200">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 SkillBridge. All rights reserved. Built with ❤️ for the future of work.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
