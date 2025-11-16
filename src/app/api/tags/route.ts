import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'User ID is required' },
                { status: 400 }
            );
        }

        // ユーザーのタスクに紐づくタグを取得
        const tags = await prisma.tag.findMany({
            where: {
                tasks: {
                    some: {
                        userId: userId
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });

        return NextResponse.json({
            success: true,
            data: tags
        });
    } catch (error) {
        console.error('Error fetching tags:', error);
        return NextResponse.json(
            { 
                success: false, 
                message: 'Failed to fetch tags' 
            },
            { status: 500 }
        );
    }
}
