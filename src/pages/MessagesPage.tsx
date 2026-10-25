import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../api/usersApi';
import type { IUser } from '../types/user';
import { MessageCircle } from 'lucide-react';

interface IConversation {
  userId: string;
  lastMessage?: string;
}

const CONVERSATIONS_KEY = 'recruit_me_conversations';

const getConversations = (): IConversation[] => {
  try {
    const stored = localStorage.getItem(CONVERSATIONS_KEY);
    return stored ? (JSON.parse(stored) as IConversation[]) : [];
  } catch {
    return [];
  }
};

export const MessagesPage = () => {
  const navigate = useNavigate();
  const [conversations] = useState<IConversation[]>(getConversations);

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  if (isLoading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Сообщения</h1>
        <p className="text-gray-500">Загрузка пользователей...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Сообщения</h1>
        <p className="text-red-600">Не удалось загрузить пользователей.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Сообщения</h1>

      {conversations.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <p className="font-medium text-gray-700">Пока нет переписок</p>

          <p className="mt-2 text-sm text-gray-500">
            Открой карточку пользователя и нажми «Написать».
          </p>

          <button
            onClick={() => navigate({ to: '/' })}
            className="mt-5 cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Найти разработчика
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {conversations.map((conversation) => {
            const user = users?.find(
              (item: IUser) => String(item.id) === conversation.userId,
            );

            if (!user) {
              return null;
            }

            return (
              <button
                key={conversation.userId}
                onClick={() =>
                  navigate({
                    to: '/chat/$userId',
                    params: { userId: conversation.userId },
                  })
                }
                className="flex w-full cursor-pointer items-center gap-4 border-b border-gray-100 p-4 text-left transition last:border-b-0 hover:bg-gray-50"
              >
                <img
                  src={user.image}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="h-12 w-12 shrink-0 rounded-full object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>

                  <p className="mt-1 truncate text-sm text-gray-500">
                    {conversation.lastMessage || 'Открыть переписку'}
                  </p>
                </div>

                <MessageCircle size={22} className="shrink-0 text-indigo-600" />
              </button>
            );
          })}
        </div>
      )}
    </main>
  );
};
