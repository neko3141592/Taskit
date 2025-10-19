import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma/client';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user?.id) {
        return NextResponse.json({ 
            status: 'error',
            message: '認証されていません'
        }, { status: 401 });
    }

    const uid = session.user.id;

    const searchParams = req.nextUrl.searchParams;
    const dueFrom = searchParams.get('dueFrom');
    const dueTo = searchParams.get('dueTo');

    const dueDateFilter: Prisma.TaskWhereInput['dueDate'] = {};
    if (dueFrom) dueDateFilter.gte = new Date(dueFrom);
    if (dueTo) dueDateFilter.lte = new Date(dueTo);

    const where: Prisma.TaskWhereInput = { userId: uid };
    if (dueFrom || dueTo) where.dueDate = dueDateFilter;

    const totalTasks = await prisma.task.count({ where });

    const completedTasks = await prisma.task.count({
        where: { ...where, status: 'COMPLETED' }
    });

    const notStartedTasks = await prisma.task.count({
        where: { ...where, status: 'NOT_STARTED' }
    });

    const inProgressTasks = await prisma.task.count({
        where: { ...where, status: 'IN_PROGRESS' }
    });

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