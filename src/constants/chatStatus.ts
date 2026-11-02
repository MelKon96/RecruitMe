export type ChatConnectionStatus = 'connecting' | 'open' | 'error' | 'closed';

export const CHAT_STATUS_LABELS: Record<ChatConnectionStatus, string> = {
  connecting: 'Подключение...',
  open: 'Подключено',
  error: 'Ошибка соединения',
  closed: 'Соединение закрыто',
};
