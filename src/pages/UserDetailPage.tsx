import { useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchUserById, queryKeys } from '../api/usersApi';
import { UserDetailCard } from '../components/UserDetailCard';
import { useResume } from '../hooks/useResume';
import { ROUTES } from '../constants/paths';

export const UserDetailPage = () => {
  const { id } = useParams({ from: ROUTES.users });
  const numericId = Number(id);
  const ownResume = useResume();

  const isOwnResume = ownResume !== null && ownResume.id === numericId;

  const {
    data: fetchedUser,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.user(numericId),
    queryFn: ({ signal }) => fetchUserById(numericId, { signal }),
    enabled: !isOwnResume,
  });

  const user = isOwnResume ? ownResume : fetchedUser;

  const handleBack = () => {
    window.history.back();
  };

  if (isLoading && !isOwnResume) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-gray-500">
        Загрузка профиля кандидата...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 className="mb-2 text-xl font-bold text-gray-800">
          Не удалось загрузить профиль
        </h2>
        <p className="mb-4 text-gray-500">
          Произошла ошибка при загрузке данных. Попробуйте позже.
        </p>
        <button
          onClick={handleBack}
          className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
        >
          Вернуться к списку
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 className="mb-2 text-xl font-bold text-gray-800">
          Кандидат не найден
        </h2>
        <p className="mb-4 text-gray-500">
          Возможно, профиль был удалён или ID указан неверно.
        </p>
        <button
          onClick={handleBack}
          className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
        >
          Вернуться к списку
        </button>
      </div>
    );
  }

  return <UserDetailCard user={user} onBack={handleBack} />;
};
