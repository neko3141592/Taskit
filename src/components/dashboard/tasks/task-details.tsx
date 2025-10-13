import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, BookOpen, CheckCircle2, Clock, RotateCw } from "lucide-react";

type TaskDetailsProps = {
    task: Task;
}



export default function TaskDetails(props: TaskDetailsProps) {
    const { task } = props;
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "COMPLETED";
    return (
        <Card className="w-full shadow-none h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    詳細
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">作成日:</span> {new Date(task.createdAt).toLocaleDateString('ja-JP')}
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <RotateCw className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">最終更新日:</span> {new Date(task.updatedAt).toLocaleDateString('ja-JP')}
                </div>
                <div className="mb-2">
                    <span className="font-medium">タスクID:</span> {task.id}
                </div>
            </CardContent>
            <CardFooter>
                {/* 進捗バーやアクションボタンなど追加可能 */}
            </CardFooter>
        </Card>
    );
}