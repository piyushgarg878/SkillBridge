import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req, context) {
  const { jobId } = await context.params;
  if (!jobId) {
    return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });
  }
  const applicants = await prisma.application.findMany({
    where: { jobId },
    include: {
      candidate: {
        include: {
          user: { select: { email: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ applicants });
} 