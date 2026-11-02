export interface IMessage {
  id: string;
  text: string;
  sender: 'user' | 'other';
}
export interface IConversation {
  userId: string;
  lastMessage?: string;
  messages?: IMessage[];
}
