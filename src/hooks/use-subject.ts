import { useState, useEffect } from 'react'
import axios from 'axios';

export function useSubject (userId?: string) {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userId) return;
        setLoading(true);

        const fetchSubjects = async () => {
            try {
                const res = await axios.get<APIResponse<{data: Subject[]}>>('/api/subjects', {
                    params: { userId }
                });
                const data = res.data.data;
                if (data && Array.isArray(data)) {
                    setSubjects(data);
                } else {
                    setSubjects([]);
                }
            } catch (error) {
                console.error("Error fetching subjects:", error);
                setSubjects([]);
            } finally {
                setLoading(false);
            }
        }
        fetchSubjects();
    }, [userId]);

    return { subjects, loading };
}