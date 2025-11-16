'use client';

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Meh, ChevronRight } from "lucide-react";
import TaskPageEditDialog from "./task-page-edit-dialog";

type TaskPageListProps = {
    pageList: TaskPage[];
    setPageList: React.Dispatch<React.SetStateAction<TaskPage[]>>;
    onEdit: (updatedPage: TaskPage) => void;
    onDelete: (pageId: string) => void;
}

export default function TaskPageList({ pageList, setPageList, onEdit, onDelete }: TaskPageListProps) {
    const [editOpenId, setEditOpenId] = useState<string | null>(null);

    return (
        pageList.length > 0 ? (
            <div className="space-y-3 overflow-y-auto max-h-[380px] pr-2">
                {pageList.map(page => {
                    const total = page.end - page.start + 1;
                    const completedCount = page.completed.length;
                    const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;
                    const barColor = percent === 100 ? "#10b981" : "#06b6d4"; 
                    return (
                        <div
                            key={page.id}
                            className="group flex flex-col gap-3 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-gradient-to-r hover:from-slate-50 dark:hover:from-neutral-800/50 hover:to-transparent transition-all duration-200 cursor-pointer relative overflow-hidden"
                        >
                            <div
                                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                style={{
                                    background: `linear-gradient(135deg, ${barColor}08 0%, transparent 100%)`
                                }}
                            />
                            
                            <Dialog open={editOpenId === page.id} onOpenChange={open => setEditOpenId(open ? page.id : null)}>
                                <DialogTrigger asChild>
                                    <div
                                        className="flex items-center justify-between relative z-10"
                                        onClick={() => setEditOpenId(page.id)}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{page.title || `${page.start}〜${page.end}ページ`}</h4>
                                            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                                                {page.start}〜{page.end}ページ
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3 ml-4">
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{percent}%</p>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-gray-400 dark:text-neutral-500 group-hover:text-gray-600 dark:group-hover:text-neutral-300 transition-colors" />
                                        </div>
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[400px] dark:bg-neutral-900 dark:border-neutral-700">
                                    <TaskPageEditDialog 
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        pageList={pageList}
                                        setPageList={setPageList}
                                        pageId={page.id}
                                    />
                                </DialogContent>
                            </Dialog>

                            <div className="w-full h-2 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden relative z-10">
                                <div
                                    className="h-full rounded-full transition-all duration-300"
                                    style={{
                                        width: `${percent}%`,
                                        background: `linear-gradient(90deg, ${barColor}, ${barColor}dd)`
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-[180px] text-gray-400 dark:text-neutral-500">
                <Meh className="h-10 w-10 mb-2" />
                <p>登録されているページはありません</p>
            </div>
        )
    );
}