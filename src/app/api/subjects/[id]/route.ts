import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { verifyFirebaseToken } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {

    const { id } = await params;

    const { ok, uid, error } = await verifyFirebaseToken(req);

    if (!ok) {
        return NextResponse.json({
            status: "error",
            message: error || "認証に失敗しました"
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
            message: "科目の取得に失敗しました"
        }, { status: 500 });
    }
}