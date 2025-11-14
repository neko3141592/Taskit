import { prisma } from '@/lib/prisma';


export async function getNotifications(userId: string, skip: number, limit: number = 20) {
    try {
        if (!userId) {
            throw new Error('userId is required');
        }
        if (skip < 0) {
            throw new Error('skip must be non-negative');
        }
        if (limit <= 0) {
            throw new Error('limit must be positive');
        }

        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: limit,
            skip,
        });
        return notifications;
    } catch (error) {
        console.error('Error in getNotifications:', error);
        throw error;
    }
}


export async function createNotification(userId: string, content: Notification) {
    try {
        if (!userId) {
            throw new Error('userId is required');
        }
        if (!content.title || !content.message) {
            throw new Error('title and message are required');
        }

        const notification = await prisma.notification.create({
            data: {
                userId,
                title: content.title,
                message: content.message,
                isRead: false,
            }
        });
        return notification;
    } catch (error) {
        console.error('Error in createNotification:', error);
        throw error;
    }
}

export async function getNotificationCount(userId: string): Promise<{all: number, read: number, unread: number}> {
    try {
        if (!userId) {
            throw new Error('userId is required');
        }

        const read = await prisma.notification.count({
            where: { userId, isRead: true }
        });
        const unread = await prisma.notification.count({
            where: { userId, isRead: false }
        });
        const count = read + unread;
        return { all: count, read, unread };
    } catch (error) {
        console.error('Error in getNotificationCount:', error);
        throw error;
    }
}


export async function markNotificationAsRead(userId: string, notificationId: string) {
    try {
        if (!userId) {
            throw new Error('userId is required');
        }
        if (!notificationId) {
            throw new Error('notificationId is required');
        }

        await prisma.notification.updateMany({
            where: {
                id: notificationId,
                userId
            },
            data: {
                isRead: true
            }
        });
    } catch (error) {
        console.error('Error in markNotificationAsRead:', error);
        throw error;
    }
}