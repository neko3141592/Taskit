import { CalendarIcon, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type RecentlyTasksListProps = {
    tasks: Task[]
}


export default function RecentlyTasksList(props: RecentlyTasksListProps) {

    const getStatusBadge = (status: TaskStatus) => {
        switch (status) {
            case 'NOT_STARTED':
            return <Badge variant="outline" className="bg-gray-100">未着手</Badge>;
            case 'IN_PROGRESS':
            return <Badge variant="outline" className="bg-blue-100 text-blue-700">進行中</Badge>;
            case 'COMPLETED':
            return <Badge variant="outline" className="bg-green-100 text-green-700">完了</Badge>;
        }
    };

    
    const { tasks } = props;
    return (
        <div className="space-y-4">
            {tasks.map(task => (
                <div key={task.id} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="mr-3">
                    <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: task.subject?.color || '#808080' }} 
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 truncate">{task.title}</h4>
                    {task.description && (
                    <p className="text-xs text-gray-500 truncate">{task.description}</p>
                    )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {getStatusBadge(task.status)}
                    {task.dueDate && (
                    <div className="flex items-center text-xs text-gray-500">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        {task.dueDate.toLocaleDateString()}
                    </div>
                    )}
                </div>
                </div>
            ))}
        </div>
    );
}