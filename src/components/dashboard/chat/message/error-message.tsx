interface ErrorMessageProps {
  content: string;
}

export function ErrorMessage({ content }: ErrorMessageProps) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] px-3 py-2 rounded-sm text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
        {content}
      </div>
    </div>
  );
}
