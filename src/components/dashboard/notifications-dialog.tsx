'use client'

import { useState, useEffect } from 'react';
import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { toast } from 'sonner';
import Spinner from '../ui/spinner';
import { useRouter } from "next/navigation";

const LIMIT = 5;

export default function NotificationsDialog() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [open, setOpen] = useState(false);

    const router = useRouter();

    const fetchNotifications = async (reset = false) => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await axios.get<{ data: Notification[] }>('/api/notifications', {
                params: {
                    skip: reset ? 0 : (page - 1) * LIMIT,
                    limit: LIMIT
                }
            });
            const newNotifications = response.data.data;
            if (reset) {
                setNotifications(newNotifications);
                setPage(2);
            } else {
                setNotifications(prev => [...prev, ...newNotifications]);
                setPage(prev => prev + 1);
            }
            const count = await fetchNotificationsCount();
            const totalPages = Math.ceil(count?.all / LIMIT) || 0;
            setHasMore((reset ? 1 : page) < totalPages);
        } catch {
            toast.error('通知の取得に失敗しました');
        } finally {
            setLoading(false);
        }
    };


    const fetchNotificationsCount = async (): Promise<{ all: number, read: number, unread: number } | undefined> => {
        try {
            const response = await axios.get<APIResponse<{ all: number, read: number, unread: number }>>('/api/notifications/count');
            const count: number = response.data.data.unread;
            setUnreadCount(count);
            return response.data.data;
        } catch {
            console.error('通知カウントの取得に失敗しました');
            return undefined
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchNotificationsCount();
    }, []);

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            fetchNotifications(true);
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        try {
            await axios.post(`/api/notifications/${notification.id}/read`);
            setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
            if (!notification.isRead) {
                setUnreadCount(prev => prev - 1);
            }
            if (!notification.link) return;
            router.push(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${notification.link}`);
            setOpen(false);
        } catch {
            console.error('通知の既読処理に失敗しました');
        }
    }

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative p-2 bg-transparent"
                    aria-label="通知"
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1.5 bg-red-500 text-white text-xs rounded-full px-1 py-0.5 font-bold min-w-[18px] text-center">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[340px] p-0">
                <div className="px-4 py-3 border-b font-bold text-gray-700">通知</div>
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Spinner className="m-8 mx-auto" />
                    </div>
                ) : (
                    <div className="max-h-[320px] overflow-y-auto divide-y">
                        {notifications.length === 0 && (
                            <div className="py-8 text-center text-gray-400 text-sm">通知はありません</div>
                        )}
                        {notifications.map(n => (
                            <button
                                key={n.id}
                                className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-gray-50 transition"
                                onClick={() => handleNotificationClick(n)}
                            >
                                {n.isRead ? (
                                    <div className="w-2 h-2 rounded-full bg-transparent"></div>
                                ) : (
                                    <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                                )}
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-lg ">
                                    {n.icon ?? <Bell className='text-gray-500' />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-gray-800">{n.title}</div>
                                    <div className="text-xs text-gray-500">{n.message}</div>
                                    <div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
                                </div>
                            </button>
                        ))}
                        {hasMore && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full rounded-t-none"
                                onClick={() => fetchNotifications()}
                                disabled={loading}
                            >
                                もっと見る
                            </Button>
                        )}
                        {!hasMore && notifications.length > 0 && (
                            <div className="py-2 text-center text-gray-400 text-xs">すべて表示しました</div>
                        )}
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}



