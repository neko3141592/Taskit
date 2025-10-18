

import { auth } from "@/../auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ListTodo } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cookies } from "next/headers";

type CountResponse = {
    totalTasks: number;
    completedTasks: number;
    notStartedTasks: number;
    inProgressTasks: number;
    completionRate: number;
}

export default async function StatisticalCard() {
    const session = await auth();
    const cookieStore = await cookies();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks/count?userId=${session?.user?.id}`, { cache: 'no-store', headers: { cookie: cookieStore.toString() } });
    const data: APIResponse<CountResponse> = await res.json();
    const stats = data.data;

    if (!stats) {
        return <div>データ取得エラー</div>;
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