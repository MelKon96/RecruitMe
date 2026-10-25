import { useNavigate } from '@tanstack/react-router';
import type { IUser } from '../types/user';

interface IUserDetailCardProps {
  user: IUser;
  onBack: () => void;
}

const levelColors: Record<IUser['level'], string> = {
  Junior: 'bg-green-100 text-green-800 border-green-200',
  Middle: 'bg-blue-100 text-blue-800 border-blue-200',
  Senior: 'bg-purple-100 text-purple-800 border-purple-200',
  Lead: 'bg-amber-100 text-amber-800 border-amber-200',
};

export const UserDetailCard = ({ user, onBack }: IUserDetailCardProps) => {
  const navigate = useNavigate();

  const handleSkillClick = (skill: string) => {
    navigate({
      to: '/',
      search: { search: skill },
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <button
        onClick={onBack}
        className="mb-6 flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-indigo-600"
      >
        ← Назад к списку разработчиков
      </button>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center gap-6 border-b border-gray-100 pb-8 sm:flex-row sm:items-start">
          <img
            src={user.image}
            alt={`${user.firstName} ${user.lastName}`}
            className="h-28 w-28 rounded-2xl border-2 border-indigo-50 object-cover shadow-inner"
          />

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>

              <span
                className={`self-center rounded-full border px-3 py-1 text-xs font-semibold sm:self-auto ${levelColors[user.level]}`}
              >
                {user.level}
              </span>
            </div>

            <p className="mt-1 font-medium text-gray-600">
              {user.company.title}
            </p>

            <p className="text-sm text-gray-400">
              {user.company.name} • {user.company.department}
            </p>
          </div>
        </div>

        <div className="border-b border-gray-100 py-6">
          <h3 className="mb-3 text-sm font-semibold tracking-wider text-gray-400 uppercase">
            Технологический стек
          </h3>

          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => handleSkillClick(skill)}
                className="cursor-pointer rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100 focus-visible:outline-2 focus-visible:outline-indigo-500"
                title={`Найти специалистов со знанием ${skill}`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        <div className="border-b border-gray-100 py-6">
          <h3 className="mb-2 text-sm font-semibold tracking-wider text-gray-400 uppercase">
            О кандидате
          </h3>

          <p className="leading-relaxed text-gray-700">{user.bio}</p>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-6 text-sm text-gray-600 sm:flex-row">
          <div>
            <span className="font-medium text-gray-900">Телефон:</span>{' '}
            {user.phone.length > 7 ? (
              <a
                href={`tel:${user.phone}`}
                className="text-indigo-600 hover:underline"
              >
                {user.phone}
              </a>
            ) : (
              'Не указан'
            )}
          </div>

          {user.id !== -1 && (
            <button
              type="button"
              onClick={() =>
                navigate({
                  to: '/chat/$userId',
                  params: { userId: String(user.id) },
                  search: { from: 'user' },
                })
              }
              className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700"
            >
              Написать
            </button>
          )}

          <div>
            <span className="font-medium text-gray-900">Email:</span>{' '}
            {user.email ? (
              <a
                href={`mailto:${user.email}`}
                className="text-indigo-600 hover:underline"
              >
                {user.email}
              </a>
            ) : (
              'Не указан'
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
