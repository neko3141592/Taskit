import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyFirebaseToken } from '@/lib/auth';
import type { Prisma } from '@/generated/prisma/client';


export async function POST(req: NextRequest) {
    const { ok, uid, error } = await verifyFirebaseToken(req);
    if (!ok) {
        return NextResponse.json({ 
            status: 'error',
            message: error
        }, { status: 401 });
    }

    const { name, email } = await req.json();

    if (!name || !email) {
        return NextResponse.json({ 
            status: 'error',
            message: '名前とメールアドレスは必須です'
        }, { status: 400 });
    }

    try {
        const newUser: Prisma.UserCreateInput = await prisma.user.create({
            data: {
                id: uid!,
                name,
                email,
            },
        });

        return NextResponse.json({ 
            status: 'success', 
            message: 'ユーザーの作成に成功しました', 
            data: newUser 
        }, { status: 201 });
    } catch (error) {
        console.log('Error creating user:', error);
        return NextResponse.json({ 
            status: 'error',
            message: 'ユーザーの作成中にエラーが発生しました'
        }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {

    const searchParams = req.nextUrl.searchParams;

    const id = searchParams.get('id');
    const name = searchParams.get('username');
    const email = searchParams.get('email');

    const where: Prisma.UserWhereInput = {};
    if (id) where.id = id;
    if (name) where.name = name;
    if (email) where.email = email;

    const users = await prisma.user.findMany({
        where
    });

    return NextResponse.json({ 
        status: 'success', 
        message: 'ユーザー情報の取得に成功しました', 
        data: users
    }, { status: 200 });
}