import { Link } from '@tanstack/react-router';

export const NotFoundPage = () => {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-7xl font-bold text-indigo-600">404</h1>

      <h2 className="mt-4 text-2xl font-semibold text-gray-900">
        Страница не найдена
      </h2>

      <p className="mt-2 max-w-md text-gray-500">
        Возможно, адрес указан неверно или страница больше не существует.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        На главную
      </Link>
    </section>
  );
};
