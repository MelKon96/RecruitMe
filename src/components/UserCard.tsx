import type { IUser } from '../types/user';

interface IUserCardProps {
  user: IUser;
  onClick: () => void;
}

const levelColors: Record<IUser['level'], string> = {
  Junior: 'bg-green-100 text-green-800 border-green-200',
  Middle: 'bg-blue-100 text-blue-800 border-blue-200',
  Senior: 'bg-purple-100 text-purple-800 border-purple-200',
  Lead: 'bg-amber-100 text-amber-800 border-amber-200',
};

export const UserCard = ({ user, onClick }: IUserCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between gap-4"
    >
      <div className="flex items-start gap-4">
        <img
          src={user.image}
          alt={`${user.firstName} ${user.lastName}`}
          className="w-14 h-14 rounded-full object-cover border border-gray-100"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-semibold text-gray-900 truncate">
              {user.firstName} {user.lastName}
            </h2>
            <span
              className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${
                levelColors[user.level]
              }`}
            >
              {user.level}
            </span>
          </div>
          <p className="text-sm text-gray-500 truncate">{user.company.title}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {user.skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md font-medium"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>{user.email}</span>
        <span className="text-indigo-600 font-medium hover:underline">
          Профиль →
        </span>
      </div>
    </div>
  );
};
