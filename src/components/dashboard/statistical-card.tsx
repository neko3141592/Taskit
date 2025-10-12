'use client'

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ListTodo } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import axios from "axios";
import { useFirebaseUser } from "@/hooks/use-firebase-user";

type CountResponse = {
    totalTasks: number;
    completedTasks: number;
    notStartedTasks: number;
    inProgressTasks: number;
    completionRate: number;
}

export default function StatisticalCard() {
    const [stats, setStats] = useState<CountResponse>({
        totalTasks: 0,
        completedTasks: 0,
        notStartedTasks: 0,
        inProgressTasks: 0,
        completionRate: 0,
    });
    const [loading, setLoading] = useState(true);

    const user = useFirebaseUser();

    useEffect(() => {
        if (!user) {
            return;
        }
        const fetchStats = async () => {
            setLoading(true);
            try {
                const token = await user.getIdToken();
                const res = await axios.get<APIResponse<CountResponse>>("/api/tasks/count",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const data = res.data.data;
                setStats({
                    totalTasks: data.totalTasks,
                    completedTasks: data.completedTasks,
                    notStartedTasks: data.notStartedTasks,
                    inProgressTasks: data.inProgressTasks,
                    completionRate: data.completionRate,
                });
            } catch (error) {
                setStats({
                    totalTasks: 0,
                    completedTasks: 0,
                    notStartedTasks: 0,
                    inProgressTasks: 0,
                    completionRate: 0,
                });
                console.log(error);
            }
            setLoading(false);
        };
        fetchStats();
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            {/* 総タスク数 */}
            <Card className="shadow-none">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">総タスク数</CardTitle>
                    <ListTodo className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalTasks}</div>
                    <p className="text-xs text-muted-foreground mt-1">登録済みのタスク</p>
                </CardContent>
            </Card>

            {/* 完了タスク数 */}
            <Card className="shadow-none">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">完了タスク数</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.completedTasks}</div>
                    <p className="text-xs text-muted-foreground mt-1">完了したタスク</p>
                </CardContent>
            </Card>

            {/* 未着手タスク数 */}
            <Card className="shadow-none">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">未着手</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.notStartedTasks}</div>
                    <p className="text-xs text-muted-foreground mt-1">未着手のタスク</p>
                </CardContent>
            </Card>

            {/* 進行中タスク数 */}
            <Card className="shadow-none">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">進行中</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.inProgressTasks}</div>
                    <p className="text-xs text-muted-foreground mt-1">進行中のタスク</p>
                </CardContent>
            </Card>

            {/* 完了率 */}
            <Card className="shadow-none">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">完了率</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.completionRate}%</div>
                    <Progress value={stats.completionRate} className="mt-2" />
                </CardContent>
            </Card>
        </div>
    )
}