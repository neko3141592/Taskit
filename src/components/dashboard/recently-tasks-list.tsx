import { CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"


function Spinner() {
    return (
        <div className="flex justify-center items-center h-[320px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400" />
        </div>
    );
}

type RecentlyTasksListProps = {
    tasks: Task[],
    currentPage: number,
    totalCount: number,
    totalPages: number,
    setCurrentPage: (page: number) => void,
    isLoading: boolean,
}

export default function RecentlyTasksList(props: RecentlyTasksListProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
        });
    };

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

    const { tasks, currentPage, totalCount, totalPages, setCurrentPage, isLoading } = props;

    return (
        <div className="py-4 h-[400px]">
            <div className="space-y-4 h-[320px]">
                {isLoading ? (
                    <Spinner />
                ) : (
                    tasks.map(task => (
                        <Link
                            key={task.id}
                            href={`/dashboard/tasks/${task.id}`}
                            className="block"
                        >
                            <div className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
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
                                            {formatDate(task.dueDate)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
            <Pagination className="mt-4">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious 
                            onClick={() => {
                                if (currentPage > 1) {
                                    setCurrentPage(currentPage - 1)
                                }
                            }}  
                        />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink >{currentPage}</PaginationLink>
                        <PaginationLink >/</PaginationLink>
                        <PaginationLink >{totalPages}</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        {/* <PaginationEllipsis /> */}
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext 
                            onClick={() => {
                                if (currentPage < totalPages) {
                                    setCurrentPage(currentPage + 1)
                                }
                            }} 
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}