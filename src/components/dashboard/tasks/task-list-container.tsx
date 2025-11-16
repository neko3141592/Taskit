'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import TaskFilters from "./task-filters";
import TaskListView from "./task-list-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListTodo } from "lucide-react";

type TaskFiltersType = {
    status: string;
    subjectId: string;
    tagId: string;
    search: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
};

const ITEMS_PER_PAGE = 10;

export default function TaskListContainer() {
    const { data: session } = useSession();
    const userId = session?.user?.id;

    const [tasks, setTasks] = useState<Task[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const [filters, setFilters] = useState<TaskFiltersType>({
        status: 'all',
        subjectId: 'all',
        tagId: 'all',
        search: '',
        sortBy: 'dueDate',
        sortOrder: 'asc',
    });


    useEffect(() => {
        const fetchSubjectsAndTags = async () => {
            if (!userId) return;
            try {
                const [subjectsRes, tagsRes] = await Promise.all([
                    axios.get<APIResponse<Subject[]>>('/api/subjects', {
                        params: { userId }
                    }),
                    axios.get<APIResponse<Tag[]>>('/api/tags', {
                        params: { userId }
                    })
                ]);
                setSubjects(subjectsRes.data.data);
                setTags(tagsRes.data.data);
            } catch (error) {
                console.error('Error fetching subjects and tags:', error);
            }
        };
        fetchSubjectsAndTags();
    }, [userId]);

    // タスク一覧を取得
    useEffect(() => {
        const fetchTasks = async () => {
            if (!userId) return;
            setIsLoading(true);
            try {
                const params: Record<string, string | number> = {
                    userId,
                    sort: filters.sortBy,
                    order: filters.sortOrder,
                    limit: ITEMS_PER_PAGE,
                    skip: (currentPage - 1) * ITEMS_PER_PAGE,
                };

                if (filters.status !== 'all') {
                    params.status = filters.status;
                }

                if (filters.subjectId !== 'all') {
                    params.subject = filters.subjectId;
                }

                if (filters.tagId !== 'all') {
                    params.tag = filters.tagId;
                }

                const res = await axios.get<APIResponse<{ tasks: Task[]; totalCount: number }>>('/api/tasks', {
                    params
                });

                let tasksData = res.data.data.tasks;
                const total = res.data.data.totalCount;

                if (filters.search) {
                    const searchLower = filters.search.toLowerCase();
                    tasksData = tasksData.filter(task =>
                        task.title.toLowerCase().includes(searchLower) ||
                        task.description?.toLowerCase().includes(searchLower)
                    );
                }

                setTasks(tasksData);
                setTotalCount(total);
                setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));
            } catch (error) {
                console.error('Error fetching tasks:', error);
                setTasks([]);
                setTotalCount(0);
                setTotalPages(0);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasks();
    }, [userId, filters.status, filters.subjectId, filters.tagId, filters.sortBy, filters.sortOrder, filters.search, currentPage]);

    const handleFilterChange = (newFilters: TaskFiltersType) => {
        setFilters(newFilters);
        setCurrentPage(1); 
    };

    const handleFilterReset = () => {
        setFilters({
            status: 'all',
            subjectId: 'all',
            tagId: 'all',
            search: '',
            sortBy: 'dueDate',
            sortOrder: 'asc',
        });
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="space-y-6">
            <Card className="border-neutral-200 dark:border-neutral-700 shadow-none">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
                        すべてのタスク
                        <span className="text-sm font-normal text-gray-500 dark:text-neutral-400 ml-2">
                            ({totalCount}件)
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 md:px-4 px-2">
                    <TaskFilters
                        subjects={subjects}
                        tags={tags}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onReset={handleFilterReset}
                    />

                    <div className="mt-6">
                        <TaskListView
                            tasks={tasks}
                            isLoading={isLoading}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
