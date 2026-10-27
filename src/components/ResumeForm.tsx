import { Link } from '@tanstack/react-router';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { ResumeFormValues } from '../schemas/resumeSchema';
import type { DevLevel } from '../types/user';
import { SkillsInput } from './SkillsInput';
import { ROUTES } from '../constants/paths';

interface ResumeFormProps {
  register: UseFormRegister<ResumeFormValues>;
  errors: FieldErrors<ResumeFormValues>;
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  submitLabel?: string;
}

const levels: DevLevel[] = ['Junior', 'Middle', 'Senior', 'Lead'];

const inputClassName =
  'w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100';

const errorClassName = 'mt-1 text-sm text-red-600';

export const ResumeForm = ({
  register,
  errors,
  skills,
  onSkillsChange,
  onSubmit,
  submitLabel = 'Создать резюме',
}: ResumeFormProps) => {
  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        to={ROUTES.myResumes}
        className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        ← Назад к моим резюме
      </Link>

      <p className="mt-2 text-gray-600">
        Расскажите о себе и своих профессиональных навыках.
      </p>

      <form
        onSubmit={onSubmit}
        noValidate
        className="mt-8 space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Имя
            </label>
            <input
              id="firstName"
              {...register('firstName')}
              className={inputClassName}
              placeholder="Иван"
            />
            {errors.firstName && (
              <p className={errorClassName}>{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Фамилия
            </label>
            <input
              id="lastName"
              {...register('lastName')}
              className={inputClassName}
              placeholder="Иванов"
            />
            {errors.lastName && (
              <p className={errorClassName}>{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="position"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Желаемая должность
          </label>
          <input
            id="position"
            {...register('position')}
            className={inputClassName}
            placeholder="Frontend-разработчик"
          />
          {errors.position && (
            <p className={errorClassName}>{errors.position.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="level"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Уровень специалиста
          </label>
          <select id="level" {...register('level')} className={inputClassName}>
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          {errors.level && (
            <p className={errorClassName}>{errors.level.message}</p>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={inputClassName}
              placeholder="ivan@example.com"
            />
            {errors.email && (
              <p className={errorClassName}>{errors.email.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Телефон
            </label>
            <input
              id="phone"
              type="tel"
              {...register('phone')}
              className={inputClassName}
              placeholder="+7 900 123-45-67"
            />
          </div>
        </div>

        <SkillsInput
          skills={skills}
          onSkillsChange={onSkillsChange}
          register={register}
          error={errors.skills?.message}
        />

        <div>
          <label
            htmlFor="bio"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            О себе
          </label>

          <textarea
            id="bio"
            rows={5}
            {...register('bio')}
            className={`${inputClassName} resize-none`}
            placeholder="Расскажите о своём опыте и профессиональных целях"
          />

          {errors.bio && <p className={errorClassName}>{errors.bio.message}</p>}
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Опыт работы и местоположение
          </h2>
          <p className="mt-1 text-sm text-gray-500">Эти поля необязательны.</p>
        </div>

        <div>
          <label
            htmlFor="companyName"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Компания
          </label>
          <input
            id="companyName"
            {...register('companyName')}
            className={inputClassName}
            placeholder="Название компании"
          />
        </div>

        <div>
          <label
            htmlFor="department"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Отдел или описание опыта
          </label>
          <input
            id="department"
            {...register('department')}
            className={inputClassName}
            placeholder="Frontend-разработка, 3 года опыта"
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Местоположение
          </label>
          <input
            id="location"
            {...register('location')}
            className={inputClassName}
            placeholder="Москва или удалённо"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </section>
  );
};
