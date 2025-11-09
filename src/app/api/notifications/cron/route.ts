import { scheduleNotifications } from '@/lib/notificationScheduler';

export async function GET(req: Request) {
    await scheduleNotifications();
    return new Response('Notifications scheduled');
}
