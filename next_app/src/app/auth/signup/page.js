'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export default function SignUpPage() {
  const [formData, setFormData] = useState({email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Something went wrong');
    } else {
      router.push('/auth/signin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md shadow-xl border-2 border-blue-100">
        <CardHeader className="flex flex-col items-center gap-2 pb-2">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Sign Up for SkillBridge</CardTitle>
          <span className="text-gray-500 text-sm text-center">Create your account to get started</span>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-semibold">Sign Up</button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2">
          <span className="text-sm text-gray-500">Already have an account?</span>
          <button onClick={() => router.push('/auth/signin')} className="text-blue-600 hover:underline">Sign In</button>
        </CardFooter>
      </Card>
    </div>
  );
}