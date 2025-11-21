import { NextRequest, NextResponse } from "next/server";
import { generateTestStudyPlan, saveTestStudyPlan } from "@/lib/testStudyPlanActions";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { test } = await req.json();

        if (!test || !test.name) {
            return NextResponse.json(
                { success: false, error: "テスト情報が不足しています" },
                { status: 400 }
            );
        }

        const studyPlan = await generateTestStudyPlan(test);
        
        // 学習計画を保存
        await saveTestStudyPlan(test.id, studyPlan);

        return NextResponse.json({
            success: true,
            data: studyPlan,
        });
    } catch (error: unknown) {
        console.error("Study plan generation error:", error);
        const errorMessage = error instanceof Error ? error.message : "不明なエラー";
        return NextResponse.json(
            { success: false, error: `学習計画の生成に失敗しました: ${errorMessage}` },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const testId = searchParams.get("testId");

        if (!testId) {
            return NextResponse.json(
                { success: false, error: "テストIDが必要です" },
                { status: 400 }
            );
        }

        const savedPlan = await prisma.studyPlan.findUnique({
            where: { testId: testId },
            include: {
                steps: {
                    orderBy: { step: 'asc' }
                }
            }
        });

        if (!savedPlan) {
            return NextResponse.json({
                success: true,
                data: null,
            });
        }

        const formattedPlan: Omit<StudyPlan, "testId"> = {
            overview: savedPlan.overview,
            estimatedTime: savedPlan.estimatedTime,
            difficulty: savedPlan.difficulty,

            steps: savedPlan.steps.map(step => ({
                step: step.step,
                title: step.title,
                description: step.description,
                estimatedMinutes: step.estimatedMinutes,
                dueDate: step.dueDate ? step.dueDate.toISOString() : new Date().toISOString(),
            })),
            tips: savedPlan.tips as string[],
        };
        
        return NextResponse.json({
            success: true,
            data: formattedPlan,
        });
    } catch (error: unknown) {
        console.error("Study plan fetch error:", error);
        const errorMessage = error instanceof Error ? error.message : "不明なエラー";
        return NextResponse.json(
            { success: false, error: `学習計画の取得に失敗しました: ${errorMessage}` },
            { status: 500 }
        );
    }
}
