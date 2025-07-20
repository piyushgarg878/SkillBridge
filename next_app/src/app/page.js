'use client';
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Briefcase, Users, ShieldCheck, Rocket, Globe, Mail } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen">
      {/* Hero Section */}
      <section className="w-full max-w-4xl mx-auto text-center py-20 px-4">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
          Find Your Dream Job or <span className="text-blue-600">Hire Top Talent</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
          Connect with the best opportunities and candidates. Whether you're looking for your next career move or building your dream team, we've got you covered.
        </p>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg shadow transition-colors"
          onClick={() => router.push('/onboard')}
        >
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-5xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Why Choose JobPortal?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="flex flex-col items-center p-6">
            <CardHeader className="mb-2 flex flex-col items-center">
              <Rocket className="w-10 h-10 text-blue-600 mb-2" />
              <CardTitle className="text-xl font-semibold">Fast & Easy</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300 text-center">
              Quick job posting and application process that saves you time.
            </CardContent>
          </Card>
          <Card className="flex flex-col items-center p-6">
            <CardHeader className="mb-2 flex flex-col items-center">
              <Users className="w-10 h-10 text-green-600 mb-2" />
              <CardTitle className="text-xl font-semibold">Quality Matches</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300 text-center">
              Advanced algorithms ensure the best candidate-job matches.
            </CardContent>
          </Card>
          <Card className="flex flex-col items-center p-6">
            <CardHeader className="mb-2 flex flex-col items-center">
              <ShieldCheck className="w-10 h-10 text-purple-600 mb-2" />
              <CardTitle className="text-xl font-semibold">Secure & Private</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300 text-center">
              Your data is protected with enterprise-grade security.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Onboard Section */}
      <section className="w-full max-w-3xl mx-auto py-12 px-4 text-center">
        <Card className="p-8 shadow-lg border-blue-100">
          <CardHeader>
            <CardTitle className="text-2xl font-bold mb-2">Ready to get started?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-200 mb-6">Sign up and onboard as a recruiter or candidate to unlock all features.</p>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg text-lg shadow"
              onClick={() => router.push('/onboard')}
            >
              Onboard Now
            </button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-white py-12 px-4 mt-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <h3 className="ml-3 text-xl font-bold">JobPortal</h3>
            </div>
            <p className="text-gray-400">
              Connecting talent with opportunity, one job at a time.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">For Employers</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Post a Job</a></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
              <li><a href="#" className="hover:text-white">Recruitment Tools</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">For Job Seekers</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Browse Jobs</a></li>
              <li><a href="#" className="hover:text-white">Career Advice</a></li>
              <li><a href="#" className="hover:text-white">Resume Builder</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 JobPortal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
