import { Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import type { IUser } from '../types/user';
import { resumeSchema } from '../schemas/resumeSchema';
import type { ResumeFormValues } from '../schemas/resumeSchema';
import { ResumeForm } from '../components/ResumeForm';
import { ROUTES } from '../constants/paths';
import { useResume } from '../hooks/useResume';
import { useResumeContext } from '../context/useResumeContext';
import { OWN_RESUME_ID } from '../constants/id';

const toResume = (data: ResumeFormValues): IUser => ({
  id: OWN_RESUME_ID,
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
  const savedResume = useResume();
  const { saveResume } = useResumeContext();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      firstName: savedResume?.firstName ?? '',
      lastName: savedResume?.lastName ?? '',
      position: savedResume?.company.title ?? '',
      level: savedResume?.level ?? 'Junior',
      email: savedResume?.email ?? '',
      phone: savedResume?.phone ?? '',
      skills: savedResume?.skills ?? [],
      bio: savedResume?.bio ?? '',
      companyName: savedResume?.company.name ?? '',
      department: savedResume?.company.department ?? '',
      location: savedResume?.location ?? '',
    },
  });

  const onSubmit = (data: ResumeFormValues) => {
    saveResume(toResume(data));
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
        {savedResume ? 'Редактировать резюме' : 'Создать резюме'}
      </h1>

      <p className="mb-8 text-gray-600">
        Расскажите о себе и своих профессиональных навыках.
      </p>

      <ResumeForm
        register={register}
        control={control}
        errors={errors}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={savedResume ? 'Сохранить изменения' : 'Создать резюме'}
      />
    </section>
  );
};
