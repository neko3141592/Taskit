import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ 
            status: 'error',
            message: '認証されていません'
        }, { status: 401 });
    }

    const { id } = await params;

    try {
        const subject = await prisma.subject.findUnique({
            where: { id: id, userId: session.user.id },
            include: { tasks: { include: { tags: true } } }
        });
        return NextResponse.json({
            status: "success",
            data: subject
        }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({
            status: "error",
            message: error as string
        }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params;
    const session = await auth();
    const body = await req.json();

    if (!session?.user?.id) {
        return NextResponse.json({
            status: "error",
            message: "認証されていません"
        }, { status: 401 });
    }

    try {
        const res = await prisma.subject.update({
            where: { id, userId: session.user.id },
            data: {
                name: body.name,
                color: body.color,
            }
        });

        return NextResponse.json({
            status: 'success',
            message: `updated subject ${id}`,
            data: res
        })
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error as string
        }, { status: 401 });
    }
}