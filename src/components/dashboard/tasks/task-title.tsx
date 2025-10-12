import { Badge } from "@/components/ui/badge"

type TaskTitleProps = {
    task: Task
}

export default function TaskTitle(props: TaskTitleProps) {

    const { task } = props;

    const getStatusBadge = (status: TaskStatus) => {
        switch (status) {
            case 'NOT_STARTED':
                return <Badge variant="outline" className="bg-gray-100 mr-2">未着手</Badge>;
            case 'IN_PROGRESS':
                return <Badge variant="outline" className="bg-blue-100 text-blue-700 mr-2">進行中</Badge>;
            case 'COMPLETED':
                return <Badge variant="outline" className="bg-green-100 text-green-700 mr-2">完了</Badge>;
        }
    };

    return (
        <div className="mb-4 border border-gray-200 rounded p-4 ">
            <div>
                {getStatusBadge(task.status)}
                {task.tags?.map((tag) => (
                    <Badge key={tag.name} className="mr-2 mt-2 bg-teal-500">#{tag.name}</Badge>
                ))}
            </div>
            
            <h1 className="text-2xl font-bold pt-4 pb-2">{task.title}</h1>
            <p className=" text-gray-600">{task.description}</p>
            <div className="flex">
                
            </div>
        </div>
    )
}