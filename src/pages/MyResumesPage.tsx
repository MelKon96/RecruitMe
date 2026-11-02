import { Link } from '@tanstack/react-router';
import { FileText, Pencil, Trash2 } from 'lucide-react';
import { ROUTES } from '../constants/paths';
import { useResume } from '../hooks/useResume';
import { useResumeContext } from '../context/useResumeContext';
import { UserProfileDetails } from '../components/UserProfileDetails';

export const MyResumesPage = () => {
  const resume = useResume();
  const { removeResume } = useResumeContext();

  const handleDelete = () => {
    removeResume();
  };

  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Мои резюме
          </h1>

          <p className="mt-2 text-gray-500">
            Управляйте своим профилем специалиста.
          </p>
        </div>
      </div>

      {!resume ? (
        <div className="flex min-h-[45vh] flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
            <FileText size={32} strokeWidth={1.8} />
          </div>

          <h2 className="text-xl font-semibold text-gray-900">
            У вас пока нет резюме
          </h2>

          <p className="mt-2 max-w-md text-gray-500">
            Создайте резюме, чтобы представить свои навыки и опыт потенциальным
            заказчикам.
          </p>

          <Link
            to={ROUTES.createResume}
            className="mt-6 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Создать резюме
          </Link>
        </div>
      ) : (
        <article className="mt-8 max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          {/* Здесь можно собрать карточку резюме из тех же блоков, что UserDetailCard (навыки, о себе, контакты), а не верстать профиль второй раз. */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={resume.image}
                alt={`${resume.firstName} ${resume.lastName}`}
                className="h-16 w-16 rounded-full border border-gray-200 object-cover"
              />

              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {resume.firstName} {resume.lastName}
                </h2>

                <p className="mt-1 text-gray-600">{resume.company.title}</p>

                <span className="mt-2 inline-block rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                  {resume.level}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to={ROUTES.createResume}
                aria-label="Редактировать резюме"
                title="Редактировать резюме"
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-indigo-600"
              >
                <Pencil size={18} />
              </Link>

              <button
                type="button"
                onClick={handleDelete}
                aria-label="Удалить резюме"
                title="Удалить резюме"
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <UserProfileDetails user={resume} />
        </article>
      )}
    </section>
  );
};
