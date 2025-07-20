'use client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function RoleSelector({ onSelect }) {
  return (
    <div className="flex flex-col items-center gap-8">
      <Card className="w-full max-w-md cursor-pointer hover:shadow-lg transition" onClick={() => onSelect('recruiter')}>
        <CardHeader>
          <CardTitle>Recruiter</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Post jobs, find candidates, and manage your hiring process.</p>
        </CardContent>
      </Card>
      <Card className="w-full max-w-md cursor-pointer hover:shadow-lg transition" onClick={() => onSelect('candidate')}>
        <CardHeader>
          <CardTitle>Candidate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Search for jobs, apply easily, and get matched to top opportunities.</p>
        </CardContent>
      </Card>
    </div>
  );
} 