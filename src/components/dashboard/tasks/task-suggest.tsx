"use client"

import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast }from 'sonner';
import { Book, RefreshCw, ArrowRight, Loader2 } from "lucide-react";
import { set } from "date-fns";
import { se } from "date-fns/locale";

type TaskSuggestProps = {
    currentTask: Task;
};

export default function TaskSuggest({ currentTask }: TaskSuggestProps) {

    const [suggestions, setSuggestions] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSuggestedTasks();
    }, []);

    const fetchSuggestedTasks = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post<APIResponse<Task[]>>('/api/generate/nexttasks', {
                currentTask,
            });
            setSuggestions(response.data.data);
            console.log("Suggested tasks:", response.data.data);
        } catch (error) {
            toast.error("提案タスクの取得に失敗しました");
            console.error("Error fetching suggested tasks:", error);
            setSuggestions([]);
            setError("エラーが発生しました");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="w-full shadow-none h-full">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-700">
                    次のタスクの提案
                    <button
                        className="ml-2 p-1 rounded hover:bg-indigo-100 transition"
                        onClick={fetchSuggestedTasks}
                        disabled={loading}
                        aria-label="リロード"
                        type="button"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? " text-gray-400" : "text-black"}`} />
                    </button>
                </CardTitle>
                <CardDescription>次に取り組むべきタスクを提案します。</CardDescription>
            </CardHeader>
            <CardContent className="p-0 mt-0">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                        <Loader2 className="w-6 h-6 animate-spin mb-2" />
                    </div>
                ) : suggestions.length > 0 ? (
                    <div className="space-y-3 px-4 py-2">
                        {suggestions.map((task, i) => (
                            <div
                                key={task.id}
                                className="flex items-center gap-3 p-3 rounded-lg bg-white shadow hover:shadow-md transition cursor-pointer border border-gray-100"
                                style={{
                                    animation: `fadeUp 0.5s ease ${i * 0.15}s both`
                                }}
                                onClick={() => window.location.href = `/dashboard/tasks/${task.id}`}
                            >
                                <div
                                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                                    style={{
                                        backgroundColor: `${task.subject?.color ?? "#E5E7EB"}22`,
                                    }}
                                >
                                    <Book className="w-5 h-5" style={{ color: task.subject?.color ?? "#6366F1" }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-base font-semibold text-gray-800 truncate">{task.title}</div>
                                    <div className="text-xs text-gray-500 truncate">{task.description}</div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-indigo-500" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 text-center text-sm text-gray-500">
                        {error ? (
                            <p>{error}</p>
                        ) : (
                            <p>提案できるタスクがありません。</p>
                        )}
                    </div>

                )}
            </CardContent>
            <CardFooter>
            </CardFooter>
        </Card>
    );
}