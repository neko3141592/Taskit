import RecentlyTasks from "@/components/dashboard/recently-tasks";
import StatisticalCard from "@/components/dashboard/statistical-card";
import NextTest from "@/components/dashboard/next-test";


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
            <div className="flex flex-col md:flex-row gap-4">
                <RecentlyTasks />
                <NextTest />
            </div>
            
        </div>
    ); 
}