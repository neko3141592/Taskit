type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

interface User {
    id: string;
    email: string;
    name?: string;
    createdAt: string;
    updatedAt: string;
}

interface Tag {
    id: string;
    name: string;
}

interface Test {
    id: string;
    name: string;
    date: string;
    description?: string;
    userId: string;
    subjects?: Subject[];
    tasks?: Task[];
}

interface Subject {
    id: string;
    name: string;
    userId: string;
    color?: string;
    createdAt: string;
    tests?: Test[];
    tasks?: Task[];
}

interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    dueDate: string;
    userId: string;
    subjectId?: string;
    testId?: string;
    createdAt: string;
    updatedAt: string;
    subject?: Subject;
    tests?: Test[];
    tags?: Tag[];
    pages?: TaskPage[];
    notificationDaysBefore?: number;
    notified?: boolean;
}

interface TaskPage {
    id: string;
    title?: string;
    start: number;
    end: number;
    completed: number[];
}

interface Sort {
    sortKey: string;
    sortOrder: 'asc' | 'desc';
}

interface Filter {
    status?: TaskStatus;
    subjectId?: string;
    testId?: string;
    name?: string;
}

interface Notification {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    userId: string;
    link?: string;
    createdAt: string;
}
