import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";
import  AddPageDialog  from "@/components/dashboard/tasks/task-page-add-dialog";
import TaskPageList from "@/components/dashboard/tasks/task-page-list";


type TaskPageProps = {
    pages?: TaskPage[];
    taskId: string;
}

export default function TaskPage(props: TaskPageProps) {
    const [pageInput, setPageInput] = useState({
        title: '',
        start: '',
        end: '',
        completed: [] as number[],
    });
    const [editInput, setEditInput] = useState({
        title: "",
        start: "",
        end: "",
        completed: [] as number[],
    });

    const { pages, taskId } = props;
    const [pageList, setPageList] = useState<TaskPage[]>(pages ?? []);
    const [isLoading, setIsLoading] = useState(false);

    const startNum = Number(pageInput.start) || 1;
    const endNum = Number(pageInput.end) || startNum;
    const pageNumbers = Array.from(
        { length: endNum - startNum + 1 },
        (_, i) => startNum + i
    );

    const validatePageInput = () => {
        if (isNaN(Number(pageInput.start))) {
            toast.error("開始ページを入力してください");
            return false;
        }
        if (isNaN(Number(pageInput.end))) {
            toast.error("終了ページを入力してください");
            return false;
        }
        if (Number(pageInput.start) < 1) {
            toast.error("ページを正しく入力してください");
            return false;
        }
        if (Number(pageInput.end) < Number(pageInput.start)) {
            toast.error("ページを正しく入力してください");
            return false;
        }
        return true;
    };

    const handleAddPage = async () => {
        if (!validatePageInput()) {
            return;
        }
        const newPage: TaskPage = {
            id: Math.random().toString(36).slice(2),
            title: pageInput.title,
            start: Number(pageInput.start),
            end: Number(pageInput.end),
            completed: pageInput.completed.sort((a, b) => a - b),
        };
        setIsLoading(true);
        setPageList([...pageList, newPage]);

        try {
            await axios.patch(`/api/tasks/${taskId}`, {
                pages: [...pageList, newPage]
            });
            toast.success("ページを追加しました");
            setPageInput({ title: '', start: '', end: '', completed: [] });
            setIsLoading(false);
        } catch (error) {
            console.error("Error adding page:", error);
            toast.error("ページの追加に失敗しました");
            setIsLoading(false);
            return;
        }
    };

    const deleteOutOfIndex = (page: TaskPage) => {
        const updatedCompleted = page.completed.filter(num => num >= page.start && num <= page.end);
        return { ...page, completed: updatedCompleted };
    }

    const handleEditPage = async (updatedPage: TaskPage) => {
        updatedPage = deleteOutOfIndex(updatedPage);
        const updatedPages = pageList.map((page) => 
            page.id === updatedPage.id ? updatedPage : page
        );
        setPageList(updatedPages);
        try {
            await axios.patch(`/api/tasks/${taskId}`, {
                pages: updatedPages
            });
            toast.success("ページを更新しました");
        } catch (error) {
            console.error("Error updating page:", error);
            toast.error("ページの更新に失敗しました");
            return;
        }
    };

    const handleDeletePage = async (pageId: string) => {
        const updatedPages = pageList.filter((page) => page.id !== pageId);
        setPageList(updatedPages);
        try {
            await axios.patch(`/api/tasks/${taskId}`, {
                pages: updatedPages
            });
            toast.success("ページを削除しました");
        } catch (error) {
            console.error("Error deleting page:", error);
            toast.error("ページの削除に失敗しました");
            return;
        }   
    };

    return (
        <Card className="w-full shadow-none min-h-[350px] relative">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    登録されているページ
                </CardTitle>
            </CardHeader>
            <CardContent>
                <TaskPageList 
                    onDelete={handleDeletePage}
                    pageList={pageList} 
                    setPageList={setPageList}
                    onEdit={handleEditPage}
                />
            </CardContent>
            <CardFooter className="absolute bottom-4 right-4 p-0">
                <AddPageDialog
                    onAdd={handleAddPage}
                    isLoading={isLoading}
                    pageInput={pageInput}
                    setPageInput={setPageInput}
                    pageNumbers={pageNumbers}
                />
            </CardFooter>
        </Card>
    );
}