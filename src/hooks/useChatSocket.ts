import { useCallback, useEffect, useRef, useState } from 'react';

import type { IMessage } from '../types/conversation';
import {
  getConversations,
  upsertConversation,
} from '../storage/conversationsStorage';
import type { ChatConnectionStatus } from '../constants/chatStatus';

export const useChatSocket = (userId: string) => {
  const [messages, setMessages] = useState<IMessage[]>(() => {
    return (
      getConversations().find((item) => item.userId === userId)?.messages ?? []
    );
  });

  const [status, setStatus] = useState<ChatConnectionStatus>('connecting');

  const socketRef = useRef<WebSocket | null>(null);
  const messagesRef = useRef<IMessage[]>(messages);

  const saveMessages = useCallback(
    (updatedMessages: IMessage[]) => {
      messagesRef.current = updatedMessages;
      setMessages(updatedMessages);

      upsertConversation(userId, updatedMessages);
    },
    [userId],
  );

  useEffect(() => {
    const socket = new WebSocket('wss://ws.ifelse.io');
    socketRef.current = socket;

    socket.onopen = () => setStatus('open');

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

    socket.onerror = () => setStatus('error');
    socket.onclose = () => setStatus('closed');

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [saveMessages]);

  const sendMessage = useCallback(
    (value: string): boolean => {
      const text = value.trim();
      const socket = socketRef.current;

      if (!text || !socket || socket.readyState !== WebSocket.OPEN) {
        return false;
      }

      socket.send(text);

      const newMessage: IMessage = {
        id: crypto.randomUUID(),
        text,
        sender: 'user',
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
