'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useSession } from "next-auth/react"; // NextAuthのuseSessionをインポート
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import SubjectAddDialog from '@/components/dashboard/subjects/subject-add-dialog';
import { Book, ChevronRight, Loader2, Hourglass } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CircleCheckBig } from 'lucide-react';

type SubjectWithCount = Subject & { incompleteTaskCount?: number, completedTaskCount?: number };


export default function Tests () {
    const { data: session, status } = useSession();
    const [subjects, setSubjects] = useState<SubjectWithCount[] | null>(null);
    const [filteredSubjects, setFilteredSubjects] = useState<SubjectWithCount[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const fetchSubjects = async () => {
        if (!session?.user?.id) return;
        setLoading(true);
        try {
            const res = await axios.get<APIResponse<SubjectWithCount[] | null>>(`/api/subjects?userId=${session.user.id}`);
            setSubjects(res.data.data);
            setFilteredSubjects(res.data.data);
        } catch (error) {
            console.error(error);
            setError('エラーが発生しました');
        } finally {
            setLoading(false);
        }
    };

    const filterSubjects = (query: string) => {
        if (!subjects) return [];
        return subjects.filter(subject => subject.name.toLowerCase().includes(query.toLowerCase()));
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        const filtered = filterSubjects(query);
        setFilteredSubjects(filtered);
    }

    useEffect(() => {
        if (status === "authenticated") {
            fetchSubjects();
        }
    }, [session, status]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="w-full">
            <Card className="shadow-none relative ">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>登録済みのテスト</CardTitle>
                    </div>
                    <SubjectAddDialog onAdd={fetchSubjects} />
                </CardHeader>
                <CardContent>
                    <Input placeholder="検索" className="mb-4 max-w-[200px]" onChange={handleSearchChange} />
                    {filteredSubjects && filteredSubjects.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredSubjects.map(subject => (
                                <Link key={subject.id} href={`/dashboard/subjects/${subject.id}`} passHref>
                                    <Card className="group hover:border-teal-500 shadow-xs transition-all  cursor-pointer h-full flex flex-col">
                                        <CardHeader className="flex-grow">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 rounded-full" style={{ backgroundColor: `${subject.color}20` }}>
                                                    <Book className="h-6 w-6" style={{ color: subject.color || '#808080' }} />
                                                </div>
                                                <CardTitle className="text-lg truncate">{subject.name}</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <span className="flex items-center gap-1">
                                                    <CircleCheckBig className="h-4 w-4" />
                                                    {subject.completedTaskCount}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Hourglass className="h-4 w-4" />
                                                    {subject.incompleteTaskCount}
                                                </span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                        </CardFooter>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>まだ教科が登録されていません。</p>
                            <p>右上のボタンから新しい教科を追加しましょう。</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}