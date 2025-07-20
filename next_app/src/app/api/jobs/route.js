import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Create a job (POST)
export async function POST(req) {
  try {
    const { recruiterId, jobName, jobRole, jobDescription, requirements, location, salary } = await req.json();
    if (!recruiterId || !jobName || !jobRole || !jobDescription || !requirements) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const job = await prisma.job.create({
      data: {
        recruiterId,
        jobName,
        jobRole,
        jobDescription,
        requirements,
        location,
        salary,
      },
    });
    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// List all jobs (GET)
export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      include: { recruiter: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ jobs });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 