import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../api/usersApi';
import type { IUser } from '../types/user';
import { MessageCircle, Trash2 } from 'lucide-react';
import { ROUTES } from '../constants/paths';

interface IConversation {
  userId: string;
  lastMessage?: string;
  messages?: {
    id: string;
    text: string;
    sender: 'user' | 'other';
  }[];
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

  const [conversations, setConversations] =
    useState<IConversation[]>(getConversations);

  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const {
    data: usersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers({ limit: 10 }),
  });

  const users = usersData?.users ?? [];

  const handleDelete = (userId: string) => {
    const updatedConversations = getConversations().filter(
      (conversation) => conversation.userId !== userId,
    );

    localStorage.setItem(
      CONVERSATIONS_KEY,
      JSON.stringify(updatedConversations),
    );

    setConversations(updatedConversations);
    setDeletingUserId(null);
  };

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

  const visibleConversations = conversations.filter((conversation) =>
    users.some((user) => String(user.id) === conversation.userId),
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Сообщения</h1>

      {visibleConversations.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <p className="font-medium text-gray-700">Пока нет переписок</p>

          <p className="mt-2 text-sm text-gray-500">
            Открой карточку пользователя и нажми «Написать».
          </p>

          <button
            onClick={() => navigate({ to: ROUTES.home })}
            className="mt-5 cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Найти разработчика
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {visibleConversations.map((conversation) => {
            const user = users.find(
              (item: IUser) => String(item.id) === conversation.userId,
            );

            if (!user) return null;

            return (
              <div
                key={conversation.userId}
                className="flex flex-wrap items-center gap-3 border-b border-gray-100 p-3 transition last:border-b-0 hover:bg-gray-50 sm:flex-nowrap sm:p-4"
              >
                <button
                  type="button"
                  onClick={() =>
                    navigate({
                      to: ROUTES.chat,
                      params: { userId: conversation.userId },
                      search: { from: 'messages' },
                    })
                  }
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left sm:gap-4"
                >
                  <img
                    src={user.image}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="h-10 w-10 shrink-0 rounded-full object-cover sm:h-12 sm:w-12"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>

                    <p className="mt-1 truncate text-sm text-gray-500">
                      {conversation.lastMessage || 'Открыть переписку'}
                    </p>
                  </div>

                  <MessageCircle
                    size={20}
                    className="shrink-0 text-indigo-600 sm:size-[22px]"
                  />
                </button>

                {deletingUserId === conversation.userId ? (
                  <div className="flex w-full gap-2 pl-[52px] sm:w-auto sm:pl-0">
                    <button
                      type="button"
                      onClick={() => handleDelete(conversation.userId)}
                      className="flex-1 cursor-pointer rounded-lg bg-red-600 px-3 py-2 text-sm text-white transition hover:bg-red-700 sm:flex-none"
                    >
                      Удалить
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingUserId(null)}
                      className="flex-1 cursor-pointer rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-100 sm:flex-none"
                    >
                      Отмена
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeletingUserId(conversation.userId)}
                    aria-label={`Удалить переписку с ${user.firstName} ${user.lastName}`}
                    title="Удалить переписку"
                    className="shrink-0 cursor-pointer rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};