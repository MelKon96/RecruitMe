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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition font-medium cursor-pointer"
      >
        ← Назад к списку разработчиков
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-gray-100">
          <img
            src={user.image}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-28 h-28 rounded-2xl object-cover border-2 border-indigo-50 shadow-inner"
          />

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>

              <span
                className={`self-center sm:self-auto text-xs font-semibold px-3 py-1 rounded-full border ${
                  levelColors[user.level]
                }`}
              >
                {user.level}
              </span>
            </div>

            <p className="text-gray-600 font-medium mt-1">
              {user.company.title}
            </p>

            <p className="text-sm text-gray-400">
              {user.company.name} • {user.company.department}
            </p>
          </div>
        </div>

        <div className="py-6 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Технологический стек
          </h3>

          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill) => (
              <span
                key={skill}
                className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg font-medium border border-indigo-100"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="py-6 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
            О кандидате
          </h3>

          <p className="text-gray-700 leading-relaxed">{user.bio}</p>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
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

          <button
            onClick={() =>
              navigate({
                to: '/chat/$userId',
                params: { userId: String(user.id) },
              })
            }
            className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 cursor-pointer"
          >
            Написать
          </button>

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
