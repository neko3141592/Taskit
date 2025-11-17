'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Clock, BookOpen, Sparkles, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

type Props = {
    readonly test: Test;
};

export default function TestStudyPlan({ test }: Props) {
    const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const fetchStudyPlan = async () => {
            try {
                const response = await axios.get<APIResponse<StudyPlan>>(`/api/ai/test-study-plan?testId=${test.id}`);
                if (response.data.success && response.data.data) {
                    setStudyPlan(response.data.data);
                    setIsExpanded(true);
                }
            } catch (error) {
                console.error("Failed to fetch study plan:", error);
            }
        };

        fetchStudyPlan();
    }, [test.id]);

    const generateStudyPlan = async () => {
        setLoading(true);
        try {
            const response = await axios.post<APIResponse<StudyPlan>>("/api/ai/test-study-plan", {
                test,
            });

            if (response.data.success && response.data.data) {
                setStudyPlan(response.data.data);
                setIsExpanded(true);
                toast.success("学習計画を生成しました！");
            } else {
                throw new Error("学習計画の生成に失敗しました");
            }
        } catch (error) {
            console.error("Study plan generation failed:", error);
            toast.error("学習計画の生成に失敗しました");
        } finally {
            setLoading(false);
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        if (difficulty.includes("簡単")) return "text-green-600 dark:text-green-400";
        if (difficulty.includes("難しい")) return "text-red-600 dark:text-red-400";
        return "text-yellow-600 dark:text-yellow-400";
    };

    return (
        <Card className="shadow-none border-teal-500/20">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-sm bg-teal-500/10">
                            <Sparkles className="h-4 w-4 text-teal-500" />
                        </div>
                        <span>AI学習計画</span>
                    </div>
                    {studyPlan && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="h-8 w-8 p-0"
                        >
                            {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </Button>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                {studyPlan ? (
                    isExpanded && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    概要
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {studyPlan.overview}
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">推定時間:</span>
                                    <span className="font-mono">{studyPlan.estimatedTime}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="font-medium">難易度:</span>
                                    <span className={`font-semibold ${getDifficultyColor(studyPlan.difficulty)}`}>
                                        {studyPlan.difficulty}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm mb-3">学習ステップ</h3>
                                <div className="space-y-2">
                                    {studyPlan.steps.map((step) => (
                                        <div
                                            key={step.step}
                                            className="border border-border rounded-sm p-3 bg-muted/20 hover:bg-muted/30 transition-colors"
                                        >
                                            <div className="flex items-start gap-2">
                                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-bold mt-0.5">
                                                    {step.step}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-sm mb-1">{step.title}</h4>
                                                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                                                        {step.description}
                                                    </p>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            <span className="font-mono">{step.estimatedMinutes}分</span>
                                                        </div>
                                                        {step.dueDate && (
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                <span className="font-mono">
                                                                    {new Date(step.dueDate).toLocaleDateString('ja-JP')}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {studyPlan.tips.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                                        学習のコツ
                                    </h3>
                                    <ul className="space-y-1.5">
                                        {studyPlan.tips.map((tip) => (
                                            <li key={tip} className="text-xs text-muted-foreground flex gap-2 leading-relaxed">
                                                <span className="text-teal-500 flex-shrink-0 mt-1">•</span>
                                                <span>{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="pt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={generateStudyPlan}
                                    disabled={loading}
                                    className="w-full shadow-none"
                                >
                                    {loading ? "生成中..." : "学習計画を再生成"}
                                </Button>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="text-center py-8">
                        <div className="mb-4 inline-flex p-3 rounded-sm bg-teal-500/10">
                            <Sparkles className="h-6 w-6 text-teal-500" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                            テスト情報を元に、AIが最適な<br />学習計画を提案します
                        </p>
                        <Button
                            onClick={generateStudyPlan}
                            disabled={loading}
                            className="gap-2 shadow-none"
                            size="sm"
                        >
                            {loading ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    生成中...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4" />
                                    学習計画を生成
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
