import { useNavigate, useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchUserById } from '../api/usersApi';
import { UserDetailCard } from '../components/UserDetailCard';
import type { IUser } from '../types/user';
import { ROUTES } from '../constants/paths';

const RESUME_STORAGE_KEY = 'recruit_me_resume';

export const UserDetailPage = () => {
  const { id } = useParams({ from: '/users/$id' });
  const navigate = useNavigate();
  const numericId = Number(id);

  // Здесь можно не читать localStorage в теле компонента на каждый рендер, а взять тот же useResume(), что и на остальных страницах.
  let ownResume: IUser | null = null;
  const savedResume = localStorage.getItem(RESUME_STORAGE_KEY);
  if (savedResume) {
    try {
      ownResume = JSON.parse(savedResume) as IUser;
    } catch {
      ownResume = null;
    }
  }

  const isOwnResume = ownResume !== null && ownResume.id === numericId;

  const { data: fetchedUser, isLoading } = useQuery({
    queryKey: ['user', numericId],
    queryFn: ({ signal }) => fetchUserById(numericId, { signal }),
    enabled: !isOwnResume,
  });

  const user = isOwnResume ? ownResume : fetchedUser;

  const handleBack = () => {
    navigate({ to: ROUTES.home });
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
