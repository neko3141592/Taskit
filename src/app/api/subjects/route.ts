import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import type { Prisma, TaskStatus } from '@/generated/prisma/client';

export async function GET(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) {
        return NextResponse.json({
            status: "error",
            message: "userIdが必要です"
        } , {status: 400} );
    }
    try {
        const subjects = await prisma.subject.findMany({
            where: {userId},
            orderBy: { name: "asc" }
        });
        return NextResponse.json({
            status: "success",
            data: subjects
        }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({
            status: "error",
            message: "科目一覧の取得に失敗しました"
        }, { status: 500 });
    }
}