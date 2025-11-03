"use client"

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export default function TaskSuggest() {
    return (
        <Card className="w-full shadow-none h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    次のタスクの提案:
                </CardTitle>
            </CardHeader>
            <CardContent>
                
            </CardContent>
            <CardFooter>
            </CardFooter>
        </Card>
    );
}