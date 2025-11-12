import { prisma } from '@/lib/prisma';

export async function createTest(userId: string, data: { name: string, startDate: Date, endDate: Date }) {
    const newTest = await prisma.test.create({
        data: {
            name: data.name,
            startDate: data.startDate,
            endDate: data.endDate,
            userId
        }
    });
    return newTest;
}

export async function getTestsByUserId(userId: string) {
    const tests = await prisma.test.findMany({
        where: { userId },
        orderBy: { startDate: 'asc' },
    });
    return tests;
}

export async function getTestById(testId: string) {
    const test = await prisma.test.findUnique({
        where: { id: testId },
        include: { tasks: true, scores: { include: { subject: true } } }
    });
    return test;
}