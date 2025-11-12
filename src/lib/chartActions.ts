import { prisma } from '@/lib/prisma';

export async function getSubjectChartData(userId: string, subjectId?: string[]): Promise<SubjectChartData> {
    const result = await prisma.score.findMany({
        where: {
            userId,
            ...(subjectId && subjectId.length > 0
                ? { subjectId: { in: subjectId } }
                : {}),
        },
        include: {
            subject: true,
            test: true,
        },
        orderBy: {
            test: {
                endDate: 'asc',
            }
        },
    });
    const data = result as unknown as Score[];

    const labels = Array.from(new Set(data.map((score) => score.test?.name || '')));

    const subjectMap = new Map<string , {data: number[], borderColor?: string, backgroundColor?: string}>()

    data.forEach((score) => {
        const subjectName = score.subject?.name || 'Unknown Subject';
        if (!subjectMap.has(subjectName)) {
            subjectMap.set(subjectName, { data: [] });
        }
        const subjectObj = subjectMap.get(subjectName);
        if (subjectObj) {
            
            subjectObj.data.push(Math.floor(score.value / score.maxValue * 100));
            subjectObj.borderColor = score.subject?.color;
            subjectObj.backgroundColor = score.subject?.color;
        }

    });
    return {
        labels,
        datasets: Array.from(subjectMap.entries()).map(([subject, { data, borderColor, backgroundColor }]) => ({
            label: subject,
            data,
            borderColor,
            backgroundColor
        })),
    };
}