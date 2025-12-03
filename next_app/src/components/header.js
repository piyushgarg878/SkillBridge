'use client'
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sun, Moon, LogOut, Plus } from 'lucide-react';

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (
      status !== "loading" &&
      status === "unauthenticated" &&
      pathname !== "/" &&
      pathname !== "/auth/signin" &&
      pathname !== "/auth/signup"
    ) {
      router.replace("/auth/signin");
    }
  }, [status, pathname, router]);

  const isRecruiter = session?.user?.role === 'recruiter' || pathname?.includes('recruiter');

  const initials = session?.user?.name
    ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : session?.user?.email?.[0]?.toUpperCase() || 'U';

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-soft border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-all duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-4">
          <div 
            className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300"
            onClick={() => router.push('/')}
          >
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <span 
            className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
            onClick={() => router.push('/')}
          >
            SkillBridge
          </span>
          <button 
            onClick={toggleDark} 
            className="ml-4 p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-300 focus-enhanced" 
            title="Toggle dark mode"
          >
            <Sun className="w-5 h-5 block dark:hidden" />
            <Moon className="w-5 h-5 hidden dark:block" />
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          {status === "authenticated" && (
            <>
              <button 
                onClick={() => router.push('/dashboard')} 
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 focus-enhanced"
              >
                Dashboard
              </button>
              
              {isRecruiter && (
                <button 
                  onClick={() => router.push('/dashboard?postJob=true')} 
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 focus-enhanced flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Post Job
                </button>
              )}
              

              
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg ml-2 cursor-pointer hover:scale-110 transition-transform duration-300 shadow-soft">
                {initials}
              </div>
              
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 shadow-soft focus-enhanced flex items-center gap-2"
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </>
          )}
          
          {status !== "authenticated" && (
            <>
              <button
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 focus-enhanced"
                onClick={() => router.push('/auth/signin')}
              >
                Sign In
              </button>
              <button
                className="btn-primary text-sm px-6 py-2"
                onClick={() => router.push('/auth/signup')}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}