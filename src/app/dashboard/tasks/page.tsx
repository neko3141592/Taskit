'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Sort  {
    sortKey: string;
    sortOrder: 'asc' | 'desc';
}


export default function Tasks() {
    const [tasks, setTasks] = useState<Task[]>([]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get<APIResponse<Task[]>>('/api/tasks', {
                params: {

                }
            });
            const data = response.data.data;
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };
    useEffect(() => {
        fetchTasks();
    }, []);
    return (
        <div>
            
        </div>
    );
}