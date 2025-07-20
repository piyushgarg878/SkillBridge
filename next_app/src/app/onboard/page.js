'use client';
import { useSession } from "next-auth/react";
import RecruiterDetailsForm from "@/components/RecruiterDetailsForm";
import CandidateDetailsForm from "@/components/CandidateDetailsForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Onboard() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Tabs defaultValue="recruiter" className="w-full max-w-md">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="recruiter" className="flex-1">Recruiter</TabsTrigger>
          <TabsTrigger value="candidate" className="flex-1">Candidate</TabsTrigger>
        </TabsList>
        <TabsContent value="recruiter">
          {userId ? <RecruiterDetailsForm userId={userId} /> : <div className="text-red-500">You must be signed in to continue onboarding.</div>}
        </TabsContent>
        <TabsContent value="candidate">
          {userId ? <CandidateDetailsForm userId={userId} /> : <div className="text-red-500">You must be signed in to continue onboarding.</div>}
        </TabsContent>
      </Tabs>
    </div>
  );
}