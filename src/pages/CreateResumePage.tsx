import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { DevLevel, IUser } from '../types/user';
import { resumeSchema } from '../schemas/resumeSchema';
import type { ResumeFormValues } from '../schemas/resumeSchema';
import { ResumeForm } from '../components/ResumeForm';

const RESUME_STORAGE_KEY = 'recruit_me_resume';

const getSavedResume = (): IUser | null => {
  try {
    const savedResume = localStorage.getItem(RESUME_STORAGE_KEY);
    return savedResume ? (JSON.parse(savedResume) as IUser) : null;
  } catch {
    return null;
  }
};

export const CreateResumePage = () => {
  const navigate = useNavigate();
  const [savedResume] = useState<IUser | null>(getSavedResume);

  const [skills, setSkills] = useState<string[]>(savedResume?.skills ?? []);

  const {
    register,
    handleSubmit,
    setValue,
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
      skills: savedResume?.skills.join(', ') ?? '',
      bio: savedResume?.bio ?? '',
      companyName: savedResume?.company.name ?? '',
      department: savedResume?.company.department ?? '',
      location: savedResume?.location ?? '',
    },
  });

  const handleSkillsChange = (updatedSkills: string[]) => {
    setSkills(updatedSkills);

    setValue('skills', updatedSkills.join(', '), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = (data: ResumeFormValues) => {
    const resume: IUser = {
      id: -1,
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
      skills,
      level: data.level as DevLevel,
      bio: data.bio,
      location: data.location || undefined,
    };

    localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(resume));
    window.dispatchEvent(new Event('resume-updated'));

    navigate({ to: '/my-resumes' });
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        {savedResume ? 'Редактировать резюме' : 'Создать резюме'}
      </h1>

      <ResumeForm
        register={register}
        errors={errors}
        skills={skills}
        onSkillsChange={handleSkillsChange}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={savedResume ? 'Сохранить изменения' : 'Создать резюме'}
      />
    </section>
  );
};
