import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { get } from "axios";
import { getSubjectChartData } from "@/lib/chartActions";


export async function GET(req: NextRequest) {
        
    const session = await auth();
        if (!session || !session.user?.id) {
            return NextResponse.json({ 
                status: 'error',
                message: '認証されていません'
            }, { status: 401 });
        }
    const uid = session.user.id;
    
    const params = req.nextUrl.searchParams;
    const id = params.get('id');

    const subjectId = id ? [id] : undefined;


    const data = await getSubjectChartData(uid, subjectId);


    return NextResponse.json({
        status: "success",
        data
    }, { status: 200 });

}