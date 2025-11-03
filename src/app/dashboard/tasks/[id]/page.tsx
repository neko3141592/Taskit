'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import TaskTitle from '@/components/dashboard/tasks/task-title';
import TaskPage from '@/components/dashboard/tasks/task-page';
import TaskDetails from '@/components/dashboard/tasks/task-details';
import Spinner from '@/components/ui/spinner';
import { useSession } from "next-auth/react"; 
import TaskSuggest from '@/components/dashboard/tasks/task-suggest';



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
                <TaskTitle task={task} />
                <div className="md:flex">
                    <div className="w-full md:w-2/3 md:mr-4">
                        <TaskPage pages={task.pages} taskId={task.id} />
                    </div>
                    <div className=" md:w-1/3 mt-4 md:mt-0">
                        <TaskSuggest />
                    </div>
                    
                </div>
            </div>
        );
    }

    return (
        <div>
            <p>Task not found</p>
        </div>
    );
}