interface UserMessageProps {
  content: string;
}

export function UserMessage({ content }: UserMessageProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] px-3 py-2 rounded-sm text-sm bg-teal-600 text-white">
        {content}
      </div>
    </div>
  );
}
