'use client';

import { CalendarIcon } from "lucide-react";
import { getStatusBadge } from "@/components/ui/status-budge";
import Link from "next/link";

type TaskCardProps = {
    task: Task;
};

export default function TaskCard({ task }: TaskCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Link
            href={`/dashboard/tasks/${task.id}`}
            className="block"
        >
            <div className="flex items-center p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all duration-200 cursor-pointer">
                <div className="mr-3 flex-shrink-0">
                    <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: task.subject?.color || '#808080' }}
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">{task.title}</h4>
                    {task.description && (
                        <p className="text-xs text-gray-500 dark:text-neutral-400 truncate mt-1">{task.description}</p>
                    )}
                    {task.subject && (
                        <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">{task.subject.name}</p>
                    )}
                    {task.dueDate && (
                        <div className="flex md:hidden items-center text-xs text-gray-500 dark:text-neutral-400 mt-1">
                            <CalendarIcon className="mr-1 h-3 w-3" />
                            {formatDate(task.dueDate)}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                    {getStatusBadge(task.status)}
                    {task.dueDate && (
                        <div className="hidden md:flex items-center text-xs text-gray-500 dark:text-neutral-400">
                            <CalendarIcon className="mr-1 h-3 w-3" />
                            {formatDate(task.dueDate)}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
