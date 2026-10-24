import { useNavigate, useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../api/usersApi';
import { UserDetailCard } from '../components/UserDetailCard';
import type { IUser } from '../types/user';

const RESUME_STORAGE_KEY = 'recruit_me_resume';

export const UserDetailPage = () => {
  const { id } = useParams({ from: '/users/$id' });
  const navigate = useNavigate();

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const handleBack = () => {
    navigate({ to: '/' });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-gray-500">
        Загрузка профиля кандидата...
      </div>
    );
  }

  if (error || !users) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 className="mb-2 text-xl font-bold text-red-600">Ошибка загрузки</h2>
        <p className="mb-4 text-gray-500">
          Не удалось получить данные о кандидате.
        </p>
        <button
          onClick={handleBack}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
        >
          Вернуться к списку
        </button>
      </div>
    );
  }

  let ownResume: IUser | null = null;
  const savedResume = localStorage.getItem(RESUME_STORAGE_KEY);

  if (savedResume) {
    try {
      ownResume = JSON.parse(savedResume) as IUser;
    } catch {
      ownResume = null;
    }
  }

  const user =
    users.find((candidate) => candidate.id === Number(id)) ??
    (ownResume && ownResume.id === Number(id) ? ownResume : null);

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
          className="rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
        >
          Вернуться к списку
        </button>
      </div>
    );
  }

  return <UserDetailCard user={user} onBack={handleBack} />;
};
