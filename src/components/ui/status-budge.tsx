import { Badge } from "@/components/ui/badge";

export const getStatusBadge = (status: TaskStatus) => {
        switch (status) {
            case 'NOT_STARTED':
                return <Badge variant="outline" className="bg-gray-100 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-600">未着手</Badge>;
            case 'IN_PROGRESS':
                return <Badge variant="outline" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">進行中</Badge>;
            case 'COMPLETED':
                return <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">完了</Badge>;
        }
};