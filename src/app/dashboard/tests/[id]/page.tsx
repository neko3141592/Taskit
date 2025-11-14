'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import TestAddDialog from '@/components/dashboard/tests/test-add-dialog';
import { Book, ChevronRight, Loader2, Hourglass, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import TestTitle from '@/components/dashboard/tests/test-title';
import TestScores from '@/components/dashboard/tests/test-scores';import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import  TestSubjects  from '@/components/dashboard/tests/test-subjects';
import { toast } from 'sonner';
import TestTasks from '@/components/dashboard/tests/test-tasks';

export default function Test () {

    const [test, setTest] = useState<Test | null>(null);
    const { id } = useParams();

    const fetchTest = async () => {
        try {
            const res = await axios.get<APIResponse<Test>>(`/api/tests/${id}`);
            setTest(res.data.data);
            console.log(res.data.data);
        } catch (error) {
            console.error('Error fetching test:', error);
            toast.error('テストの取得に失敗しました');
        }
    };


    useEffect(() => {
        fetchTest();
    }, [id]);


    const handleAddSubject = async (subject: Subject) => {
        if (!test) return;

        const newScore: Score = {
            id: crypto.randomUUID(),
            testId: test.id,
            userId: test.userId,
            subjectId: subject.id,
            subject: subject,
            value: 0,
            maxValue: 100,
        };

        console.log(newScore);
        try {
            const res = await axios.post<APIResponse<Score>>('/api/tests/score', newScore);
            toast.success('教科を追加しました');
            fetchTest();
        } catch (error) {
            console.error('Error adding subject to test:', error);
            toast.error('教科の追加に失敗しました');
        }
    }

    const handleDeleteSubject = async (score: Score) => {
        if (!test) return;

        try {
            await axios.delete<APIResponse<void>>(`/api/tests/${test.id}/score`, {
                data: {
                    id: score.id
                }
            });
            setTest((prevTest) => {
                if (!prevTest) return prevTest;
                return {
                    ...prevTest,
                    scores: prevTest.scores?.filter(s => s.id !== score.id) || [],
                };
            });
        } catch (error) {
            console.error('Error deleting subject from test:', error);
            toast.error('教科の削除に失敗しました');
        }
    }

    const handleEditScore = (updatedScore: Score) => {
        if (!test) return;

        setTest((prevTest) => {
            if (!prevTest) return prevTest;
            return {
                ...prevTest,
                scores: prevTest.scores?.map(score => score.id === updatedScore.id ? updatedScore : score) || [],
            };
        });
    };

    if (!test) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
            </div>
        );
    }

    return (
        <div>
            <TestTitle test={test}  />
            <Tabs defaultValue="overview">
                <TabsList className='border-none bg-white dark:bg-background '>
                    <TabsTrigger
                        value="overview"
                        className=' data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black'
                    >
                        概要
                    </TabsTrigger>
                    <TabsTrigger
                        value="scores"
                        className='data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black'
                    >
                        スコアボード
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className='sm:flex gap-4 '>
                    <TestSubjects 
                        subjects={test.scores?.map(score => score.subject!)} 
                        handleAdd={handleAddSubject} 
                        handleDelete={handleDeleteSubject}
                        className="sm:w-1/2 w-full sm:max-w-sm"
                    />
                    <TestTasks test={test} />
                </TabsContent>
                <TabsContent value="scores">
                    <TestScores test={test} onEdit={handleEditScore} />
                </TabsContent>
            </Tabs>
        </div>
    );
}