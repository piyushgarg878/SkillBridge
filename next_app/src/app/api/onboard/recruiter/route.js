import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const { userId, name, age, companyName } = await req.json();
    if (!userId || !name || !age || !companyName) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    const recruiter = await prisma.recruiter.create({
      data: { userId, name, age: Number(age), companyName },
    });
    return NextResponse.json({ recruiter }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 