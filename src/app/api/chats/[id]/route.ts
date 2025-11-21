import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ 
            status: 'error',
            message: '認証されていません'
        }, { status: 401 });
    }

    try {
        const { id } = await context.params;
        
        const chat = await prisma.chat.findUnique({
            where: { 
                id,
                userId: session.user.id 
            },
            include: {
                messages: {
                    orderBy: { timestamp: 'asc' }
                }
            }
        });

        if (!chat) {
            return NextResponse.json({ 
                status: 'error',
                message: 'チャットが見つかりません'
            }, { status: 404 });
        }

        return NextResponse.json({ 
            status: 'success',
            data: chat
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching chat:', error);
        return NextResponse.json({ 
            status: 'error',
            message: 'チャットの取得に失敗しました'
        }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ 
            status: 'error',
            message: '認証されていません'
        }, { status: 401 });
    }

    try {
        const { id } = await context.params;
        
        // 自分のチャットのみ削除可能
        await prisma.chat.delete({
            where: { 
                id,
                userId: session.user.id
            }
        });

        return NextResponse.json({ 
            status: 'success',
            message: 'チャットを削除しました'
        }, { status: 200 });
    } catch (error) {
        console.error('Error deleting chat:', error);
        return NextResponse.json({ 
            status: 'error',
            message: 'チャットの削除に失敗しました'
        }, { status: 500 });
    }
}
