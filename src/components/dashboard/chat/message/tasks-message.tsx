import Link from 'next/link';

interface TasksMessageProps {
  content: string;
}

export function TasksMessage({ content }: TasksMessageProps) {
  try {
    const data = JSON.parse(content);
    const tasks = data.tasks || [];
    
    return (
      <div className="flex justify-start">
        <div className="max-w-[85%] px-3 py-2 rounded-sm text-sm bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600">
          <p className="text-xs font-semibold text-neutral-900 dark:text-white mb-2">
            タスク一覧 ({tasks.length}件)
          </p>
          {tasks.length === 0 ? (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">タスクがありません</p>
          ) : (
            <div className="space-y-2">
              {tasks.slice(0, 10).map((task: Task) => (
                <Link href={`/dashboard/tasks/${task.id}`} key={task.id}>
                  <div className="p-2 rounded border border-neutral-100 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800">
                    <p className="text-xs font-medium text-neutral-900 dark:text-white">
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      {task.subject && (
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: task.subject.color ?? '#000' }}
                          />
                          {task.subject.name}
                        </span>
                      )}
                      {task.dueDate && (
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {new Date(task.dueDate).toLocaleDateString('ja-JP', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      )}
                      <span className="text-xs px-1.5 py-0.5 rounded-sm bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                        {task.status === 'NOT_STARTED' ? '未着手' : task.status === 'IN_PROGRESS' ? '進行中' : '完了'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
              {tasks.length > 10 && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center pt-1">
                  ...他 {tasks.length - 10}件
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  } catch (e) {
    return null;
  }
}
