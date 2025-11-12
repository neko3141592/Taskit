import { MoreHorizontal, Calendar } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import SubjectBadge from "@/components/ui/subject-badge";


type TestTitleProps = {
    test: Test,
    className?: string,
}

export default function TestTitle({ test, className }: TestTitleProps) {
    return (
        <div className={`mb-4 border-none rounded p-4 ${className}`}>
            <div className="flex justify-between items-start">
                <div>
                    <Calendar className="inline-block mr-2 h-5 w-5 text-gray-400" />
                    <span className="text-gray-600 text-sm">{new Date(test.startDate).toLocaleDateString()} ~ {new Date(test.endDate).toLocaleDateString()}</span>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="p-2">
                            <MoreHorizontal size={20} />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right">
                        
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="flex">
                {test.scores?.map((score) => (
                    <SubjectBadge key={score.id} subject={score.subject} />
                ))}
            </div>
            <h1 className="text-2xl font-bold pt-6 pb-2">{test.name}</h1>
            <p className=" text-gray-600 mt-1">{test?.description}</p>
            
        </div>
    )
}