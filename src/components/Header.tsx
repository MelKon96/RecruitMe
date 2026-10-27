import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';
import { ROUTES } from '../constants/paths';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const linkClass =
    'text-sm font-medium text-gray-600 transition hover:text-indigo-600';

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to={ROUTES.home}
          onClick={closeMenu}
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
            to={ROUTES.home}
            activeProps={{ className: 'text-indigo-600' }}
            activeOptions={{ exact: true }}
            className={linkClass}
          >
            Специалисты
          </Link>

          <Link
            to={ROUTES.messages}
            activeProps={{ className: 'text-indigo-600' }}
            className={linkClass}
          >
            Сообщения
          </Link>

          <Link
            to={ROUTES.myResumes}
            activeProps={{ className: 'text-indigo-600' }}
            className={linkClass}
          >
            Мои резюме
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 md:hidden"
          aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <nav
          id="mobile-navigation"
          className="flex flex-col gap-1 border-t border-gray-200 px-4 py-3 md:hidden"
        >
          <Link
            to={ROUTES.home}
            onClick={closeMenu}
            activeProps={{ className: 'bg-indigo-50 text-indigo-600' }}
            activeOptions={{ exact: true }}
            className={`${linkClass} rounded-lg px-3 py-3`}
          >
            Специалисты
          </Link>

          <Link
            to={ROUTES.messages}
            onClick={closeMenu}
            activeProps={{ className: 'bg-indigo-50 text-indigo-600' }}
            className={`${linkClass} rounded-lg px-3 py-3`}
          >
            Сообщения
          </Link>

          <Link
            to={ROUTES.myResumes}
            onClick={closeMenu}
            activeProps={{ className: 'bg-indigo-50 text-indigo-600' }}
            className={`${linkClass} rounded-lg px-3 py-3`}
          >
            Мои резюме
          </Link>
        </nav>
      )}
    </header>
  );
};
