import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractJsonFromText(text: string): any {
    let jsonText = text.trim();
    if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
    }
    const firstBrace = jsonText.indexOf('{');
    const lastBrace = jsonText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
        jsonText = jsonText.substring(firstBrace, lastBrace + 1);
    }
    return JSON.parse(jsonText);
}

export async function generateTestStudyPlan(test: Test) {
    try {
        if (!test || !test.name) {
            throw new Error("テスト情報が不足しています");
        }

        if (!process.env.OPENAI_API_URL) {
            throw new Error("OPENAI_API_URLが設定されていません");
        }
        if (!process.env.OPENAI_API_KEY) {
            throw new Error("OPENAI_API_KEYが設定されていません");
        }
        if (!process.env.OPENAI_API_MODEL) {
            throw new Error("OPENAI_API_MODELが設定されていません");
        }

        const subjectsInfo = test.scores && test.scores.length > 0
            ? test.scores.map((score: Score) => {
                return `  - ${score.subject?.name || '未設定'}: 目標点数 ${score.maxValue}点`;
            }).join('\n')
            : "  なし";

        const tasksInfo = test.tasks && test.tasks.length > 0
            ? test.tasks.map((task: Task) => {
                return `  - ${task.title} (${task.status === 'COMPLETED' ? '完了' : task.status === 'IN_PROGRESS' ? '進行中' : '未着手'})`;
            }).join('\n')
            : "  なし";

        const prompt = `
            あなたは学習計画の専門家です。以下のテスト情報から、効果的な学習計画を立ててください。
            テスト期間全体を考慮し、各教科のバランスを取った学習計画を提案してください。また、タスクを終わらせることを優先し、なるべく余計な負担をかけないようにしてください(まとめるなどはいらない)。
            【現在の日時】${new Date().toLocaleString('ja-JP')}

            【テスト情報】
            テスト名: ${test.name}
            説明: ${test.description || "なし"}
            開始日: ${new Date(test.startDate).toLocaleDateString('ja-JP')}
            終了日: ${new Date(test.endDate).toLocaleDateString('ja-JP')}

            【登録されている教科】${subjectsInfo}

            【終わらせるべきタスク】${tasksInfo}

            以下のJSON形式で学習計画を出力してください：

            {
            "overview": "このテストの全体的な攻略方針（2-3文）",
            "estimatedTime": "推定所要時間（例: 30時間）",
            "difficulty": "難易度（簡単/普通/難しい）",
            "steps": [
                {
                "step": 1,
                "dueDate": "YYYY-MM-DD",
                "title": "ステップのタイトル",
                "description": "具体的な内容",
                "estimatedMinutes": 120
                }
            ],
            "tips": [
                "学習のコツ1",
                "学習のコツ2",
                "学習のコツ3"
            ],
            }
        `;

        console.log(`endpoint ${process.env.OPENAI_API_URL}/v1/chat/completions`);
        const response = await fetch(`${process.env.OPENAI_API_URL}/v1/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: process.env.OPENAI_API_MODEL,
                messages: [
                {
                    role: "system",
                    content: "あなたは学生の学習を支援する専門家です。具体的で実践的なアドバイスを提供してください。",
                },
                {
                    role: "user",
                    content: prompt,
                },
                ],
                temperature: 0.7,
                max_tokens: 2000,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenAI API Error:", errorText);
            throw new Error(`OpenAI API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.choices || !data.choices[0]?.message?.content) {
            console.error("Invalid API Response:", data);
            throw new Error("OpenAI APIのレスポンスが不正です");
        }

        const content = data.choices[0].message.content;
        const studyPlan = extractJsonFromText(content);

        if (!studyPlan.overview || !studyPlan.estimatedTime || !studyPlan.difficulty) {
            console.error("Missing required fields in study plan:", studyPlan);
            throw new Error("生成された学習計画に必須フィールドが不足しています");
        }

        return studyPlan;

    } catch (error) {
        console.error("Study plan generation error:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("学習計画の生成中に予期しないエラーが発生しました");
    }
}

export async function saveTestStudyPlan(testId: string, studyPlan: StudyPlan) {
    try {
        if (!studyPlan.overview || !studyPlan.estimatedTime || !studyPlan.difficulty) {
            throw new Error("学習計画に必須フィールドが不足しています");
        }

        const existingStudyPlan = await prisma.studyPlan.findUnique({
            where: { testId: testId },
            include: { steps: true }
        });

        if (existingStudyPlan) {

            await prisma.studyPlanStep.deleteMany({
                where: { studyPlanId: existingStudyPlan.id }
            });

            await prisma.studyPlan.update({
                where: { id: existingStudyPlan.id },
                data: {
                    overview: studyPlan.overview,
                    estimatedTime: studyPlan.estimatedTime,
                    difficulty: studyPlan.difficulty,
                    tips: studyPlan.tips as Prisma.JsonArray,
                    steps: {
                        create: studyPlan.steps.map((step) => ({
                            step: step.step,
                            dueDate: step.dueDate ? new Date(step.dueDate) : null,
                            title: step.title,
                            description: step.description,
                            estimatedMinutes: step.estimatedMinutes,
                        }))
                    }
                }
            });
        } else {
            await prisma.studyPlan.create({
                data: {
                    testId: testId,
                    overview: studyPlan.overview,
                    estimatedTime: studyPlan.estimatedTime,
                    difficulty: studyPlan.difficulty,
                    tips: studyPlan.tips as Prisma.JsonArray,
                    steps: {
                        create: studyPlan.steps.map((step) => ({
                            step: step.step,
                            dueDate: step.dueDate ? new Date(step.dueDate) : null,
                            title: step.title,
                            description: step.description,
                            estimatedMinutes: step.estimatedMinutes,
                        }))
                    }
                }
            });
        }
    } catch (error) {
        console.error("Error saving study plan:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                throw new Error("テストが見つかりません");
            }
            if (error.code === 'P2002') {
                throw new Error("学習計画の保存中に重複エラーが発生しました");
            }
        }
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("学習計画の保存中に予期しないエラーが発生しました");
    }
}
