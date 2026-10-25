import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';

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

  return <ChatConversation key={userId} userId={userId} />;
};

interface IChatConversationProps {
  userId: string;
}

const ChatConversation = ({ userId }: IChatConversationProps) => {
  const navigate = useNavigate();

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

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <button
        onClick={() =>
          navigate({
            to: '/users/$id',
            params: { id: userId },
          })
        }
        className="mb-6 text-sm font-medium text-gray-600 transition hover:text-indigo-600 cursor-pointer"
      >
        ← Назад к пользователю
      </button>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5">
          <h1 className="text-xl font-bold text-gray-900">
            Чат с пользователем #{userId}
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
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
};
