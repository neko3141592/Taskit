"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon, Clock, Pencil, Ellipsis } from "lucide-react";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label";


type EditPageDialogProps = {
    onEdit: (updatedPage: TaskPage) => void,
    onDelete: (pageId: string) => void,
    pageList: TaskPage[],
    setPageList: React.Dispatch<React.SetStateAction<TaskPage[]>>,
    pageId: string
}
    

export default function EditPageDialog({
    onEdit,
    onDelete,
    pageList,
    setPageList,
    pageId
}: EditPageDialogProps ) {
    const page = pageList.find(p => p.id === pageId);

    const [pageInput, setPageInput] = useState<{
        title?: string, start: string, end: string, completed: number[]
    }>({
        title: "",
        start: "",
        end: "",
        completed: [] as number[],
    });
    const [isLoading, setIsLoading] = useState(false);

    // 編集開始時に値をセット
    useEffect(() => {
        if (page) {
            setPageInput({
                title: page.title,
                start: String(page.start),
                end: String(page.end),
                completed: [...page.completed],
            });
        }
    }, [pageId, page]);

    const toggleCompleted = (num: number) => {
        setPageInput(prev => ({
            ...prev,
            completed: prev.completed.includes(num)
                ? prev.completed.filter(n => n !== num)
                : [...prev.completed, num],
        }));
    };

    const pageNumbers =
        pageInput.start && pageInput.end
            ? Array.from(
                  { length: Number(pageInput.end) - Number(pageInput.start) + 1 },
                  (_, i) => Number(pageInput.start) + i
              )
            : [];

    const handleEdit = () => {
        setIsLoading(true);
        const updatedPage: TaskPage = {
            ...page!,
            title: pageInput.title,
            start: Number(pageInput.start),
            end: Number(pageInput.end),
            completed: pageInput.completed.sort((a, b) => a - b),
        };
        setPageList(prev =>
            prev.map(p => (p.id === pageId ? updatedPage : p))
        );
        onEdit(updatedPage);
        setIsLoading(false);
    };


    return (
        <div>
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Ellipsis className="h-5 w-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem 
                                className="text-red-500"
                                onClick={() => {
                                    onDelete(pageId);
                                }}
                            >ページの削除</DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </DialogTitle>
            </DialogHeader>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    handleEdit();
                }}
                className="space-y-5 py-2"
            >
                <div className="space-y-2">
                    <input
                        id="title"
                        placeholder="タイトルを入力...(任意)"
                        value={pageInput.title}
                        onChange={e => setPageInput({ ...pageInput, title: e.target.value })}
                        className="w-full shadow-none border-none pl-0 text-xl font-semibold focus:outline-none focus:ring-0"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-sm font-medium">ページ範囲</Label>
                    <div className="flex gap-2 items-center">
                        <Input
                            type="number"
                            placeholder="開始"
                            value={pageInput.start}
                            onChange={e => setPageInput({ ...pageInput, start: e.target.value })}
                            className="w-20"
                        />
                        <span>〜</span>
                        <Input
                            type="number"
                            placeholder="終了"
                            value={pageInput.end}
                            onChange={e => setPageInput({ ...pageInput, end: e.target.value })}
                            className="w-20"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-sm font-medium">完了済み（クリックで選択）</Label>
                    <div
                        className="flex flex-wrap gap-2 rounded "
                        style={{ maxHeight: 250, overflowY: "auto" }}
                    >
                        {pageNumbers.map((num) => (
                            <button
                                type="button"
                                key={num}
                                className={`px-2 py-1 rounded border ${pageInput.completed.includes(num) ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                                onClick={() => toggleCompleted(num)}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>
                <DialogFooter className="pt-4 flex gap-2">
                    <DialogClose asChild>
                        <Button variant="outline" type="button">
                            キャンセル
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button
                            type="submit"
                            className="gap-2 text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Clock className="h-4 w-4 animate-spin" />
                                    保存中...
                                </>
                            ) : (
                                <>
                                    <CheckIcon className="h-4 w-4" />
                                    保存
                                </>
                            )}
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        
                    </DialogClose>
                </DialogFooter>
            </form>
        </div>
    );
}