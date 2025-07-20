import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }
  const recruiter = await prisma.recruiter.findUnique({ where: { userId } });
  const candidate = await prisma.candidate.findUnique({ where: { userId } });
  const onboarded = Boolean(recruiter || candidate);
  return NextResponse.json({ onboarded });
} 