import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from 'react-hook-form';

import type { ResumeFormValues } from '../schemas/resumeSchema';
import { DEV_LEVELS } from '../constants';
import { SkillsInput } from './SkillsInput';
import { Field } from './Field';

interface ResumeFormProps {
  register: UseFormRegister<ResumeFormValues>;
  control: Control<ResumeFormValues>;
  errors: FieldErrors<ResumeFormValues>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  submitLabel?: string;
}

const INPUT_CLASS_NAME =
  'w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100';

export const ResumeForm = ({
  register,
  control,
  errors,
  onSubmit,
  submitLabel = 'Создать резюме',
}: ResumeFormProps) => {
  // Здесь можно оставить только form: страница CreateResumePage уже оборачивает форму в section с заголовком, получается вложенная вёрстка и двойные отступы.
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Имя"
          htmlFor="firstName"
          error={errors.firstName?.message}
        >
          <input
            id="firstName"
            {...register('firstName')}
            className={INPUT_CLASS_NAME}
            placeholder="Геральт"
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
          />
        </Field>

        <Field
          label="Фамилия"
          htmlFor="lastName"
          error={errors.lastName?.message}
        >
          <input
            id="lastName"
            {...register('lastName')}
            className={INPUT_CLASS_NAME}
            placeholder="Ривийский"
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
          />
        </Field>
      </div>

      <Field
        label="Желаемая должность"
        htmlFor="position"
        error={errors.position?.message}
      >
        <input
          id="position"
          {...register('position')}
          className={INPUT_CLASS_NAME}
          placeholder="Frontend-разработчик"
          aria-invalid={!!errors.position}
          aria-describedby={errors.position ? 'position-error' : undefined}
        />
      </Field>

      <Field
        label="Уровень специалиста"
        htmlFor="level"
        error={errors.level?.message}
      >
        <select
          id="level"
          {...register('level')}
          className={INPUT_CLASS_NAME}
          aria-invalid={!!errors.level}
          aria-describedby={errors.level ? 'level-error' : undefined}
        >
          {DEV_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={INPUT_CLASS_NAME}
            placeholder="geralt@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
        </Field>

        <Field label="Телефон" htmlFor="phone" error={errors.phone?.message}>
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            className={INPUT_CLASS_NAME}
            placeholder="+7 900 123-45-67"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
        </Field>
      </div>

      <Controller
        name="skills"
        control={control}
        render={({ field, fieldState }) => (
          <SkillsInput
            skills={field.value}
            onSkillsChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      <Field label="О себе" htmlFor="bio" error={errors.bio?.message}>
        <textarea
          id="bio"
          rows={5}
          {...register('bio')}
          className={`${INPUT_CLASS_NAME} resize-none`}
          placeholder="Расскажите о своём опыте и профессиональных целях"
          aria-invalid={!!errors.bio}
          aria-describedby={errors.bio ? 'bio-error' : undefined}
        />
      </Field>

      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Опыт работы и местоположение
        </h2>
        <p className="mt-1 text-sm text-gray-500">Эти поля необязательны.</p>
      </div>

      <Field label="Компания" htmlFor="companyName">
        <input
          id="companyName"
          {...register('companyName')}
          className={INPUT_CLASS_NAME}
          placeholder="Название компании"
        />
      </Field>

      <Field label="Отдел или описание опыта" htmlFor="department">
        <input
          id="department"
          {...register('department')}
          className={INPUT_CLASS_NAME}
          placeholder="Frontend-разработка, 3 года опыта"
        />
      </Field>

      <Field label="Местоположение" htmlFor="location">
        <input
          id="location"
          {...register('location')}
          className={INPUT_CLASS_NAME}
          placeholder="Москва или удалённо"
        />
      </Field>

      <div className="flex justify-end">
        <button
          type="submit"
          className="cursor-pointer rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};
