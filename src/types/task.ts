type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';


interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    dueDate?: Date;
    userId: string;
    subjectId?: string;
    createdAt: Date;
    updatedAt: Date;
    subject?: Subject;
}


interface Subject {
    id: string;
    name: string;
    userId: string;
    color?: string;
    createdAt: Date;
}

