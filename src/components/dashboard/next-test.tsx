import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import { getNextTest } from "@/lib/testActions";
import { auth } from "@/auth";

export default async function NextTest() {
    const session = await auth();
    const userId = session?.user?.id;

    let nextTest = null;
    if (userId) {
        nextTest = await getNextTest(userId);
    }

    return (
           <Card className="w-full border border-gray-200 dark:border-neutral-700 shadow-none md:w-1/3">
            <CardHeader>
                <CardTitle>次のテスト</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                {userId ? (
                    nextTest ? (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight text-black dark:text-white">
                                    {nextTest.name}
                                </h3>
                            </div>
                            <div className="flex items-center gap-6 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-400 dark:text-neutral-400" />
                                        <span className="text-gray-600 dark:text-neutral-300">
                                        {new Date(nextTest.startDate).toLocaleDateString('ja-JP', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div className="h-px w-8 bg-gray-300 dark:bg-gray-700" />
                                <div className="h-px w-8 bg-gray-300 dark:bg-neutral-700" />
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                    <span className="text-gray-600 dark:text-gray-300">
                                        {new Date(nextTest.endDate).toLocaleDateString('ja-JP', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-8 text-center">
                            <p className="text-sm text-gray-500 dark:text-neutral-400">予定されているテストはありません</p>
                        </div>
                    )
                ) : (
                    <div className="py-8 text-center">
                        <p className="text-sm text-gray-500 dark:text-neutral-400">ログインしてください</p>
                    </div>
                )}
            </CardContent>
            {userId && nextTest && (
                <CardFooter className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <Button
                        asChild
                        variant="ghost"
                        className="group w-full justify-between px-0 text-black dark:text-white hover:bg-transparent"
                    >
                        <Link href={`/dashboard/tests/${nextTest.id}`}>
                            <span className="text-sm font-medium">詳細を見る</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}