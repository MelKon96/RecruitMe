import { useNavigate, useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../api/usersApi';
import { UserDetailCard } from '../components/UserDetailCard';

export const UserDetailPage = () => {
  const { id } = useParams({ from: '/users/$id' }) as { id: string };
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
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-500">
        Загрузка профиля кандидата...
      </div>
    );
  }

  if (error || !users) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">Ошибка загрузки</h2>
        <p className="text-gray-500 mb-4">
          Не удалось получить данные о кандидате.
        </p>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Вернуться к списку
        </button>
      </div>
    );
  }

  const user = users.find((u) => u.id === Number(id));

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Кандидат не найден
        </h2>
        <p className="text-gray-500 mb-4">Возможно, ID указан неверно.</p>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Вернуться к списку
        </button>
      </div>
    );
  }

  return <UserDetailCard user={user} onBack={handleBack} />;
};
