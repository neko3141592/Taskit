'use client';

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronRight, Plus, TrendingUp, TrendingDown } from "lucide-react";
import TestScoreEditDialog from "./test-score-edit-dialog";

type TestScoresListProps = {
    test: Test;
    onEditScore: (updatedScore: Score) => void;
    onDeleteScore: (scoreId: string) => void;
    disabled?: boolean;
};

const getSubjectColor = (subject?: Subject): string => {
    return subject?.color ?? "#000";
};

export default function TestScoresList({ test, onEditScore, onDeleteScore, disabled }: TestScoresListProps) {
    const [editOpenId, setEditOpenId] = useState<string | null>(null);

    const totalScore = test.scores.reduce((sum, score) => sum + score.value, 0);
    const totalMaxValue = test.scores.reduce((sum, score) => sum + (score.maxValue ?? 100), 0);
    const overallPercent = totalMaxValue > 0 ? (totalScore / totalMaxValue) * 100 : 0;

    // ダミーの前回との差分
    const scoreDiff = 12; // 前回から+12点
    const percentDiff = 3.5; // 前回から+3.5%

    return (
        <div className={`transition-opacity ${disabled ? "opacity-50 pointer-events-none select-none" : ""}`}>
            <div className="bg-white border border-gray-900/10 rounded-sm">
                {/* ヘッダー - 統計表示 */}
                <div className="px-6 py-6 border-b border-gray-900/5">
                    <div className="flex items-center justify-center gap-12">
                        {/* 合計点 */}
                        <div className="text-center">
                            <p className="text-xs text-gray-500 font-medium mb-1.5">合計点</p>
                            <div className="flex items-baseline justify-center gap-2">
                                <p className="text-3xl font-bold text-gray-900">
                                    {totalScore}
                                </p>
                                <span className="text-lg font-normal text-gray-400">/ {totalMaxValue}</span>
                            </div>
                            <div className="flex items-center justify-center gap-1 mt-1.5">
                                {scoreDiff >= 0 ? (
                                    <>
                                        <TrendingUp className="h-3 w-3 text-green-600" />
                                        <span className="text-xs font-medium text-green-600">+{scoreDiff}</span>
                                    </>
                                ) : (
                                    <>
                                        <TrendingDown className="h-3 w-3 text-red-600" />
                                        <span className="text-xs font-medium text-red-600">{scoreDiff}</span>
                                    </>
                                )}
                                <span className="text-xs text-gray-400 ml-0.5">前回比</span>
                            </div>
                        </div>

                        {/* 区切り線 */}
                        <div className="w-px h-16 bg-gray-900/10" />

                        {/* 達成率 */}
                        <div className="text-center">
                            <p className="text-xs text-gray-500 font-medium mb-1.5">達成率</p>
                            <div className="flex items-baseline justify-center gap-1">
                                <p className="text-3xl font-bold text-gray-900">
                                    {Math.round(overallPercent)}
                                </p>
                                <span className="text-lg font-normal text-gray-400">%</span>
                            </div>
                            <div className="flex items-center justify-center gap-1 mt-1.5">
                                {percentDiff >= 0 ? (
                                    <>
                                        <TrendingUp className="h-3 w-3 text-green-600" />
                                        <span className="text-xs font-medium text-green-600">+{percentDiff}%</span>
                                    </>
                                ) : (
                                    <>
                                        <TrendingDown className="h-3 w-3 text-red-600" />
                                        <span className="text-xs font-medium text-red-600">{percentDiff}%</span>
                                    </>
                                )}
                                <span className="text-xs text-gray-400 ml-0.5">前回比</span>
                            </div>
                        </div>
                    </div>
                </div>

                {test.scores && test.scores.length > 0 ? (
                    <div className="px-6 py-2 max-h-[400px] overflow-y-auto">
                        <div className="space-y-0.5">
                            {test.scores.map(score => {
                                const maxValue = score.maxValue ?? 100;
                                const percent = (score.value / maxValue) * 100;
                                const barColor = getSubjectColor(score.subject);

                                return (
                                    <div key={score.id} className="group">
                                        <Dialog open={editOpenId === score.id} onOpenChange={open => setEditOpenId(open ? score.id : null)}>
                                            <DialogTrigger asChild>
                                                <div
                                                    className="flex flex-col px-3 py-3 hover:bg-gray-50 rounded-sm cursor-pointer transition-colors"
                                                    onClick={() => setEditOpenId(score.id)}
                                                >
                                                    <div className="flex items-center justify-between w-full mb-2">
                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            <span
                                                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                                                style={{ backgroundColor: barColor }}
                                                            />
                                                            <h4 className="text-sm font-medium text-gray-900 truncate">
                                                                {score.subject?.name ?? "科目未設定"}
                                                            </h4>
                                                        </div>
                                                        <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                                                            <p className="text-xs text-gray-500 font-mono">
                                                                {score.value} / {maxValue}
                                                            </p>
                                                            <p className="text-sm font-bold text-gray-900 w-12 text-right">
                                                                {Math.round(percent)}%
                                                            </p>
                                                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-900 transition-colors" />
                                                        </div>
                                                    </div>
                                                    {/* プログレスバー */}
                                                    <div className="w-full h-1 bg-gray-100 rounded-sm overflow-hidden">
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
                                                    onEdit={onEditScore}
                                                    onDelete={onDeleteScore}
                                                />
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[280px] bg-white">
                        <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mb-4">
                            <Plus className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">スコアがありません</p>
                        <p className="text-xs text-gray-500 mt-1">最初のスコアを追加して進捗を確認しましょう</p>
                    </div>
                )}
            </div>
        </div>
    );
}