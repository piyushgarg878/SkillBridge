'use client';
import { getProviders, signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, Mail, Lock, ArrowRight, Github } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  const [providers, setProviders] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getProviders().then(setProviders);
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetch(`/api/onboard/status?userId=${session.user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.onboarded) {
            router.replace('/dashboard');
          } else {
            router.replace('/onboard');
          }
        });
    }
  }, [status, session, router]);

  const handleCredentialsSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const email = e.target.email.value;
    const password = e.target.password.value;

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    }).then((res) => {
      if (res?.error) {
        // Handle error (could add toast here)
        setIsLoading(false);
      } else {
        // Redirect handled by useEffect
      }
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 p-4">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20 mb-2 transform hover:scale-105 transition-transform duration-300">
            <span className="text-white font-bold text-3xl tracking-tight">S</span>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Sign in to continue your journey
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {providers && Object.values(providers).some(p => p.id !== "credentials") && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
          )}

          <div className="grid gap-2">
            {providers && Object.values(providers).map((provider) =>
              provider.id !== "credentials" ? (
                <button
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="w-full bg-white dark:bg-slate-950 text-gray-900 dark:text-white py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-900 hover:border-gray-300 dark:hover:border-slate-700 transition-all duration-200 font-medium flex items-center justify-center gap-2"
                >
                  {provider.id === 'github' && <Github className="h-5 w-5" />}
                  Sign in with {provider.name}
                </button>
              ) : null
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-center gap-4 pb-8">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all"
            >
              Create account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}