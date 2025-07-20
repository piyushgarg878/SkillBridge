import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const { userId, name, age, collegeName } = await req.json();
    if (!userId || !name || !age || !collegeName) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    const candidate = await prisma.candidate.create({
      data: { userId, name, age: Number(age), collegeName },
    });
    return NextResponse.json({ candidate }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 