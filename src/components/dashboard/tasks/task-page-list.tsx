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
            <div className="space-y-4 h-[320px] overflow-y-auto">
                {pageList.map(page => {
                    const total = page.end - page.start + 1;
                    const completedCount = page.completed.length;
                    const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;
                    return (
                        <div
                            key={page.id}
                            className="flex flex-col gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Dialog open={editOpenId === page.id} onOpenChange={open => setEditOpenId(open ? page.id : null)}>
                                <DialogTrigger asChild>
                                    <div
                                        className="flex items-center cursor-pointer"
                                        onClick={() => setEditOpenId(page.id)}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-sm text-gray-900 truncate">{page.title || `${page.start}〜${page.end}ページ`}</h4>
                                            <p className="text-xs text-gray-500">
                                                {page.start}〜{page.end}ページ
                                            </p>
                                        </div>
                                        <p className="mr-3 text-sm bg-teal-200 text-teal-700 px-2 rounded-sm">{percent}%</p>
                                        <Progress value={percent} className="h-2  w-[100px] sm:w-[150px] xl:w-[200px]" />
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
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-[180px] text-gray-400">
                <Meh className="h-10 w-10 mb-2" />
                <p>登録されているページはありません</p>
            </div>
        )
    );
}