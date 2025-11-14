import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function SubjectBadge({ subject }: { subject?: Subject }) {
        if (!subject) return null;
        return (
            <Link href={`/dashboard/subjects/${subject.id}`} passHref>
                <Badge variant="outline" className="text-black dark:text-white mr-2 h-6">
                    <div 
                        className="h-2 w-2 rounded-full" 
                        style={{ backgroundColor: subject.color || '#808080' }} 
                    />
                    {subject.name}
                </Badge>
            </Link>
        );
    }