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

export default function Test () {

    const [test, setTest] = useState<Test | null>(null);
    const { id } = useParams();


    useEffect(() => {
        const fetchTest = async () => {
            const res = await axios.get<APIResponse<Test>>(`/api/tests/${id}`);
            setTest(res.data.data);
            console.log(res.data.data);
        };
        fetchTest();
    }, [id]);

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
                <TabsList className='border-none bg-white '>
                    <TabsTrigger
                        value="overview"
                        className=' data-[state=active]:bg-black data-[state=active]:text-white'
                    >
                        概要
                    </TabsTrigger>
                    <TabsTrigger
                        value="scores"
                        className='data-[state=active]:bg-black data-[state=active]:text-white'
                    >
                        スコアボード
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                    <TestSubjects subjects={test.scores?.map(score => score.subject)} />
                </TabsContent>
                <TabsContent value="scores">
                    <TestScores test={test} />
                </TabsContent>
            </Tabs>
        </div>
    );
}