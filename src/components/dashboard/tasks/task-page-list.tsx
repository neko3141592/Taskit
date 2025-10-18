'use client';

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Meh } from "lucide-react";
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
            <div className="space-y-4  overflow-y-auto max-h-[380px]">
                {pageList.map(page => {
                    const total = page.end - page.start + 1;
                    const completedCount = page.completed.length;
                    const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;
                    const barColor = percent === 100 ? "#6ee7b7" : "#99f6e4"; 
                    return (
                        <div
                            key={page.id}
                            className="flex flex-col gap-2 p-2 rounded-sm border  hover:bg-gray-50 transition-colors  px-4 py-3  relative"
                            style={{
                                background: `linear-gradient(90deg, ${barColor} ${percent}%, #f3f4f6 ${percent}%)`
                            }}
                        >
                            <Dialog open={editOpenId === page.id} onOpenChange={open => setEditOpenId(open ? page.id : null)}>
                                <DialogTrigger asChild>
                                    <div
                                        className="flex items-center cursor-pointer bg-transparent"
                                        onClick={() => setEditOpenId(page.id)}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-sm text-gray-900 truncate">{page.title || `${page.start}〜${page.end}ページ`}</h4>
                                            <p className="text-xs text-gray-500">
                                                {page.start}〜{page.end}ページ
                                            </p>
                                        </div>
                                        <p className="mr-3 text-sm  px-2 rounded-sm">{percent}%</p>
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[400px]">
                                    <TaskPageEditDialog 
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        pageList={pageList}
                                        setPageList={setPageList}
                                        pageId={page.id}
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>
                    );
                })}
                {pageList.length > 5 && (
                    <div className="absolute bottom-0 left-0 w-full flex flex-col items-center pointer-events-none">
                        {/* フェードエフェクト */}
                        <div className="w-full h-8 bg-gradient-to-t from-gray-100 to-transparent" />
                        {/* ヒントテキスト */}
                        <div className="text-xs text-gray-400 mb-2 -mt-6 z-10">
                            ▼
                        </div>
                    </div>
        )}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-[180px] text-gray-400">
                <Meh className="h-10 w-10 mb-2" />
                <p>登録されているページはありません</p>
            </div>
        )
    );
}