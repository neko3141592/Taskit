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
    startDate: string;
    endDate: string;
    description?: string;
    userId: string;
    tasks?: Task[];
    scores?: Score[];
    createdAt: string;
    updatedAt: string;
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

interface Score {
    id: string;
    value: number | null;
    maxValue: number;
    userId: string;
    subjectId: string;
    subject?: Subject;
    testId: string;
    test?: Test;
    createdAt?: string;
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
    tests?: Test;
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
