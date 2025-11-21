import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user?.id) {
        return NextResponse.json({ 
            status: 'error',
            message: '認証されていません'
        }, { status: 401 });
    }

    try {
        const chats = await prisma.chat.findMany({
            where: { userId: session.user.id },
            orderBy: { updatedAt: 'desc' },
            include: {
                messages: {
                    orderBy: { timestamp: 'asc' },
                    take: 1,
                }
            }
        });

        return NextResponse.json({ 
            status: 'success',
            data: chats
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching chats:', error);
        return NextResponse.json({ 
            status: 'error',
            message: 'チャット一覧の取得に失敗しました'
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user?.id) {
        return NextResponse.json({ 
            status: 'error',
            message: '認証されていません'
        }, { status: 401 });
    }

    try {
        const { title } = await req.json();

        const chat = await prisma.chat.create({
            data: {
                userId: session.user.id,
                title: title || null,
            }
        });

        return NextResponse.json({ 
            status: 'success',
            data: chat
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating chat:', error);
        return NextResponse.json({ 
            status: 'error',
            message: 'チャットの作成に失敗しました'
        }, { status: 500 });
    }
}
