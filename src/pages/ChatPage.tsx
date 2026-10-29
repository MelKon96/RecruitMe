import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchUserById } from '../api/usersApi';
import type { IUser } from '../types/user';
import { ROUTES } from '../constants/paths';

// Здесь можно забрать IMessage, IConversation и getConversations в общий storage с MessagesPage и разнести ChatError / ChatConversation по файлам: страница, сокет и localStorage сейчас в одном модуле.
interface IMessage {
  id: string;
  text: string;
  sender: 'user' | 'other';
}

interface IConversation {
  userId: string;
  lastMessage?: string;
  messages?: IMessage[];
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

export const ChatPage = () => {
  const { userId } = useParams({ from: '/chat/$userId' });

  // Здесь можно убрать as { from?: string }: тип даст validateSearch у роута /chat/$userId. Тот же useSearch повторяется в ChatConversation — from лучше передать пропсом. userId === '-1' ниже стоит заменить на String(OWN_RESUME_ID).
  const search = useSearch({
    from: '/chat/$userId',
    shouldThrow: false,
  }) as { from?: string };

  const navigate = useNavigate();

  const isValidId = /^\d+$/.test(userId) && Number(userId) > 0;
  const isValidFrom =
    search.from === undefined ||
    search.from === 'user' ||
    search.from === 'messages';

  useEffect(() => {
    if (userId === '-1') {
      navigate({
        to: ROUTES.users,
        params: { id: '-1' },
        replace: true,
      });
    }
  }, [userId, navigate]);

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUserById(Number(userId)),
    enabled: isValidId && userId !== '-1' && isValidFrom,
    retry: false,
  });

  if (userId === '-1') {
    return null;
  }

  if (!isValidId) {
    return <ChatError message="Указан некорректный ID пользователя." />;
  }

  if (!isValidFrom) {
    return (
      <ChatError message="Некорректный параметр URL. Проверьте ссылку на чат." />
    );
  }

  if (isLoading) {
    return <ChatError message="Загрузка пользователя..." />;
  }

  if (isError) {
    return (
      <ChatError
        message="Не удалось загрузить пользователя. Проверьте ID и подключение к интернету."
        onRetry={() => refetch()}
      />
    );
  }

  if (!user) {
    return <ChatError message="Пользователь не найден." />;
  }

  return <ChatConversation key={userId} userId={userId} user={user} />;
};

interface IChatErrorProps {
  message: string;
  onRetry?: () => void;
}

const ChatError = ({ message, onRetry }: IChatErrorProps) => {
  const navigate = useNavigate();

  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-gray-900">{message}</h1>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="cursor-pointer rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Повторить
          </button>
        )}

        <button
          type="button"
          onClick={() => navigate({ to: ROUTES.home })}
          className="cursor-pointer rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          На главную
        </button>
      </div>
    </section>
  );
};

interface IChatConversationProps {
  userId: string;
  user: IUser;
}

const ChatConversation = ({ userId, user }: IChatConversationProps) => {
  const navigate = useNavigate();

  // Здесь можно не вызывать useSearch второй раз, а получить from из пропсов ChatConversation.
  const search = useSearch({
    from: '/chat/$userId',
    shouldThrow: false,
  }) as { from?: string };

  const fromMessages = search.from === 'messages';

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<IMessage[]>(() => {
    return (
      getConversations().find((item) => item.userId === userId)?.messages ?? []
    );
  });
  const [status, setStatus] = useState('Подключение...');
  const socketRef = useRef<WebSocket | null>(null);
  const messagesRef = useRef<IMessage[]>(messages);

  const saveMessages = useCallback(
    (updatedMessages: IMessage[]) => {
      messagesRef.current = updatedMessages;
      setMessages(updatedMessages);

      const conversations = getConversations();
      const index = conversations.findIndex((item) => item.userId === userId);

      const conversation: IConversation = {
        userId,
        lastMessage: updatedMessages.at(-1)?.text,
        messages: updatedMessages,
      };

      if (index === -1) {
        conversations.unshift(conversation);
      } else {
        conversations[index] = {
          ...conversations[index],
          ...conversation,
        };
      }

      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    },
    [userId],
  );

  useEffect(() => {
    const conversations = getConversations();

    if (!conversations.some((item) => item.userId === userId)) {
      conversations.unshift({ userId });
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    }

    // Здесь можно вынести сокет, статус и сохранение сообщений в хук useChatSocket(userId).
    const socket = new WebSocket('wss://ws.ifelse.io');
    socketRef.current = socket;

    socket.onopen = () => setStatus('Подключено');

    socket.onmessage = (event: MessageEvent<string>) => {
      if (event.data.startsWith('Request served by')) {
        return;
      }

      const newMessage: IMessage = {
        id: crypto.randomUUID(),
        text: event.data,
        sender: 'other',
      };

      saveMessages([...messagesRef.current, newMessage]);
    };

    socket.onerror = () => setStatus('Ошибка соединения');
    socket.onclose = () => setStatus('Соединение закрыто');

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [userId, saveMessages]);

  const handleSend = () => {
    const text = message.trim();
    const socket = socketRef.current;

    if (!text || !socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }

    socket.send(text);

    const newMessage: IMessage = {
      id: crypto.randomUUID(),
      text,
      sender: 'user',
    };

    saveMessages([...messagesRef.current, newMessage]);
    setMessage('');
  };

  const handleBack = () => {
    if (fromMessages) {
      navigate({ to: ROUTES.messages });
      return;
    }

    if (search.from === 'user') {
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
        {fromMessages
          ? '← Назад к сообщениям'
          : search.from === 'user'
            ? '← Назад к пользователю'
            : '← На главную'}
      </button>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5">
          <h1 className="text-xl font-bold text-gray-900">
            Чат с {user.firstName} {user.lastName}
          </h1>
          <p className="mt-1 text-sm text-gray-500">Статус: {status}</p>
        </div>

        <div className="flex min-h-80 flex-col gap-3 p-5">
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
            placeholder="Введите сообщение..."
            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          />

          <button
            type="submit"
            disabled={!message.trim() || status !== 'Подключено'}
            className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
};
