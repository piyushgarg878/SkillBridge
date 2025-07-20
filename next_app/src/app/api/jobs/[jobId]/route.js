import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req, { params }) {
  const { jobId } = params;
  try {
    const { recruiterId, jobName, jobRole, jobDescription, requirements, location, salary } = await req.json();
    if (!recruiterId || !jobName || !jobRole || !jobDescription || !requirements) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const job = await prisma.job.update({
      where: { id: jobId, recruiterId },
      data: { jobName, jobRole, jobDescription, requirements, location, salary },
    });
    return NextResponse.json({ job });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { jobId } = params;
  try {
    await prisma.job.delete({ where: { id: jobId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 