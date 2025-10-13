import { NextRequest } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { auth } from '@/lib/firebaseAdmin';


export async function verifyFirebaseToken(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
        return { ok: false, error: '認証情報がありません' };
    }
    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = await auth.verifyIdToken(token);
        return { ok: true, uid: decoded.uid };
    } catch (error) {
        console.error(error);
        return { ok: false, error: 'トークン検証失敗' };
    }
}