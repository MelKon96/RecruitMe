import { useEffect, useState, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { fetchUsersPage } from '../api/usersApi';
import { UserCard } from '../components/UserCard';
import type { IUser } from '../types/user';
import { ROUTES } from '../constants/paths';

// Здесь можно заменить ключ, парсинг JSON и событие resume-updated на хук useResume() из общего storage: то же самое скопировано в UserDetailPage, MyResumesPage и CreateResumePage.
const RESUME_STORAGE_KEY = 'recruit_me_resume';
const RESUME_UPDATED_EVENT = 'resume-updated';

export const UsersPage = () => {
  const navigate = useNavigate();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Здесь можно читать и писать поиск через useSearch/useNavigate роутера: сейчас query читается один раз из window.location и не синхронизируется с ?search=, который ставит UserDetailCard.
  const [search, setSearch] = useState(
    () => new URLSearchParams(window.location.search).get('search') ?? '',
  );

  const [resume, setResume] = useState<IUser | null>(() => {
    const savedResume = localStorage.getItem(RESUME_STORAGE_KEY);
    if (!savedResume) return null;
    try {
      return JSON.parse(savedResume) as IUser;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const updateResume = () => {
      const savedResume = localStorage.getItem(RESUME_STORAGE_KEY);
      if (!savedResume) {
        setResume(null);
        return;
      }
      try {
        setResume(JSON.parse(savedResume) as IUser);
      } catch {
        setResume(null);
      }
    };

    window.addEventListener(RESUME_UPDATED_EVENT, updateResume);
    window.addEventListener('storage', updateResume);

    return () => {
      window.removeEventListener(RESUME_UPDATED_EVENT, updateResume);
      window.removeEventListener('storage', updateResume);
    };
  }, []);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ['users-infinite'],
    queryFn: ({ pageParam, signal }) => fetchUsersPage({ pageParam, signal }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextSkip,
  });

  // Здесь можно вынести IntersectionObserver в хук useInfiniteScroll(loadMoreRef, { hasNextPage, isFetchingNextPage, fetchNextPage }).
  useEffect(() => {
    const currentRef = loadMoreRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const users = data?.pages.flatMap((page) => page.users) ?? [];

  const allUsers = resume
    ? [...users.filter((user) => user.id !== resume.id), resume]
    : users;

  // Здесь можно вынести фильтр по имени и навыкам в utils/filterUsers.ts: страница совмещает загрузку, localStorage, скролл и поиск.
  const searchWords = search.trim().toLowerCase().split(/\s+/).filter(Boolean);

  const filteredUsers = allUsers.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const skills = user.skills.map((skill) => skill.toLowerCase());

    return searchWords.every(
      (word) =>
        fullName.includes(word) || skills.some((skill) => skill.includes(word)),
    );
  });

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
          value={search}
          onChange={(event) => setSearch(event.target.value)}
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
