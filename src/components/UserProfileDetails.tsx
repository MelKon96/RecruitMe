import type { IUser } from '../types/user';

interface IUserProfileDetailsProps {
  user: IUser;
  onSkillClick?: (skill: string) => void;
}

export const UserProfileDetails = ({
  user,
  onSkillClick,
}: IUserProfileDetailsProps) => {
  return (
    <>
      <div className="border-b border-gray-100 py-6">
        <h3 className="mb-3 text-sm font-semibold tracking-wider text-gray-400 uppercase">
          Навыки
        </h3>

        <div className="flex flex-wrap gap-2">
          {user.skills.map((skill) =>
            onSkillClick ? (
              <button
                key={skill}
                type="button"
                onClick={() => onSkillClick(skill)}
                className="cursor-pointer rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100 focus-visible:outline-2 focus-visible:outline-indigo-500"
                title={`Найти специалистов со знанием ${skill}`}
              >
                {skill}
              </button>
            ) : (
              <span
                key={skill}
                className="rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-700"
              >
                {skill}
              </span>
            ),
          )}
        </div>
      </div>

      <div className="border-b border-gray-100 py-6">
        <h3 className="mb-2 text-sm font-semibold tracking-wider text-gray-400 uppercase">
          О себе
        </h3>

        <p className="whitespace-pre-wrap leading-relaxed text-gray-700">
          {user.bio}
        </p>
      </div>

      <div className="flex flex-col gap-2 pt-6 text-sm text-gray-600">
        <h3 className="mb-1 text-sm font-semibold tracking-wider text-gray-400 uppercase">
          Контакты
        </h3>

        <p>
          <span className="font-medium text-gray-900">Телефон:</span>{' '}
          {user.phone ? (
            <a
              href={`tel:${user.phone}`}
              className="text-indigo-600 hover:underline"
            >
              {user.phone}
            </a>
          ) : (
            'Не указан'
          )}
        </p>

        <p>
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
        </p>

        {user.location && (
          <p>
            <span className="font-medium text-gray-900">Местоположение:</span>{' '}
            {user.location}
          </p>
        )}
      </div>
    </>
  );
};
