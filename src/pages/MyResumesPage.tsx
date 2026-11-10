import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Eye, EyeOff, FileText, Pencil, Trash2 } from 'lucide-react';

import { LEVEL_COLORS, ROUTES } from '../constants';
import { useResumeContext } from '../context/useResumeContext';
import { UserProfileDetails } from '../components/UserProfileDetails';

export const MyResumesPage = () => {
  const { resumes, activeResumeId, removeResume, setActiveResume } =
    useResumeContext();

  const [resumeToDelete, setResumeToDelete] = useState<number | null>(null);

  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const isDeleteModalOpen = resumeToDelete !== null;

  useLayoutEffect(() => {
    if (!isDeleteModalOpen) return;

    const deleteButton = deleteButtonRef.current;

    cancelButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setResumeToDelete(null);
      }

      if (event.key === 'Tab') {
        const focusableElements =
          dialogRef.current?.querySelectorAll<HTMLElement>(
            'button:not([disabled])',
          );

        if (!focusableElements?.length) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      if (deleteButton?.isConnected) {
        deleteButton.focus();
      }
    };
  }, [isDeleteModalOpen]);

  const handleDelete = () => {
    if (resumeToDelete === null) return;

    removeResume(resumeToDelete);
    setResumeToDelete(null);
  };

  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Мои резюме
          </h1>

          <p className="mt-2 text-gray-500">
            Управляйте своими резюме и выбирайте, какое отображать в каталоге.
          </p>
        </div>

        <Link
          to={ROUTES.createResume}
          className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Создать резюме
        </Link>
      </div>

      {resumes.length === 0 ? (
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
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {resumes.map((resume) => {
            const isActive = resume.id === activeResumeId;

            return (
              <article
                key={resume.id}
                className={`rounded-2xl border bg-white p-6 shadow-sm ${
                  isActive ? 'border-indigo-500' : 'border-gray-200'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={resume.image}
                      alt=""
                      className="h-16 w-16 rounded-full border border-gray-200 object-cover"
                    />

                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {resume.firstName} {resume.lastName}
                      </h2>

                      <p className="mt-1 text-gray-600">
                        {resume.company.title}
                      </p>

                      <span
                        className={`mt-2 inline-block rounded-full border px-3 py-1 text-xs font-medium ${LEVEL_COLORS[resume.level]}`}
                      >
                        {resume.level}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveResume(resume.id)}
                      aria-label={
                        isActive
                          ? 'Резюме отображается в каталоге'
                          : 'Показывать резюме в каталоге'
                      }
                      title={
                        isActive
                          ? 'Отображается в каталоге'
                          : 'Показывать в каталоге'
                      }
                      aria-pressed={isActive}
                      className={`inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border transition ${
                        isActive
                          ? 'border-indigo-200 bg-indigo-50 text-indigo-600'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
                      }`}
                    >
                      {isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>

                    <Link
                      to={ROUTES.createResume}
                      search={{ id: resume.id }}
                      aria-label={`Редактировать резюме ${resume.firstName} ${resume.lastName}`}
                      title="Редактировать резюме"
                      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-indigo-600"
                    >
                      <Pencil size={18} />
                    </Link>

                    <button
                      ref={isActive ? deleteButtonRef : undefined}
                      type="button"
                      onClick={() => setResumeToDelete(resume.id)}
                      aria-label={`Удалить резюме ${resume.firstName} ${resume.lastName}`}
                      title="Удалить резюме"
                      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {isActive && (
                  <p className="mt-5 text-sm font-medium text-indigo-600">
                    Отображается в каталоге
                  </p>
                )}

                <UserProfileDetails user={resume} />
              </article>
            );
          })}
        </div>
      )}

      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setResumeToDelete(null);
            }
          }}
        >
          <div
            ref={dialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-description"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2
              id="delete-modal-title"
              className="text-xl font-semibold text-gray-900"
            >
              Удалить резюме?
            </h2>

            <p
              id="delete-modal-description"
              className="mt-2 text-sm text-gray-600"
            >
              Вы уверены, что хотите удалить это резюме? Это действие нельзя
              отменить.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                ref={cancelButtonRef}
                type="button"
                onClick={() => setResumeToDelete(null)}
                className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Отмена
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
