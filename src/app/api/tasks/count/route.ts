import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import type { Prisma, TaskStatus } from '@/generated/prisma/client';

export async function GET(req: NextRequest) {
    const { ok, uid, error } = await verifyFirebaseToken(req);
    if (!ok) {
        return NextResponse.json({ 
            status: 'error',
            message: error
        }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const dueFrom = searchParams.get('dueFrom');
    const dueTo = searchParams.get('dueTo');


    const dueDateFilter: Prisma.TaskWhereInput['dueDate'] = {};
    if (dueFrom) dueDateFilter.gte = new Date(dueFrom);
    if (dueTo) dueDateFilter.lte = new Date(dueTo);

    const where: Prisma.TaskWhereInput = { userId: uid! };
    if (dueFrom || dueTo) where.dueDate = dueDateFilter;

    const totalTasks = await prisma.task.count({ where });

    const completedTasks = await prisma.task.count({
        where: { ...where, status: 'COMPLETED' }
    });

    // 未着手タスク数
    const notStartedTasks = await prisma.task.count({
        where: { ...where, status: 'NOT_STARTED' }
    });

    // 進行中タスク数
    const inProgressTasks = await prisma.task.count({
        where: { ...where, status: 'IN_PROGRESS' }
    });

    // 完了率
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return NextResponse.json({
        status: "success",
        message: "統計データの取得に成功しました",
        data: {
            totalTasks,
            completedTasks,
            notStartedTasks,
            inProgressTasks,
            completionRate
        }
    }, { status: 200 });
}