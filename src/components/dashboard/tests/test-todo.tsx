'use client';

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Calendar } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import Spinner from "@/components/ui/spinner";

type Props = {
    readonly test: Test;
};

export default function TestTodo({ test }: Props) {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchTodos = async () => {
        setLoading(true);
        try {
            const response = await axios.get<APIResponse<Todo[]>>(`/api/tests/todos?testId=${test.id}`);
            if (response.data.status === 'success') {
                setTodos(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch todos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, [test.id]);

    const handleToggle = async (todo: Todo) => {
        const newCompleted = !todo.completed;
        
        setTodos(prev => prev.map(t => 
            t.id === todo.id ? { ...t, completed: newCompleted } : t
        ));

        try {
            await axios.patch(`/api/tests/todos/${todo.id}`, {
                completed: newCompleted
            });
        } catch (error) {
            console.error("Failed to update todo:", error);
            toast.error("Todoの更新に失敗しました");
            setTodos(prev => prev.map(t => 
                t.id === todo.id ? { ...t, completed: !newCompleted } : t
            ));
        }
    };

    if (loading) {
        return (
            <Card className="shadow-none border-neutral-200 dark:border-neutral-700">
                <CardContent className="pt-6">
                    <div className="text-center py-8">
                        <Spinner />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (todos.length === 0) {
        return (
            <Card className="shadow-none border-neutral-200 dark:border-neutral-700">
                <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground text-center py-8">
                        Todoがありません
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-none border-neutral-200 dark:border-neutral-700">
            <CardContent className="pt-6">
                <div className="space-y-2">
                    {todos.map((todo) => (
                        <div
                            key={todo.id}
                            className="border border-border rounded-sm p-3 bg-muted/20 hover:bg-muted/30 transition-colors"
                        >
                            <div className="flex items-start gap-3">
                                <Checkbox
                                    checked={todo.completed}
                                    onCheckedChange={() => handleToggle(todo)}
                                    className="mt-1"
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className={`font-medium text-sm mb-1 ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                                        {todo.title}
                                    </h4>
                                    {todo.description && (
                                        <p className={`text-xs leading-relaxed mb-2 ${todo.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                                            {todo.description}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            <span className="font-mono">{todo.estimatedMinutes}分</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            <span className="font-mono">
                                                {new Date(todo.dueDate).toLocaleDateString('ja-JP')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
