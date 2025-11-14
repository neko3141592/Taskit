import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';

export async function createTest(userId: string, data: { name: string, startDate: Date, endDate: Date }) {
    try {
        if (!userId) throw new Error('userId is required');
        if (!data.name || !data.startDate || !data.endDate) throw new Error('name, startDate, and endDate are required');
        const newTest = await prisma.test.create({
            data: {
                name: data.name,
                startDate: data.startDate,
                endDate: data.endDate,
                userId
            }
        });
        return newTest;
    } catch (error) {
        console.error('createTest error:', error);
        throw new Error(`Failed to create test: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function getTestsByUserId(userId: string) {
    try {
        if (!userId) throw new Error('userId is required');
        const tests = await prisma.test.findMany({
            where: { userId },
            orderBy: { startDate: 'asc' },
        });
        return tests;
    } catch (error) {
        console.error('getTestsByUserId error:', error);
        throw new Error(`Failed to get tests by userId: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function getTestById(testId: string) {
    try {
        if (!testId) throw new Error('testId is required');
        const test = await prisma.test.findUnique({
            where: { id: testId },
            include: { tasks: true, scores: { include: { subject: true } } }
        });
        if (!test) throw new Error('Test not found');
        return test;
    } catch (error) {
        console.error('getTestById error:', error);
        throw new Error(`Failed to get test by id: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function getNextTest(userId: string) {
    try {
        if (!userId) throw new Error('userId is required');
        const now = new Date();
        const nextTest = await prisma.test.findFirst({
            where: {
                userId,
                startDate: {
                    gte: now
                }
            },
            orderBy: {
                startDate: 'asc'
            }
        });
        return nextTest;
    } catch (error) {
        console.error('getNextTest error:', error);
        throw new Error(`Failed to get next test: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function createSubject(userId: string, data: Omit<Score , 'id'>) {
    try {
        if (!userId) throw new Error('userId is required');
        if (!data.maxValue || !data.subjectId || !data.testId) throw new Error('maxValue, subjectId, and testId are required');
        const newScore = await prisma.score.create({
            data: {
                value: null,
                maxValue: data.maxValue,
                userId: userId,
                subjectId: data.subjectId,
                testId: data.testId,
            }
        });
        return newScore;
    } catch (error) {
        console.error('createSubject error:', error);
        throw new Error(`Failed to create subject: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function deleteSubject(scoreId: string) {
    try {
        if (!scoreId) throw new Error('scoreId is required');
        const deletedScore = await prisma.score.delete({
            where: { id: scoreId }
        });
        return deletedScore;
    } catch (error) {
        console.error('deleteSubject error:', error);
        throw new Error(`Failed to delete subject: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function updateSubject(scoreId: string, data: Partial<Score>) {
    if (data.maxValue && data.value && data.value > data.maxValue) {
        throw new Error('value cannot be greater than maxValue');
    }
    try {
        if (!scoreId) throw new Error('scoreId is required');
        const updatedScore = await prisma.score.update({
            where: { id: scoreId },
            data: data as Prisma.ScoreUpdateInput,
        });
        return updatedScore;
    } catch (error) {
        console.error('updateSubject error:', error);
        throw new Error(`Failed to update subject: ${error instanceof Error ? error.message : String(error)}`);
    }
}