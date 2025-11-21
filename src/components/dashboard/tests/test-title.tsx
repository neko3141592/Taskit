import { MoreHorizontal, Calendar } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";

import SubjectBadge from "@/components/ui/subject-badge";
import { formatDateJST } from "@/lib/utils";
import UpdateTestDialog from "./update-test-dialog";


type TestTitleProps = {
    readonly test: Test;
    readonly className?: string;
}

export default function TestTitle({ test, className }: TestTitleProps) {

    const router = useRouter();
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const handleDelete = async () => {
        try {
            await axios.delete<APIResponse<undefined>>(`/api/tests/${test.id}`);
            toast.success("テストを削除しました");
            router.push('/dashboard/tests');
            setDeleteOpen(false);
        } catch (error) {
            console.error("Error deleting test:", error);
            toast.error("テストの削除中にエラーが発生しました");
        }
    };

    return (
        <div className={`mb-4 border-none rounded p-4 ${className}`}>
            <div className="flex justify-between items-start">
                <div>
                    <Calendar className="inline-block mr-2 h-5 w-5 text-gray-400" />
                    <span className="text-gray-600 text-sm">{formatDateJST(test.startDate)} ~ {formatDateJST(test.endDate)}</span>
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
            <div className="flex flex-wrap">
                {test.scores?.map((score) => (
                    <SubjectBadge key={score.id} subject={score.subject} />
                ))}
            </div>
            <h1 className="text-2xl font-bold pt-6 pb-2">{test.name}</h1>
            <p className=" text-gray-600 mt-1">{test?.description}</p>
            
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>テストを編集</DialogTitle>
                    </DialogHeader>
                    <UpdateTestDialog test={test} onClose={() => setEditOpen(false)} />
                </DialogContent>
            </Dialog>
            
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>テストを削除しますか？</DialogTitle>
                        <DialogDescription>この操作は取り消せません</DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            className="px-4 rounded-sm py-2 bg-gray-200 dark:bg-neutral-700 dark:text-white"
                            onClick={() => setDeleteOpen(false)}
                        >
                            キャンセル
                        </button>
                        <button
                            className="px-4 py-2 rounded-sm bg-red-500 text-white hover:bg-red-600"
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