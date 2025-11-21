'use client';

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Book, Plus, X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import axios from "axios";
import { useSession } from "next-auth/react";

type TestTasksProps = {
    readonly className?: string;
    readonly test: Test;
    readonly tasks: Task[];
    readonly onTasksChange: () => void;
};

export default function TestTasks({ className, test, tasks, onTasksChange }: TestTasksProps) {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
    const [totalAvailable, setTotalAvailable] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoadingAvailable, setIsLoadingAvailable] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 20;

    const fetchAvailableTasks = async (page = 1, search = "") => {
        if (!userId) return;
        setIsLoadingAvailable(true);
        try {
            const params: Record<string, string | number> = {
                userId,
                excludeTestId: test.id,
                limit: ITEMS_PER_PAGE,
                skip: (page - 1) * ITEMS_PER_PAGE,
            };
            
            if (search) {
                params.search = search;
            }

            const res = await axios.get<APIResponse<{tasks: Task[], totalCount: number}>>(`/api/tasks/`, {
                params
            });
            setAvailableTasks(res.data.data.tasks);
            setTotalAvailable(res.data.data.totalCount);
        } catch (error) {
            console.error('Error fetching available tasks:', error);
            setAvailableTasks([]);
            setTotalAvailable(0);
        } finally {
            setIsLoadingAvailable(false);
        }
    };

    useEffect(() => {
        if (isModalOpen) {
            const timer = setTimeout(() => {
                fetchAvailableTasks(currentPage, searchQuery);
            }, 300);
            return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, currentPage, isModalOpen]);

    const handleAddTask = async (taskId: string) => {
        try {
            await axios.patch(`/api/tasks/${taskId}`, {
                testId: test.id
            });
            toast.success("タスクを追加しました");
            onTasksChange();
            fetchAvailableTasks(currentPage, searchQuery);
        } catch (error) {
            console.error('Error adding task:', error);
            toast.error("タスクの追加に失敗しました");
        }
    };

    const handleRemoveTask = async (taskId: string) => {
        try {
            await axios.patch(`/api/tasks/${taskId}`, {
                testId: null
            });
            toast.success("タスクを削除しました");
            onTasksChange();
        } catch (error) {
            console.error('Error removing task:', error);
            toast.error("タスクの削除に失敗しました");
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
        setCurrentPage(1);
        setSearchQuery("");
    };

    const completedCount = tasks.filter(task => task.status === 'COMPLETED').length;
    const totalCount = tasks.length;
    const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    const totalPages = Math.ceil(totalAvailable / ITEMS_PER_PAGE);

    return (
        <>
        <div className="relative h-full">
            <Card className={`shadow-none border-neutral-200 dark:border-neutral-700 h-full ${className}`}>
                <CardContent className="py-0 px-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-sm border border-neutral-200 dark:border-neutral-700 text-center">
                            <p className="text-xs text-muted-foreground mb-2">完了タスク</p>
                            <p className="text-2xl font-bold font-mono">
                                {completedCount}
                                <span className="text-sm text-muted-foreground font-normal ml-1">/ {totalCount}</span>
                            </p>
                        </div>
                        <div className="p-4 rounded-sm border border-neutral-200 dark:border-neutral-700 text-center">
                            <p className="text-xs text-muted-foreground mb-2">進捗率</p>
                            <p className="text-2xl font-bold font-mono">
                                {Math.round(completionRate)}
                                <span className="text-sm text-muted-foreground font-normal">%</span>
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Progress value={completionRate} className="h-2" />
                        <p className="text-xs text-muted-foreground text-center">
                            {completedCount} / {totalCount} タスク完了
                        </p>
                    </div>

                    {tasks.length > 0 ? (
                        <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="group flex items-center gap-3 p-3 rounded-sm border border-neutral-200 dark:border-neutral-700 hover:border-teal-500 dark:hover:border-teal-500 transition-colors"
                                >
                                    {task.status === 'COMPLETED' ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                                    ) : (
                                        <Circle className="h-5 w-5 text-gray-300 dark:text-neutral-600 flex-shrink-0" />
                                    )}
                                    <div
                                        className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                                        style={{
                                            backgroundColor: `${task.subject?.color ?? "#E5E7EB"}22`,
                                        }}
                                    >
                                        <Book className="w-4 h-4" style={{ color: task.subject?.color ?? "#6366F1" }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={`text-sm font-medium truncate ${task.status === 'COMPLETED' ? 'text-muted-foreground line-through' : ''}`}>
                                            {task.title}
                                        </div>
                                        {task.description && (
                                            <div className={`text-xs truncate ${task.status === 'COMPLETED' ? 'text-muted-foreground/60' : 'text-muted-foreground'}`}>
                                                {task.description}
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveTask(task.id)}
                                        className="h-7 w-7 p-0 transition-opacity hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                        <X className="h-4 w-4  " />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                                <Plus className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium mb-1">タスクがありません</p>
                            <p className="text-xs text-muted-foreground">タスクを追加して進捗を管理しましょう</p>
                        </div>
                    )}
                </CardContent>
            </Card>
            <button
                onClick={openModal}
                className="absolute bottom-4 right-4 z-20 bg-teal-500 hover:bg-teal-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all"
                aria-label="タスクを追加"
                style={{ position: 'absolute' }}
            >
                <Plus className="h-6 w-6" />
            </button>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[600px] border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        タスクを追加
                    </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
                    <Input
                        placeholder="タスクを検索..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="shadow-none rounded-sm"
                    />

                    {isLoadingAvailable ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : availableTasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <p className="text-sm text-muted-foreground">追加できるタスクがありません</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                                {availableTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-center gap-3 p-3 rounded-sm border border-neutral-200 dark:border-neutral-700 hover:border-teal-500 transition-colors"
                                    >
                                        <div
                                            className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                                            style={{
                                                backgroundColor: `${task.subject?.color ?? "#E5E7EB"}22`,
                                            }}
                                        >
                                            <Book className="w-4 h-4" style={{ color: task.subject?.color ?? "#6366F1" }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium truncate">
                                                {task.title}
                                            </div>
                                            {task.description && (
                                                <div className="text-xs text-muted-foreground truncate">
                                                    {task.description}
                                                </div>
                                            )}
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => handleAddTask(task.id)}
                                            className="flex-shrink-0 shadow-none"
                                        >
                                            <Plus className="h-4 w-4 mr-1" />
                                            追加
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="gap-1 shadow-none"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        前へ
                                    </Button>
                                    <span className="text-sm text-muted-foreground">
                                        {currentPage} / {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="gap-1 shadow-none"
                                    >
                                        次へ
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
        </>
    );
}
