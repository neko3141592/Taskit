'use client';

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronRight, Plus, TrendingUp, TrendingDown } from "lucide-react";
import TestScoreEditDialog from "./test-score-edit-dialog";
import axios from "axios";
import { toast } from "sonner";

type TestScoresListProps = {
    test: Test;
    onEdit: (updatedScore: Score) => void;
    disabled?: boolean;
};

const getSubjectColor = (subject?: Subject): string => {
    return subject?.color ?? "#000";
};

export default function TestScoresList({ test, onEdit, disabled }: TestScoresListProps) {
    const [editOpenId, setEditOpenId] = useState<string | null>(null);

    const totalScore = test.scores?.reduce((sum, score) => sum + (score.value ?? 0), 0) || 0;
    const totalMaxValue = test.scores?.reduce((sum, score) => sum + (score.maxValue ?? 100), 0) || 0;
    const overallPercent = totalMaxValue > 0 ? (totalScore / totalMaxValue) * 100 : 0;

    // ダミーの前回との差分
    const scoreDiff = 12; // 前回から+12点
    const percentDiff = 3.5; // 前回から+3.5%

    const handleEditScore = async (updatedScore: Score) => {
        try {
            const res = await axios.patch(`/api/tests/score`, updatedScore);
            toast.success("スコアを更新しました");
            onEdit(updatedScore);
        } catch (error) {
            console.error("スコアの更新に失敗しました", error);
            toast.error("スコアの更新に失敗しました");
        } finally {
            setEditOpenId(null);
        }
    }

    return (
        <div className={`transition-opacity ${disabled ? "opacity-50 pointer-events-none select-none" : ""}`}>
            <div className="bg-white dark:bg-neutral-900 border border-gray-900/10 dark:border-neutral-700 rounded-sm">
                {/* ヘッダー - 統計表示 */}
                <div className="px-6 py-6 border-b border-gray-900/5 dark:border-neutral-800">
                    <div className="flex items-center justify-center gap-12">
                        {/* 合計点 */}
                        <div className="text-center">
                            <p className="text-xs text-gray-500 dark:text-neutral-400 font-medium mb-1.5">合計点</p>
                            <div className="flex items-baseline justify-center gap-2">
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {totalScore}
                                </p>
                                <span className="text-lg font-normal text-gray-400 dark:text-neutral-500">/ {totalMaxValue}</span>
                            </div>
                            <div className="flex items-center justify-center gap-1 mt-1.5">
                                {scoreDiff >= 0 ? (
                                    <>
                                        <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                                        <span className="text-xs font-medium text-green-600 dark:text-green-400">+{scoreDiff}</span>
                                    </>
                                ) : (
                                    <>
                                        <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                                        <span className="text-xs font-medium text-red-600 dark:text-red-400">{scoreDiff}</span>
                                    </>
                                )}
                                <span className="text-xs text-gray-400 dark:text-neutral-500 ml-0.5">前回比</span>
                            </div>
                        </div>

                        {/* 区切り線 */}
                        <div className="w-px h-16 bg-gray-900/10 dark:bg-neutral-700" />

                        {/* 達成率 */}
                        <div className="text-center">
                            <p className="text-xs text-gray-500 dark:text-neutral-400 font-medium mb-1.5">達成率</p>
                            <div className="flex items-baseline justify-center gap-1">
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {Math.round(overallPercent)}
                                </p>
                                <span className="text-lg font-normal text-gray-400 dark:text-neutral-500">%</span>
                            </div>
                            <div className="flex items-center justify-center gap-1 mt-1.5">
                                {percentDiff >= 0 ? (
                                    <>
                                        <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                                        <span className="text-xs font-medium text-green-600 dark:text-green-400">+{percentDiff}%</span>
                                    </>
                                ) : (
                                    <>
                                        <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                                        <span className="text-xs font-medium text-red-600 dark:text-red-400">{percentDiff}%</span>
                                    </>
                                )}
                                <span className="text-xs text-gray-400 dark:text-neutral-500 ml-0.5">前回比</span>
                            </div>
                        </div>
                    </div>
                </div>

                {test.scores && test.scores.length > 0 ? (
                    <div className="px-6 py-2  ">
                        <div className="space-y-0.5">
                            {test.scores.map(score => {
                                const maxValue = score.maxValue ?? 100;
                                const percent = ((score.value ?? 0) / maxValue) * 100;
                                const barColor = getSubjectColor(score.subject);

                                return (
                                    <div key={score.id} className="group">
                                        <Dialog open={editOpenId === score.id} onOpenChange={open => setEditOpenId(open ? score.id : null)}>
                                            <DialogTrigger asChild>
                                                <div
                                                    className="flex flex-col px-3 py-4 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-sm cursor-pointer transition-colors"
                                                    onClick={() => setEditOpenId(score.id)}
                                                >
                                                    <div className="flex items-center justify-between w-full mb-2">
                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            <span
                                                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                                                style={{ backgroundColor: barColor }}
                                                            />
                                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                                {score.subject?.name ?? "教科未設定"}
                                                            </h4>
                                                        </div>
                                                        <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                                                            <p className="text-xs text-gray-500 dark:text-neutral-400 font-mono">
                                                                {score.value ?? "--"} / {maxValue}
                                                            </p>
                                                            <p className="text-sm font-bold text-gray-900 dark:text-white w-12 text-right">
                                                                {score.value === null ? "--" : `${Math.round(percent)}%`}
                                                            </p>
                                                            <ChevronRight className="h-4 w-4 text-gray-400 dark:text-neutral-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                                                        </div>
                                                    </div>
                                                    <div className="w-full h-2 bg-gray-100 dark:bg-neutral-800 rounded-sm overflow-hidden">
                                                        <div
                                                            className="h-full transition-all duration-300"
                                                            style={{
                                                                width: `${percent}%`,
                                                                backgroundColor: barColor
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[400px]">
                                                <DialogTitle>スコア編集</DialogTitle>
                                                <TestScoreEditDialog
                                                    score={score}
                                                    onEdit={handleEditScore}
                                                />
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[280px] bg-white dark:bg-neutral-900">
                        <div className="w-12 h-12 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <Plus className="h-6 w-6 text-gray-400 dark:text-neutral-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">スコアがありません</p>
                        <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">最初のスコアを追加して進捗を確認しましょう</p>
                    </div>
                )}
            </div>
        </div>
    );
}