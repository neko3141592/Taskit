import Link from 'next/link';

interface TodosMessageProps {
  content: string;
}

export function TodosMessage({ content }: TodosMessageProps) {
  try {
    const data = JSON.parse(content);
    const todos: Todo[] = data.todos || [];

    return (
      <div className="flex justify-start">
        <div className="max-w-[85%] px-3 py-2 rounded-sm text-sm bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600">
          <p className="text-xs font-semibold text-neutral-900 dark:text-white mb-2">
            Todo一覧 ({todos.length}件)
          </p>
          {todos.length === 0 ? (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Todoがありません</p>
          ) : (
            <div className="space-y-2">
              {todos.slice(0, 10).map((todo: Todo) => (
                <Link href={`/dashboard/tests/${todo.testId}`} key={todo.id}>
                  <div className="p-2 rounded border border-neutral-100 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800">
                    <p className="text-xs font-medium text-neutral-900 dark:text-white">
                      {todo.title}
                    </p>
                    {todo.description && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                        {todo.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      {todo.dueDate && (
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {new Date(todo.dueDate).toLocaleDateString('ja-JP', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
              {todos.length > 10 && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center pt-1">
                  ...他 {todos.length - 10}件
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
