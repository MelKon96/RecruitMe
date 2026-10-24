import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { fetchUsers } from '../api/usersApi';
import { UserCard } from '../components/UserCard';

export const UsersPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const normalizedSearch = search.trim().toLowerCase();

  const filteredUsers = users?.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const skills = user.skills.join(' ').toLowerCase();

    return (
      fullName.includes(normalizedSearch) || skills.includes(normalizedSearch)
    );
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Загрузка базы кандидатов...
      </div>
    );
  }

  if (error || !users) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-600">
        Ошибка при загрузке пользователей.
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Каталог разработчиков
        </h1>
        <p className="mt-1 text-gray-500">
          Найдите подходящего специалиста для вашего проекта
        </p>
      </header>

      <div className="mb-8">
        <label
          htmlFor="specialist-search"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Поиск специалистов
        </label>

        <input
          id="specialist-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Имя или технология, например React..."
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {filteredUsers && filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onClick={() =>
                navigate({
                  to: '/users/$id',
                  params: { id: String(user.id) },
                })
              }
            />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-gray-500">
          Специалисты по вашему запросу не найдены.
        </p>
      )}
    </main>
  );
};
