'use client';

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Book, ArrowRight, Plus } from "lucide-react";
import axios from "axios";

type TestTasksProps = {
    className?: string;
    test: Test;
};

export default function TestTasks({ className, test }: TestTasksProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTasks() {
            if (!test.id) return;
            setLoading(true);
            try {
                const res = await axios.get<APIResponse<{tasks: Task[], totalCount: number}>>(`/api/tasks/`, {
                    params: { test: test.id },
                });
                setTasks(res.data.data.tasks); 
            } catch (error) {
                console.error('Error fetching tasks:', error);
                setTasks([]);
            } finally {
                setLoading(false);
            }
        }
        fetchTasks();
    }, [test.id]);

    const completedCount = tasks.filter(task => task.status === 'COMPLETED').length;
    const totalCount = tasks.length;
    const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <div className={`bg-white dark:bg-neutral-900 border border-gray-900/10 dark:border-neutral-700 rounded-sm w-full ${className}`}>
            <div className="px-6 py-6 border-b border-gray-900/5 dark:border-neutral-800">
                <div className="flex items-center justify-center gap-12 mb-6">
                    <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-neutral-400 font-medium mb-1.5">完了タスク</p>
                        <div className="flex items-baseline justify-center gap-2">
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                {completedCount}
                            </p>
                            <span className="text-lg font-normal text-gray-400 dark:text-neutral-500">/ {totalCount}</span>
                        </div>
                    </div>
                    <div className="w-px h-16 bg-gray-900/10 dark:bg-neutral-700" />
                    <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-neutral-400 font-medium mb-1.5">進捗率</p>
                        <div className="flex items-baseline justify-center gap-1">
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                {Math.round(completionRate)}
                            </p>
                            <span className="text-lg font-normal text-gray-400 dark:text-neutral-500">%</span>
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <Progress value={completionRate} className="h-2" />
                    <p className="text-xs text-gray-500 dark:text-neutral-400 text-center">
                        {completedCount} / {totalCount} タスク完了
                    </p>
                </div>
            </div>
            {loading ? (
                <div className="flex flex-col items-center justify-center h-[120px] bg-white dark:bg-neutral-900">
                    <p className="text-sm text-gray-500 dark:text-neutral-400">読み込み中...</p>
                </div>
            ) : tasks.length > 0 ? (
                <div className="px-4 py-2">
                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className="flex items-center gap-3 p-3 rounded-sm bg-white dark:bg-neutral-800 border hover:shadow-sm transition cursor-pointer border-gray-200 dark:border-neutral-700"
                            >
                                {task.status === 'COMPLETED' ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                                ) : (
                                    <Circle className="h-5 w-5 text-gray-300 dark:text-neutral-600 flex-shrink-0" />
                                )}
                                <div
                                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                                    style={{
                                        backgroundColor: `${task.subject?.color ?? "#E5E7EB"}22`,
                                    }}
                                >
                                    <Book className="w-5 h-5" style={{ color: task.subject?.color ?? "#6366F1" }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className={`text-base font-semibold truncate ${task.status === 'COMPLETED' ? 'text-gray-400 dark:text-neutral-500 line-through' : 'text-gray-800 dark:text-white'}`}>
                                        {task.title}
                                    </div>
                                    <div className={`text-xs truncate ${task.status === 'COMPLETED' ? 'text-gray-300 dark:text-neutral-600' : 'text-gray-500 dark:text-neutral-400'}`}>
                                        {task.description}
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400 dark:text-neutral-500" />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-[280px] bg-white dark:bg-neutral-900">
                    <div className="w-12 h-12 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Plus className="h-6 w-6 text-gray-400 dark:text-neutral-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">タスクがありません</p>
                    <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">最初のタスクを追加して進捗を確認しましょう</p>
                </div>
            )}
        </div>
    );
}