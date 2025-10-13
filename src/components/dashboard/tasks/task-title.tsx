import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar} from "lucide-react";
import { getStatusBadge } from "@/components/ui/status-budge";

type TaskTitleProps = {
    task: Task,
    className?: string,
}

export default function TaskTitle(props: TaskTitleProps) {

    const { task, className } = props;

    const getSubjectBadge = (subject?: Subject) => {
        if (!subject) return null;
        return (
            <Link href={`/dashboard/subjects/${subject.id}`} passHref>
                <Badge variant="outline" className=" text-black mr-2 h-6">
                    <div 
                        className="h-2 w-2 rounded-full" 
                        style={{ backgroundColor: task.subject?.color || '#808080' }} 
                    />
                    {subject.name}
                </Badge>
            </Link>
        );
    }

    return (
        <div className={`mb-4 border border-gray-200 rounded p-4 ${className}`}>
            <div>
                {getSubjectBadge(task.subject)}
                {getStatusBadge(task.status)}
                <br />
                {task.tags?.map((tag) => (
                    <Badge key={tag.name} className="mr-2 mt-2 bg-teal-500 h-6">#{tag.name}</Badge>
                ))}
                <p className="text-md mt-4">
                <Calendar className="inline-block mr-2 h-4 w-4 " />{new Date(task.dueDate).toLocaleDateString('ja-JP')}
                </p>
            </div>
            
            <h1 className="text-2xl font-bold pt-6 pb-2">{task.title}</h1>
            <p className=" text-gray-600 mt-1">{task.description}</p>
        </div>
    )
}