import { CalendarIcon } from "lucide-react";
import { getStatusBadge } from "@/components/ui/status-budge";
import Link from "next/link";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import Spinner from "../ui/spinner";



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

    

    const { tasks, currentPage, totalCount, totalPages, setCurrentPage, isLoading } = props;

    return (
        <div className="py-4 h-[400px]">
            <div className="space-y-4 h-[320px]">
                {isLoading ? (
                    <Spinner/>
                ) : tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <p className="text-center text-gray-500">最近のタスクはありません</p>
                    </div>
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

            {totalPages > 0 && (
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
            )}
        </div>
    );
}