import { Badge } from "@/components/ui/badge";

export const getStatusBadge = (status: TaskStatus) => {
        switch (status) {
            case 'NOT_STARTED':
                return <Badge variant="outline" className="bg-gray-100">未着手</Badge>;
            case 'IN_PROGRESS':
                return <Badge variant="outline" className="bg-blue-100 text-blue-700">進行中</Badge>;
            case 'COMPLETED':
                return <Badge variant="outline" className="bg-green-100 text-green-700">完了</Badge>;
        }
};