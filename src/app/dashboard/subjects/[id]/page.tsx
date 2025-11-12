'use client'

import { useEffect, useState } from "react";
import { Book } from 'lucide-react';
import TaskCards from '@/components/ui/task-cards';
import Spinner from "@/components/ui/spinner";
import { SubjectChart } from "@/components/dashboard/subjects/subject-chart";

type Props = {
    params: { id: string }
};

export default function Subject({ params }: Props) {
    const [subject, setSubject] = useState<Subject | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSubject = async () => {
            try {
                const res = await fetch(`/api/subjects/${params.id}`);
                const data: APIResponse<Subject | null> = await res.json();
                setSubject(data.data);
            } catch (e) {
                setError('データ取得エラー');
            }
        };
        fetchSubject();
    }, [params.id]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!subject) {
        return <Spinner />;
    }

    return (
        <div className="p-4">
            <div className="flex items-center gap-4 pb-8">
                <div className="p-3 rounded-full" style={{ backgroundColor: `${subject?.color}20` }}>
                    <Book className="h-6 w-6" style={{ color: subject?.color || '#808080' }} />
                </div>
                <h1 className="text-xl font-bold">{subject?.name}</h1>
            </div>
            <SubjectChart subjectId={subject.id} />
            <TaskCards 
                tasks={subject?.tasks || []}
                className="mt-6"
                onTaskClick={(task) => {
                    window.location.href = `/dashboard/tasks/${task.id}`;
                }}
            />
        </div>
    );
}