import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import type { Prisma, TaskStatus } from '@/generated/prisma/client';
import { verifyFirebaseToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) {
        return NextResponse.json({
            status: "error",
            message: "userIdが必要です"
        }, { status: 400 });
    }
    try {
        // 科目ごとに未完了・完了タスク件数を取得
        const subjects = await prisma.subject.findMany({
            where: { userId },
            orderBy: { name: "asc" },
            include: {
                tasks: {
                    select: { id: true, status: true }
                }
            }
        });

        const result = subjects.map(subject => {
            const incompleteTaskCount = subject.tasks.filter(
                t => t.status === "NOT_STARTED" || t.status === "IN_PROGRESS"
            ).length;
            const completedTaskCount = subject.tasks.filter(
                t => t.status === "COMPLETED"
            ).length;
            return {
                id: subject.id,
                name: subject.name,
                color: subject.color,
                userId: subject.userId,
                createdAt: subject.createdAt,
                incompleteTaskCount,
                completedTaskCount
            };
        });

        return NextResponse.json({
            status: "success",
            data: result
        }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            status: "error",
            message: "科目一覧の取得に失敗しました"
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const { ok, uid, error } = await verifyFirebaseToken(req);
    if (!ok) {
        return NextResponse.json({ 
            status: 'error',
            message: error
        }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name , color } = body;

        if (!name || name.trim() === '') {
            return NextResponse.json({
                status: "error",
                message: "科目名は必須です"
            }, { status: 400 });
        }

        const newSubject = await prisma.subject.create({
            data: {
                name: name.trim(),
                userId: uid!,
                color: color
            }
        });

        return NextResponse.json({
            status: "success",
            message: "科目の作成に成功しました",
            data: newSubject
        }, { status: 201 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            status: "error",
            message: "科目の作成に失敗しました"
        }, { status: 500 });
    }
}