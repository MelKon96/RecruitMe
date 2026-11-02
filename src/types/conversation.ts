export interface IMessage {
  id: string;
  text: string;
  sender: "user" | "other";
} // отступ)
export interface IConversation {
  userId: string;
  lastMessage?: string;
  messages?: IMessage[];
}
