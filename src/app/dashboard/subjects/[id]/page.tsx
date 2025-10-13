'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFirebaseUser } from '@/hooks/use-firebase-user';
import axios from 'axios';
import { Book } from 'lucide-react';
import TaskCards from '@/components/ui/task-cards';
import Spinner from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';

export default function Subject() {
    const { id } = useParams();
    const user = useFirebaseUser();
    const [ loading, setLoading ] = useState(true);
    const [ subject, setSubject ] = useState<Subject | null>(null);
    const router = useRouter();


    useEffect(() => {
        if (!user || !id) return;
        const fetchSubject = async () => {
            setLoading(true);
            try {
                const res = await axios.get<APIResponse<Subject | null>>(`/api/subjects/${id}`,
                    { headers: { "Authorization": `Bearer ${await user.getIdToken()}` } }
                );
                setSubject(res.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchSubject();
    }, [user, id]);

    if (loading) {
        return <Spinner  />;
    }

    return (
        <div className="p-4">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-full" style={{ backgroundColor: `${subject?.color}20` }}>
                    <Book className="h-6 w-6" style={{ color: subject?.color || '#808080' }} />
                </div>
                <h1 className="text-xl font-bold">{subject?.name}</h1>
                
            </div>
            <TaskCards 
                tasks={subject?.tasks || []}
                className="mt-6"
                onTaskClick={(task) => {
                    router.push(`/dashboard/tasks/${task.id}`);
                }}
            />
        </div>
    );
}
