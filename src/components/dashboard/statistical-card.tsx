'use client'

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ListTodo } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useFirebaseUser } from "@/hooks/use-firebase-user";
import Spinner from "../ui/spinner";
import axios from "axios";

type CountResponse = {
    totalTasks: number;
    completedTasks: number;
    notStartedTasks: number;
    inProgressTasks: number;
    completionRate: number;
}

const fetcher = async ([url, token]: [string, string]) => {
    const res = await axios.get<APIResponse<CountResponse>>(url, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.data;
};

export default function StatisticalCard() {
    const user = useFirebaseUser();

    const shouldFetch = !!user;

    const { data: stats, error, isLoading } = useSWR(
        shouldFetch ? ["/api/tasks/count", "token"] : null,
        async ([url]) => {
            const token = await user!.getIdToken();
            return fetcher([url, token]);
        },
        { revalidateOnFocus: false }
    );

    if (!shouldFetch || isLoading || !stats) {
        return <Spinner className="lex justify-center items-center min-h-[160px] w-full"/>;
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