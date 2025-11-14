import { prisma } from '@/lib/prisma';

export async function scheduleNotifications() {
    try {
        const tasks = await prisma.task.findMany({
            where: {
                notificationDaysBefore: {
                    not: null
                },
                dueDate: {
                    not: null
                },
                notified: false
            }
        });

        const now = new Date();

        for (const task of tasks) {
            try {
                if (!task.dueDate || task.notificationDaysBefore === null) continue;

                const notificationDate = new Date(task.dueDate);
                notificationDate.setDate(notificationDate.getDate() - task.notificationDaysBefore);

                if (now >= notificationDate) {
                    await prisma.notification.create({
                        data: {
                            userId: task.userId,
                            title: '期限の通知',
                            message: `タスク"${task.title}"の期限が近づいています。`,
                            link: `dashboard/tasks/${task.id}`,
                            isRead: false,
                        }
                    });

                    await prisma.task.update({
                        where: { id: task.id },
                        data: { notified: true }
                    });
                }
            } catch (taskError) {
                console.error(`Failed to schedule notification for task ${task.id}:`, taskError);
            }
        }
    } catch (error) {
        console.error('scheduleNotifications error:', error);
        throw new Error(`Failed to schedule notifications: ${error instanceof Error ? error.message : String(error)}`);
    }
}