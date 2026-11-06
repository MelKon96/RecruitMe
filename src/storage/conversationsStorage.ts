import type { IConversation, IMessage } from '../types/conversation';

const CONVERSATIONS_KEY = 'recruit_me_conversations';

export const getConversations = (): IConversation[] => {
  try {
    const stored = localStorage.getItem(CONVERSATIONS_KEY);
    return stored ? (JSON.parse(stored) as IConversation[]) : [];
  } catch {
    return [];
  }
};

export const saveConversations = (conversations: IConversation[]): void => {
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
};

export const upsertConversation = (
  userId: string,
  messages: IMessage[],
): void => {
  const conversations = getConversations();
  const index = conversations.findIndex(
    (conversation) => conversation.userId === userId,
  );

  const conversation: IConversation = {
    userId,
    lastMessage: messages.at(-1)?.text,
    messages,
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
};

export const removeConversation = (userId: string): IConversation[] => {
  const updatedConversations = getConversations().filter(
    (conversation) => conversation.userId !== userId,
  );

  saveConversations(updatedConversations);

  return updatedConversations;
};
