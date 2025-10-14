import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { verifyFirebaseToken } from "@/lib/auth";
import Prisma from '@/generated/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {

    const { id } = await params;

    const { ok, uid, error } = await verifyFirebaseToken(req);

    if (!ok) {
        return NextResponse.json({
            status: "error",
            message: error
        }, { status: 401 });
    }

    try {
        const subject = await prisma.subject.findUnique({
            where: { id: id, userId: uid },
            include: { tasks: {
                include: { tags: true }
            } }
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

    const { ok, uid, error } = await verifyFirebaseToken(req);

    const body = await req.json();

    if (!ok) {
        return NextResponse.json({
            status: "error",
            message: error as string
        }, { status: 401 });
    }

    try {
        const res = await prisma.subject.update({
            where: { id },
            data: {
                name: body.name,
                color: body.color,
            }
        });

        return NextResponse.json({
            status: 'success',
            message: `updated task ${id}`
        })
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error as string
        }, { status:401 });
    }
}