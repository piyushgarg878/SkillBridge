'use client';
import { getProviders, signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export default function SignInPage() {
  const [providers, setProviders] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    getProviders().then(setProviders);
  }, []);

  useEffect(() => {
    console.log('session:', session, 'status:', status);
    if (status === "authenticated" && session?.user?.id) {
      // Check onboarding status
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;
            signIn("credentials", { email, password });
          }}>
            <input type="email" name="email" placeholder="Email" required className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="password" name="password" placeholder="Password" required className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">Sign in with Credentials</button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <hr className="my-2" />
          {providers &&
            Object.values(providers).map((provider) =>
              provider.id !== "credentials" ? (
                <button
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="w-full bg-gray-100 text-gray-900 py-2 rounded hover:bg-gray-200 transition-colors border"
                >
                  Sign in with {provider.name}
                </button>
              ) : null
            )}
        </CardFooter>
      </Card>
    </div>
  );
}