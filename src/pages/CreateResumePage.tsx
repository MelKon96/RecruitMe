import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import type { IUser } from '../types/user';
import { resumeSchema } from '../schemas/resumeSchema';
import type { ResumeFormValues } from '../schemas/resumeSchema';
import { ResumeForm } from '../components/ResumeForm';
import { ROUTES } from '../constants';
import { useResumeContext } from '../context/useResumeContext';

const toResume = (data: ResumeFormValues, id: number): IUser => ({
  id,
  firstName: data.firstName,
  lastName: data.lastName,
  image: `https://ui-avatars.com/api/?name=${encodeURIComponent(
    `${data.firstName} ${data.lastName}`,
  )}&background=4f46e5&color=fff&size=128`,
  email: data.email,
  phone: data.phone,
  company: {
    title: data.position,
    department: data.department,
    name: data.companyName,
  },
  skills: data.skills,
  level: data.level,
  bio: data.bio,
  location: data.location || undefined,
});

export const CreateResumePage = () => {
  const navigate = useNavigate();
  const { id } = useSearch({ from: ROUTES.createResume });

  const { resumes, saveResume } = useResumeContext();

  const resumeToEdit = resumes.find((resume) => resume.id === id);
  const isEditing = Boolean(resumeToEdit);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      firstName: resumeToEdit?.firstName ?? '',
      lastName: resumeToEdit?.lastName ?? '',
      position: resumeToEdit?.company.title ?? '',
      level: resumeToEdit?.level ?? 'Junior',
      email: resumeToEdit?.email ?? '',
      phone: resumeToEdit?.phone ?? '',
      skills: resumeToEdit?.skills ?? [],
      bio: resumeToEdit?.bio ?? '',
      companyName: resumeToEdit?.company.name ?? '',
      department: resumeToEdit?.company.department ?? '',
      location: resumeToEdit?.location ?? '',
    },
  });

  const onSubmit = (data: ResumeFormValues) => {
    const resumeId =
      resumeToEdit?.id ??
      Math.min(0, ...resumes.map((resume) => resume.id)) - 1;

    saveResume(toResume(data, resumeId));

    navigate({ to: ROUTES.myResumes });
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <Link
        to={ROUTES.myResumes}
        className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        ← Назад к моим резюме
      </Link>

      <h1 className="mt-4 mb-2 text-2xl font-bold text-gray-900">
        {isEditing ? 'Редактировать резюме' : 'Создать резюме'}
      </h1>

      <p className="mb-8 text-gray-600">
        Расскажите о себе и своих профессиональных навыках.
      </p>

      <ResumeForm
        register={register}
        control={control}
        errors={errors}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={isEditing ? 'Сохранить изменения' : 'Создать резюме'}
      />
    </section>
  );
};
