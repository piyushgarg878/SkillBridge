'use client'
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sun, Moon } from 'lucide-react';

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

  // Dummy role detection for nav (replace with real logic if needed)
  const isRecruiter = session?.user?.role === 'recruiter' || pathname?.includes('recruiter');

  // User avatar/initials
  const initials = session?.user?.name
    ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : session?.user?.email?.[0]?.toUpperCase() || 'U';

  // Dark mode toggle (dummy, replace with real logic if using next-themes)
  const toggleDark = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">SkillBridge</span>
          <button onClick={toggleDark} className="ml-4 text-gray-500 hover:text-gray-900 dark:hover:text-white" title="Toggle dark mode">
            <Sun className="w-5 h-5 block dark:hidden" />
            <Moon className="w-5 h-5 hidden dark:block" />
          </button>
        </div>
        <div className="flex items-center gap-6">
          {status === "authenticated" && (
            <>
              <button onClick={() => router.push('/dashboard')} className={`text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium`}>Dashboard</button>
              {isRecruiter && (
                <button onClick={() => router.push('/dashboard?postJob=true')} className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Post Job</button>
              )}
              <button onClick={() => router.push('/dashboard/applications')} className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Applications</button>
              <button onClick={() => router.push('/profile')} className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Profile</button>
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-lg ml-2">
                {initials}
              </div>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 ml-2"
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              >
                Log Out
              </button>
            </>
          )}
          {status !== "authenticated" && (
            <>
              <button
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                onClick={() => router.push('/auth/signin')}
              >
                Sign In
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
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