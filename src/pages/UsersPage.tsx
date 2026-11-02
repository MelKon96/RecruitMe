import { useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';

import { fetchUsersPage, queryKeys } from '../api/usersApi';
import { UserCard } from '../components/UserCard';
import { ROUTES } from '../constants/paths';
import { useResume } from '../hooks/useResume';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { filterUsers } from '../utils/filterUsers';

export const UsersPage = () => {
  const navigate = useNavigate();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const resume = useResume();

  const { search } = useSearch({ from: ROUTES.home });
  const searchValue = search ?? '';

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: queryKeys.usersInfinite,
    queryFn: ({ pageParam, signal }) => fetchUsersPage({ pageParam, signal }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextSkip,
  });

  useInfiniteScroll(loadMoreRef, {
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const handleSearchChange = (value: string) => {
    navigate({
      to: ROUTES.home,
      search: value ? { search: value } : {},
      replace: true,
    });
  };

  const users = data?.pages.flatMap((page) => page.users) ?? [];

  const allUsers = resume
    ? [...users.filter((user) => user.id !== resume.id), resume]
    : users;

  const filteredUsers = filterUsers(allUsers, searchValue);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Загрузка базы кандидатов...
      </div>
    );
  }

  if (error) {
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
          value={searchValue}
          onChange={(event) => handleSearchChange(event.target.value)}
          placeholder="Имя и технологии, например Next React James..."
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {filteredUsers.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onClick={() =>
                  navigate({
                    to: ROUTES.users,
                    params: { id: String(user.id) },
                  })
                }
              />
            ))}
          </div>

          <div ref={loadMoreRef} className="py-10 text-center">
            {isFetchingNextPage && (
              <p className="text-sm text-gray-500">Загрузка порции...</p>
            )}
            {!hasNextPage && users.length > 0 && (
              <p className="text-sm text-gray-400">Все специалисты загружены</p>
            )}
          </div>
        </>
      ) : (
        <p className="py-12 text-center text-gray-500">
          Специалисты по вашему запросу не найдены.
        </p>
      )}
    </main>
  );
};
