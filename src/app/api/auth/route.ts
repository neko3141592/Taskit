import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { app } from '@/lib/firebaseAdmin';

const auth = getAuth(app);

export async function GET() {
    return NextResponse.json({ message: 'Hello from GET' });
}