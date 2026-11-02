import { useCallback, useEffect, useRef, useState } from "react";

import type { IMessage, IConversation } from "../types/conversation";
import {
  getConversations,
  saveConversations,
} from "../storage/conversationsStorage";

export const useChatSocket = (userId: string) => {
  const [messages, setMessages] = useState<IMessage[]>(() => {
    return (
      getConversations().find((item) => item.userId === userId)?.messages ?? []
    );
  });

  // Здесь можно хранить статус как 'connecting' | 'open' | 'error' | 'closed', а русские подписи оставить в разметке. Кнопка «Отправить» сейчас включается только при точной строке «Подключено».
  const [status, setStatus] = useState("Подключение...");

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

      saveConversations(conversations);
    },
    [userId],
  );

  useEffect(() => {
    const conversations = getConversations();

    // Здесь можно не записывать пустую переписку { userId } в момент открытия. Диалог появляется в «Сообщениях», даже если ничего не отправили. Сборку записи при отправке лучше отдать в upsertConversation в conversationsStorage.
    if (!conversations.some((item) => item.userId === userId)) {
      conversations.unshift({ userId });
      saveConversations(conversations);
    }

    const socket = new WebSocket("wss://ws.ifelse.io");
    socketRef.current = socket;

    socket.onopen = () => setStatus("Подключено");

    socket.onmessage = (event: MessageEvent<string>) => {
      if (event.data.startsWith("Request served by")) {
        return;
      }

      const newMessage: IMessage = {
        id: crypto.randomUUID(),
        text: event.data,
        sender: "other",
      };

      saveMessages([...messagesRef.current, newMessage]);
    };

    socket.onerror = () => setStatus("Ошибка соединения");
    socket.onclose = () => setStatus("Соединение закрыто");

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [userId, saveMessages]);

  const sendMessage = useCallback(
    (value: string): boolean => {
      const text = value.trim();
      const socket = socketRef.current;

      if (!text || !socket || socket.readyState !== WebSocket.OPEN) {
        return false;
        // а в чём проблема тут  выкидывать ошибку, что за сложности с true false,
        // ладно, нейронка тебя засейваила всё норм)
      }

      socket.send(text);

      const newMessage: IMessage = {
        id: crypto.randomUUID(),
        text,
        sender: "user",
      };

      saveMessages([...messagesRef.current, newMessage]);

      return true;
    },
    [saveMessages],
  );

  return {
    messages,
    status,
    sendMessage,
  };
};
