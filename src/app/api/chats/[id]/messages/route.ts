import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
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
        const { id: chatId } = await context.params;
        const { messages } = await req.json();

        const chat = await prisma.chat.findUnique({
            where: { 
                id: chatId,
                userId: session.user.id
            }
        });

        if (!chat) {
            return NextResponse.json({ 
                status: 'error',
                message: 'チャットが見つかりません'
            }, { status: 404 });
        }

        // メッセージを保存
        await prisma.chatMessage.createMany({
            data: messages.map((msg: Message) => ({
                chatId,
                role: msg.role,
                content: msg.content,
                timestamp: msg.timestamp || new Date(),
            }))
        });

        // チャットの更新日時を更新
        await prisma.chat.update({
            where: { id: chatId },
            data: { updatedAt: new Date() }
        });

        return NextResponse.json({ 
            status: 'success',
            message: 'メッセージを保存しました'
        }, { status: 201 });
    } catch (error) {
        console.error('Error saving messages:', error);
        return NextResponse.json({ 
            status: 'error',
            message: 'メッセージの保存に失敗しました'
        }, { status: 500 });
    }
}
