'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ArrowRight } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from "next/link";
import axios from "axios";
import RecentlyTasksList from "./recently-tasks-list";
import { useSession } from "next-auth/react";

const periodMap: { [key: string]: { from: string; to: string } } = {
    "three-days": {
        from: new Date().toISOString(),
        to: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    "week": {
        from: new Date().toISOString(),
        to: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    "month": {
        from: new Date().toISOString(),
        to: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
};

export default function RecentlyTasks() {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const limit: number = 5;
    const [selectedPeriod, setSelectedPeriod] = useState<string>("week");
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const { data: session, status } = useSession();
    const user = session?.user;

    useEffect(() => {
        if (!user) {
            setTasks([]);
            return;
        }
        const fetchTasks = async () => {
            setLoading(true);
            try {
                const res = await axios.get<APIResponse<{ totalCount: number; tasks: Task[] }>>(`/api/tasks`, {
                    params: {
                        userId: user.id,
                        status: 'NOT_STARTED+IN_PROGRESS',
                        due: selectedPeriod,
                        sort: 'dueDate',
                        order: 'asc',
                        limit,
                        skip: (currentPage - 1) * limit,
                        dueDateFrom: periodMap[selectedPeriod].from,
                        dueDateTo: periodMap[selectedPeriod].to
                    }
                });
                const data: Task[] = res.data.data.tasks;
                setTotalCount(res.data.data.totalCount);
                setTotalPages(Math.ceil(res.data.data.totalCount / limit));
                if (data && Array.isArray(data)) {
                    setTasks(data);
                } else {
                    setTasks([]);
                }
            } catch (error) {
                console.error(error);
                setTasks([]);
            }
            setLoading(false);
        };
        fetchTasks();
    }, [selectedPeriod, user, currentPage]);

    return (
        <Card className="w-full shadow-none md:w-2/3">
            <CardHeader>
                <CardTitle>期限が近いタスク</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4 flex items-center justify-between">
                    <Select
                        value={selectedPeriod}
                        onValueChange={setSelectedPeriod}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="期間を選択" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>直近</SelectLabel>
                                <SelectItem value="three-days">3日</SelectItem>
                                <SelectItem value="week">1週間</SelectItem>
                                <SelectItem value="month">1ヶ月</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                
                <RecentlyTasksList 
                    tasks={tasks} 
                    currentPage={currentPage}
                    totalCount={totalCount}
                    setCurrentPage={setCurrentPage}
                    totalPages={Math.ceil(totalCount / limit)}
                    isLoading={loading}
                />
            </CardContent>
            <CardFooter>
                <Link href="/dashboard/tasks" className="w-full">
                    <Button variant="outline" className="w-full shadow-none border-none bg-black text-white hover:bg-gray-800 hover:text-white">
                        すべてのタスクを見る
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}