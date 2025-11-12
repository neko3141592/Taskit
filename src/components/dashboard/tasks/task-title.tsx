import { useState } from "react";
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar, MoreHorizontal } from "lucide-react";
import { getStatusBadge } from "@/components/ui/status-budge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog,  DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UpdateTaskDialog from "./update-task-dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner"

type TaskTitleProps = {
    task: Task,
    className?: string,
}

export default function TaskTitle(props: TaskTitleProps) {
    const { task, className } = props;
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const router = useRouter();

    const getSubjectBadge = (subject?: Subject) => {
        if (!subject) return null;
        return (
            <Link href={`/dashboard/subjects/${subject.id}`} passHref>
                <Badge variant="outline" className=" text-black mr-2 h-6">
                    <div 
                        className="h-2 w-2 rounded-full" 
                        style={{ backgroundColor: task.subject?.color || '#808080' }} 
                    />
                    {subject.name}
                </Badge>
            </Link>
        );
    }

    const handleDelete =  async () => {
        try {
            const res = await axios.delete<APIResponse<undefined>>(`/api/tasks/${task.id}`);
            console.log(res);
            toast.success("タスクを削除しました");
            router.push('/dashboard/tasks');
            setDeleteOpen(false);
        } catch (error) {
            console.error("Error deleting task:", error);
            toast.error("タスクの削除中にエラーが発生しました");
            return;
        }
        
    };

    return (
        <div className={`mb-4 border-none rounded p-4 ${className}`}>
            <div className="flex justify-between items-start">
                <div>
                    {getSubjectBadge(task.subject)}
                    {getStatusBadge(task.status)}
                    <br />
                    {task.tags?.map((tag) => (
                        <Badge key={tag.name} className="mr-2 mt-2 bg-teal-500 h-6">#{tag.name}</Badge>
                    ))}
                    <p className="text-md mt-4">
                        <Calendar className="inline-block mr-2 h-4 w-4 " />{new Date(task.dueDate).toLocaleDateString('ja-JP')}
                    </p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="p-2">
                            <MoreHorizontal size={20} />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right">
                        <DropdownMenuItem onClick={() => setEditOpen(true)}>編集</DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-red-500 hover:!text-red-500"
                            onClick={() => setDeleteOpen(true)}
                        >
                            削除
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <h1 className="text-2xl font-bold pt-6 pb-2">{task.title}</h1>
            <p className=" text-gray-600 mt-1">{task.description}</p>
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>タスク編集</DialogTitle>
                    </DialogHeader>
                    <UpdateTaskDialog task={task} />
                </DialogContent>
            </Dialog>
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>タスクを削除しますか？</DialogTitle>
                        <DialogDescription>この操作は取り消せません</DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            className="px-4 rounded-sm py-2 bg-gray-200"
                            onClick={() => setDeleteOpen(false)}
                        >
                            キャンセル
                        </button>
                        <button
                            className="px-4 py-2 rounded-sm bg-red-500 text-white"
                            onClick={handleDelete}
                        >
                            削除
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}