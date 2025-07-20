import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Apply for a job (POST)
export async function POST(req) {
  try {
    const { candidateId, jobId, resumeUrl, coverLetter } = await req.json();
    if (!candidateId || !jobId || !resumeUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const application = await prisma.application.create({
      data: {
        candidateId,
        jobId,
        resumeUrl,
        coverLetter,
      },
    });
    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// List applications for a candidate (GET)
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const candidateId = searchParams.get('candidateId');
  if (!candidateId) {
    return NextResponse.json({ error: 'Missing candidateId' }, { status: 400 });
  }
  const applications = await prisma.application.findMany({
    where: { candidateId },
    select: { id: true, jobId: true },
  });
  return NextResponse.json({ applications });
} 