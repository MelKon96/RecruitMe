import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

import type { IUser } from '../../types/user';
import { ROUTES } from '../../constants/paths';
import { useChatSocket } from '../../hooks/useChatSocket';
import { CHAT_STATUS_LABELS } from '../../constants/chatStatus';

interface IChatConversationProps {
  userId: string;
  user: IUser;
  from?: 'user' | 'messages';
}

export const ChatConversation = ({
  userId,
  user,
  from,
}: IChatConversationProps) => {
  const navigate = useNavigate();

  const { messages, status, sendMessage } = useChatSocket(userId);
  const [message, setMessage] = useState('');

  const isFromMessages = from === 'messages';

  const handleSend = () => {
    if (sendMessage(message)) {
      setMessage('');
    }
  };

  const handleBack = () => {
    if (isFromMessages) {
      navigate({ to: ROUTES.messages });
      return;
    }

    if (from === 'user') {
      navigate({
        to: ROUTES.users,
        params: { id: userId },
      });
      return;
    }

    navigate({ to: ROUTES.home });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <button
        type="button"
        onClick={handleBack}
        className="mb-6 cursor-pointer text-sm font-medium text-gray-600 transition hover:text-indigo-600"
      >
        {isFromMessages
          ? '← Назад к сообщениям'
          : from === 'user'
            ? '← Назад к пользователю'
            : '← На главную'}
      </button>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5">
          <h1 className="text-xl font-bold text-gray-900">
            Чат с {user.firstName} {user.lastName}
          </h1>

          <p aria-live="polite" className="mt-1 text-sm text-gray-500">
            Статус: {CHAT_STATUS_LABELS[status]}
          </p>
        </div>

        <div
          role="log"
          aria-live="polite"
          className="flex min-h-80 flex-col gap-3 p-5"
        >
          {messages.length === 0 ? (
            <p className="text-sm text-gray-400">Напиши первое сообщение.</p>
          ) : (
            messages.map((item) => (
              <div
                key={item.id}
                className={`max-w-[85%] rounded-xl px-4 py-2 text-sm ${
                  item.sender === 'user'
                    ? 'self-end bg-indigo-600 text-white'
                    : 'self-start bg-gray-100 text-gray-800'
                }`}
              >
                {item.text}
              </div>
            ))
          )}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSend();
          }}
          className="flex gap-2 border-t border-gray-100 p-4"
        >
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            aria-label="Сообщение"
            placeholder="Введите сообщение..."
            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          />

          <button
            type="submit"
            disabled={!message.trim() || status !== 'open'}
            className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
};
