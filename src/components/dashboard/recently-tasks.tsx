import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { CalendarIcon, ArrowRight } from "lucide-react";
import Link from "next/link";

import RecentlyTasksList from "./recently-tasks-list";

// 仕様書に基づくタスク型
type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

interface Subject {
    id: string;
    name: string;
    userId: string;
    color?: string;
    createdAt: Date;
}

// ステータスに応じたバッジを表示するヘルパー関数


// ダミーデータ - 科目
const dummySubjects: Subject[] = [
{ id: '1', name: '数学', userId: '1', color: '#FF5733', createdAt: new Date() },
{ id: '2', name: '英語', userId: '1', color: '#33A8FF', createdAt: new Date() },
{ id: '3', name: '物理', userId: '1', color: '#33FF57', createdAt: new Date() }
];

// ダミーデータ - 最近のタスク（作成日順）
const dummyRecentTasks: Task[] = [
{
    id: '1',
    title: '微分方程式の問題集',
    description: '教科書p.78-85の演習問題を解く',
    status: 'NOT_STARTED',
    dueDate: new Date(Date.now() + 3 * 86400000), // 3日後
    userId: '1',
    subjectId: '1',
    createdAt: new Date(Date.now() - 1 * 3600000), // 1時間前
    updatedAt: new Date(Date.now() - 1 * 3600000),
    subject: dummySubjects[0]
},
{
    id: '2',
    title: 'TOEIC単語の暗記',
    description: '頻出単語リスト1〜3をマスターする',
    status: 'IN_PROGRESS',
    dueDate: new Date(Date.now() + 1 * 86400000), // 明日
    userId: '1',
    subjectId: '2',
    createdAt: new Date(Date.now() - 5 * 3600000), // 5時間前
    updatedAt: new Date(Date.now() - 2 * 3600000),
    subject: dummySubjects[1]
},
{
    id: '3',
    title: '物理実験レポート作成',
    description: '先週の実験結果をまとめる',
    status: 'COMPLETED',
    dueDate: new Date(Date.now() - 1 * 86400000), // 昨日
    userId: '1',
    subjectId: '3',
    createdAt: new Date(Date.now() - 2 * 86400000), // 2日前
    updatedAt: new Date(Date.now() - 4 * 3600000),
    subject: dummySubjects[2]
},
{
    id: '4',
    title: '数学の中間テスト対策',
    description: '過去問を3年分解く',
    status: 'NOT_STARTED',
    dueDate: new Date(Date.now() + 5 * 86400000), // 5日後
    userId: '1',
    subjectId: '1',
    createdAt: new Date(Date.now() - 10 * 3600000), // 10時間前
    updatedAt: new Date(Date.now() - 10 * 3600000),
    subject: dummySubjects[0]
}
];

export default function RecentlyTasks() {
// 作成日時で降順ソート（最新順）
    const sortedTasks = [...dummyRecentTasks].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    return (
        <Card className="w-full">
        <CardHeader>
            <CardTitle>最近のタスク</CardTitle>
            <CardDescription>最近作成・更新されたタスク</CardDescription>
        </CardHeader>
        <CardContent>
            <RecentlyTasksList tasks={sortedTasks} />
        </CardContent>
        <CardFooter>
            <Link href="/dashboard/tasks" className="w-full">
            <Button variant="outline" className="w-full">
                すべてのタスクを見る
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            </Link>
        </CardFooter>
        </Card>
    );
}