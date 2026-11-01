import type { IConversation } from '../types/conversation';

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

export const removeConversation = (userId: string): IConversation[] => {
  const updatedConversations = getConversations().filter(
    (conversation) => conversation.userId !== userId,
  );

  saveConversations(updatedConversations);

  return updatedConversations;
};
