import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, ListTodo, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

type StatisticalCardProps = {
    totalTasks: number;
    completedTasks: number;
    upcomingTasks: number;
    overdueTasks: number;
}

export default function StatisticalCard(props: StatisticalCardProps) {
    
    const { totalTasks, completedTasks, upcomingTasks, overdueTasks } = props;

    const completionRate = Math.round((completedTasks / totalTasks) * 100) || 0

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* 総タスク数 */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">総タスク数</CardTitle>
                    <ListTodo className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalTasks}</div>
                    <p className="text-xs text-muted-foreground mt-1">登録済みのタスク</p>
                </CardContent>
            </Card>

            {/* 完了率 */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">完了率</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{completionRate}%</div>
                <Progress value={completionRate} className="mt-2" />
                </CardContent>
            </Card>

            {/* 今週の予定 */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">今週の予定</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{upcomingTasks}</div>
                <p className="text-xs text-muted-foreground mt-1">今週期限のタスク</p>
                </CardContent>
            </Card>

            {/* 期限超過 */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">期限超過</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold text-red-500">{overdueTasks}</div>
                <p className="text-xs text-muted-foreground mt-1">期限を過ぎたタスク</p>
                </CardContent>
            </Card>
        </div>
    )
}