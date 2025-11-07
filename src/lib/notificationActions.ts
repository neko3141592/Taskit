import { prisma } from '@/lib/prisma';


export async function getNotifications(userId: string, skip: number, limit: number = 20){

    const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
    });
    return notifications;

}


export async function createNotification(userId: string, content: Notification) {

    const notification = await prisma.notification.create({
        data: {
            userId,
            title: content.title,
            message: content.message,
            isRead: false,
        }
    });
    return notification;
}

export async function getNotificationCount(userId: string): Promise<{all: number, read: number, unread: number}> {
    const read = await prisma.notification.count({
        where: { userId, isRead: true }
    });
    const unread = await prisma.notification.count({
        where: { userId, isRead: false }
    });
    const count = read + unread;
    return {all: count, read, unread};
}


export async function markNotificationAsRead(userId: string, notificationId: string) {
    await prisma.notification.updateMany({
        where: {
            id: notificationId,
            userId
        },
        data: {
            isRead: true
        }
    });
}