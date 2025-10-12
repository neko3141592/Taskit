"use client";
import { Button } from "@/components/ui/button";
import { Plus, CheckIcon, Clock } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddPageDialog({
    onAdd,
    isLoading,
    pageInput,
    setPageInput,
    pageNumbers
}: {
    onAdd: () => void,
    isLoading: boolean,
    pageInput: {
        title: string,
        start: string,
        end: string,
        completed: number[]
    },
    setPageInput: React.Dispatch<React.SetStateAction<{
        title: string,
        start: string,
        end: string,
        completed: number[]
    }>>,
    pageNumbers: number[]
}) {
    const toggleCompleted = (pageNum: number) => {
        setPageInput((prev) => ({
            ...prev,
            completed: prev.completed.includes(pageNum)
                ? prev.completed.filter((n) => n !== pageNum)
                : [...prev.completed, pageNum],
        }));
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="shadow-none border-none bg-black text-white hover:bg-gray-800 hover:text-white rounded-full"
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        ページを追加
                    </DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        onAdd();
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
                    <DialogFooter className="pt-4">
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                キャンセル
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            className="gap-2 text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Clock className="h-4 w-4 animate-spin" />
                                    追加中...
                                </>
                            ) : (
                                <>
                                    <CheckIcon className="h-4 w-4" />
                                    追加
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}