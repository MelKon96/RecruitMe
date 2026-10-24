import { Link } from '@tanstack/react-router';

export const Header = () => {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
            R
          </span>
          <span>
            Recruit<span className="text-indigo-600">Me</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            activeProps={{
              className: 'text-indigo-600',
            }}
            activeOptions={{ exact: true }}
            className="text-sm font-medium text-gray-600 transition hover:text-indigo-600"
          >
            Специалисты
          </Link>

          <span className="cursor-not-allowed text-sm font-medium text-gray-400">
            Сообщения
          </span>
        </nav>

        <Link
          to="/my-resumes"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Мои резюме
        </Link>
      </div>
    </header>
  );
};
