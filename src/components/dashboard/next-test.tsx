import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import RecentlyTasksList from "./recently-tasks-list";

export default function NextTest() {
    return (
        <Card className="w-full shadow-none  md:w-1/3">
        <CardHeader>
            <CardTitle>次のテスト</CardTitle>
        </CardHeader>
        <CardContent>
            
        </CardContent>
        <CardFooter>
            
        </CardFooter>
        </Card>
    );
}