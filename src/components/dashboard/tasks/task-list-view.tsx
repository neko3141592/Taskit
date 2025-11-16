'use client';

import TaskCard from "./task-card";
import Spinner from "@/components/ui/spinner";
import { Meh } from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

type TaskListProps = {
    tasks: Task[];
    isLoading: boolean;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export default function TaskListView({ tasks, isLoading, currentPage, totalPages, onPageChange }: TaskListProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <Spinner />
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[400px] text-gray-400 dark:text-neutral-500">
                <Meh className="h-10 w-10 mb-2" />
                <p>タスクが見つかりませんでした</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="space-y-3">
                {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => {
                                        if (currentPage > 1) {
                                            onPageChange(currentPage - 1);
                                        }
                                    }}
                                    className={`cursor-pointer dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white ${
                                        currentPage === 1 ? "pointer-events-none opacity-50" : ""
                                    }`}
                                />
                            </PaginationItem>


                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                const showPage = 
                                    page === 1 || 
                                    page === totalPages || 
                                    (page >= currentPage - 1 && page <= currentPage + 1);
                                
                                const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
                                const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2;

                                if (showEllipsisBefore || showEllipsisAfter) {
                                    return (
                                        <PaginationItem key={`ellipsis-${page}`}>
                                            <PaginationEllipsis className="dark:text-neutral-500" />
                                        </PaginationItem>
                                    );
                                }

                                if (!showPage) return null;

                                return (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            onClick={() => onPageChange(page)}
                                            isActive={currentPage === page}
                                            className={`cursor-pointer dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white ${
                                                currentPage === page 
                                                    ? "bg-black text-white dark:bg-white dark:text-black hover:bg-black dark:hover:bg-white" 
                                                    : ""
                                            }`}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => {
                                        if (currentPage < totalPages) {
                                            onPageChange(currentPage + 1);
                                        }
                                    }}
                                    className={`cursor-pointer dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white ${
                                        currentPage === totalPages ? "pointer-events-none opacity-50" : ""
                                    }`}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}
