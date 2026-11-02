import { useNavigate, useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchUserById, queryKeys } from '../api/usersApi';
import { UserDetailCard } from '../components/UserDetailCard';
import { useResume } from '../hooks/useResume';
import { ROUTES } from '../constants/paths';

export const UserDetailPage = () => {
  // Здесь можно взять путь из ROUTES.users и отдельно обработать isError. Сейчас сбой сети и пустой ответ выглядят одинаково: «Кандидат не найден».
  const { id } = useParams({ from: '/users/$id' });
  const navigate = useNavigate();
  const numericId = Number(id);
  const ownResume = useResume();

  const isOwnResume = ownResume !== null && ownResume.id === numericId;

  const { data: fetchedUser, isLoading } = useQuery({
    queryKey: queryKeys.user(numericId),
    queryFn: ({ signal }) => fetchUserById(numericId, { signal }),
    enabled: !isOwnResume,
  });

  const user = isOwnResume ? ownResume : fetchedUser;

  // Здесь можно вернуться через history.back(). Переход на ROUTES.home заново открывает каталог и сбрасывает ?search=, из которого пришли.
  const handleBack = () => {
    navigate({
      to: ROUTES.home,
    });
  };

  if (isLoading && !isOwnResume) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-gray-500">
        Загрузка профиля кандидата...
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
