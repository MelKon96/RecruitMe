interface IChatErrorProps {
  message: string;
  onRetry?: () => void;
}

export const ChatError = ({ message, onRetry }: IChatErrorProps) => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-center">
      <p className="text-gray-700">{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Повторить
        </button>
      )}
    </div>
  );
};
