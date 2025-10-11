import RecentlyTasks from "@/components/dashboard/recently-tasks";
import StatisticalCard from "@/components/dashboard/statistical-card";

export default function Dashboard() {

    const taskStats = {
        totalTasks: 15,
        completedTasks: 7,
        upcomingTasks: 4, 
        overdueTasks: 2
    };

    return (
        <div>
            {/* 統計カード */}
            <StatisticalCard 
                totalTasks={taskStats.totalTasks}
                completedTasks={taskStats.completedTasks}
                upcomingTasks={taskStats.upcomingTasks}
                overdueTasks={taskStats.overdueTasks}
            />
            {/* 最近のタスク */}
            <RecentlyTasks />
        </div>
    ); 
}