'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import TaskTitle from '@/components/dashboard/tasks/task-title';
import TaskPage from '@/components/dashboard/tasks/task-page';
import Spinner from '@/components/ui/spinner';
import { useSession } from "next-auth/react"; 
import TaskSuggest from '@/components/dashboard/tasks/task-suggest';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from 'next/link';



export default function Task() {
    const { data: user } = useSession();
    const { id } = useParams();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchTask = async () => {
            setLoading(true);
            try {
                if (!id || !user) return;
                const res = await axios.get<APIResponse<Task | null>>(`/api/tasks/${id}`);
                setTask(res.data.data);

            } catch (error) {
                console.error('Error fetching task:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchTask();
    }, [id]);

    if (loading || !user || !id) {
        return (
            <div>
                <Spinner/>
            </div>
        );
    }

    if (task) {
        return (
            <div>
                <Breadcrumb className="mb-4">
                <BreadcrumbList>
                    <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard/tasks">タスク一覧</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                    <BreadcrumbPage>{task.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
                </Breadcrumb>
                <TaskTitle task={task} />
                <div className="md:flex">
                    <div className="w-full md:w-2/3 md:mr-4">
                        <TaskPage pages={task.pages} taskId={task.id} />
                    </div>
                    <div className=" md:w-1/3 mt-4 md:mt-0">
                        <TaskSuggest currentTask={task} />
                    </div>
                    
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">タスクが見つかりません</h2>
            <p className="text-gray-500 mb-4">指定されたタスクは存在しないか、削除された可能性があります。</p>
            <Link href="/dashboard/tasks" className="text-teal-500 hover:underline font-medium">
                タスク一覧に戻る
            </Link>
        </div>
    );
}