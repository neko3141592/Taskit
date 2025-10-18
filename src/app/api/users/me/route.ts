import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyFirebaseToken } from '@/lib/auth';
import type { Prisma } from '@/generated/prisma/client';



export async function GET(req: NextRequest) {
    const { ok, uid, error } = await verifyFirebaseToken(req);
    if (!ok) {
        return NextResponse.json({ 
            status: 'error',
            message: error
        }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: uid! },
        });

        if (!user) {
            return NextResponse.json({ 
                status: 'error',
                message: 'ユーザーが見つかりません'
            }, { status: 404 });
        }

        return NextResponse.json({ 
            status: 'success', 
            message: 'ユーザー情報の取得に成功しました', 
            data: user 
        }, { status: 200 });
    } catch (error) {
        console.log('Error fetching user:', error);
        return NextResponse.json({ 
            status: 'error',
            message: 'ユーザー情報の取得中にエラーが発生しました'
        }, { status: 500 });
    }
}