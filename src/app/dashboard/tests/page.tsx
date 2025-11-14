'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import TestAddDialog from '@/components/dashboard/tests/test-add-dialog';
import { Book, ChevronRight, Loader2, Hourglass, Calendar} from 'lucide-react';
import { Input } from '@/components/ui/input';



export default function Tests () {
    const [tests, setTests] = useState<Test[] | null>(null);
    const [filteredTests, setFilteredTests] = useState<Test[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const fetchTests = async () => {
        setLoading(true);
        try {
            const res = await axios.get<Test[]>('/api/tests');
            setTests(res.data);
            setFilteredTests(res.data);
        } catch (error) {
            console.error(error);
            setError('エラーが発生しました');
        } finally {
            setLoading(false);
        }
    };

    const filterTests = (query: string) => {
        if (!tests) return [];
        return tests.filter(test => test.name.toLowerCase().includes(query.toLowerCase()));
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        const filtered = filterTests(query);
        setFilteredTests(filtered);
    }

    useEffect(() => {
        fetchTests();
    }, []);

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
                    <TestAddDialog onAdd={fetchTests} />
                </CardHeader>
                <CardContent>
                    <Input placeholder="検索" className="mb-4 shadow-none rounded-sm max-w-[200px]" onChange={handleSearchChange} />
                    {filteredTests && filteredTests.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredTests.map(test => (
                                <Link key={test.id} href={`/dashboard/tests/${test.id}`} passHref>
                                    <Card className="group hover:border-teal-500 shadow-none transition-all cursor-pointer h-full flex flex-col">
                                        <CardHeader className="flex-grow">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 rounded-full bg-teal-100">
                                                    <Book className="h-6 w-6 text-teal-600" />
                                                </div>
                                                <CardTitle className="text-lg truncate">{test.name}</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    {new Date(test.startDate).toLocaleDateString()} ~ {new Date(test.endDate).toLocaleDateString()}
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
                            <p>まだテストが登録されていません。</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}