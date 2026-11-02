import { useEffect } from 'react';
import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';

import { fetchUserById, queryKeys } from '../api/usersApi';
import { ROUTES } from '../constants/paths';
import { OWN_RESUME_ID } from '../constants/id';

import { ChatError } from '../components/chat/ChatError';
import { ChatConversation } from '../components/chat/ChatConversation';

export const ChatPage = () => {
  const { userId } = useParams({ from: ROUTES.chat });
  const { from } = useSearch({ from: ROUTES.chat });
  const navigate = useNavigate();

  const isOwnResume = userId === String(OWN_RESUME_ID);
  const isValidId = /^\d+$/.test(userId) && Number(userId) > 0;
  const userIdNumber = isValidId ? Number(userId) : null;

  useEffect(() => {
    if (isOwnResume) {
      navigate({
        to: ROUTES.home,
        replace: true,
      });
    }
  }, [isOwnResume, navigate]);

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.user(userIdNumber ?? 0),
    queryFn: ({ signal }) => fetchUserById(Number(userId), { signal }),
    enabled: isValidId && !isOwnResume,
    retry: false,
  });

  if (isOwnResume) {
    return null;
  }

  if (!isValidId) {
    return <ChatError message="Указан некорректный ID пользователя." />;
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

  return (
    <ChatConversation key={userId} userId={userId} user={user} from={from} />
  );
};
