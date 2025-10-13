import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar} from "lucide-react";
import { getStatusBadge } from "@/components/ui/status-budge";


type taskCardsProps = {
    tasks: Task[];
    className?: string;
    onTaskClick?: (task: Task) => void;
}

export default function TaskCards(props: taskCardsProps) {

    const { tasks, className, onTaskClick } = props;
    

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
        });
    };

    
    return (
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${className}`}>
            {tasks.map((task) => (
                <Card key={task.id} onClick={() => onTaskClick?.(task)} className="shadow-xs hover:border-teal-500 cursor-pointer transition-all">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <CardTitle>{task.title}</CardTitle>
                            <div>{getStatusBadge(task.status)}</div>
                        </div>
                        <div className="flex space-x-2 ">
                            {task.tags?.map((tag) => (
                                <Badge key={tag.name} className="mr-2 bg-teal-500 h-6">#{tag.name}</Badge>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="flex items-center">
                        <Calendar className="inline-block mr-2 h-4 w-4 text-gray-400" />
                        <p className="text-gray-600 text-sm">{formatDate(task.dueDate)}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}