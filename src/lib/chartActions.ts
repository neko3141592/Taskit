import { prisma } from '@/lib/prisma';

export async function getSubjectChartData(userId: string, subjectId?: string[]): Promise<SubjectChartData> {
    try {
        if (!userId) throw new Error('userId is required');

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

        if (data.length === 0) {
            return {
                labels: [],
                datasets: [],
            };
        }

        const labels = Array
            .from(
                new Set(
                    data
                        .map((score) => score.test?.name || '')
                )
            );
        const subjectNames = Array.from(new Set(data.map((score) => score.subject?.name || 'Unknown Subject')));

        const subjectMap = new Map<string, { data: (number | null)[], borderColor?: string, backgroundColor?: string }>();
        subjectNames.forEach(subjectName => {
            const color = data.find(s => (s.subject?.name || 'Unknown Subject') === subjectName)?.subject?.color;
            subjectMap.set(subjectName, {
                data: labels.map(testName => {
                    const score = data.find(s =>
                        (s.subject?.name || 'Unknown Subject') === subjectName &&
                        (s.test?.name || '') === testName
                    );
                    if (!score || score.value === null) return null;
                    if (score.maxValue === 0) throw new Error(`maxValue is 0 for score ${score.id}`);
                    return Math.floor(score.value / score.maxValue * 100);
                }),
                borderColor: color,
                backgroundColor: color
            });
        });

        return {
            labels,
            datasets: Array
                .from(subjectMap.entries())
                .map(([subject, { data, borderColor, backgroundColor }]) => ({
                    label: subject,
                    data,
                    borderColor,
                    backgroundColor
                }))
                .filter(dataset => dataset.data.some(v => v !== null && v !== undefined)),
        };
    } catch (error) {
        console.error('Error in getSubjectChartData:', error);
        throw error;
    }
}