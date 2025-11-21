interface DisabledMessageProps {
  content: string;
}

export function DisabledMessage({ content }: DisabledMessageProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] px-3 py-2 rounded-sm text-sm bg-neutral-300 dark:bg-neutral-600 text-neutral-600 dark:text-neutral-400 opacity-60">
        {content}
      </div>
    </div>
  );
}
