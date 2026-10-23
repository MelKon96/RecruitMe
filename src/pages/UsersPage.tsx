import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { fetchUsers } from '../api/usersApi';
import { UserCard } from '../components/UserCard';

export const UsersPage = () => {
  const navigate = useNavigate();

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Загрузка базы кандидатов...
      </div>
    );
  }

  if (error || !users) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Ошибка при загрузке пользователей.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Каталог разработчиков
        </h1>
        <p className="text-gray-500 mt-1">
          Найдите подходящего специалиста для вашего проекта
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onClick={() =>
              navigate({ to: '/users/$id', params: { id: String(user.id) } })
            }
          />
        ))}
      </div>
    </div>
  );
};
