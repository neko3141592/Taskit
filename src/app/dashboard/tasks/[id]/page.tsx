'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useFirebaseUser } from '@/hooks/use-firebase-user';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';
import TaskTitle from '@/components/dashboard/tasks/task-title';
import TaskPage from '@/components/dashboard/tasks/task-page';

function Spinner() {
    return (
        <div className="flex justify-center items-center h-[320px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400" />
        </div>
    );
}

export default function Task() {

    const user = useFirebaseUser();
    const { id } = useParams();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        const fetchTask = async () => {
            setLoading(true);
            try {
                if (!id || !user) return;
                const res = await axios.get<APIResponse<Task | null>>(`/api/tasks/${id}`, 
                    {
                        headers: {
                            Authorization: `Bearer ${await user?.getIdToken()}`,
                        },
                    }
                );
                setTask(res.data.data);

            } catch (error) {
                console.error('Error fetching task:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchTask();
    }, [id, user]);

    if (loading || !user || !id) {
        return (
            <div>
                <Spinner />
            </div>
        );
    }

    if (task) {
        return (
            <div>
                <TaskTitle task={task} />
                <div className="flex">
                    <div className="w-full md:w-2/3">
                        <TaskPage pages={task.pages} taskId={task.id} />
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