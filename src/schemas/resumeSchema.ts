import { z } from 'zod';

export const resumeSchema = z.object({
  firstName: z.string().trim().min(1, 'Введите имя'),
  lastName: z.string().trim().min(1, 'Введите фамилию'),
  position: z.string().trim().min(1, 'Укажите желаемую должность'),
  level: z.enum(['Junior', 'Middle', 'Senior', 'Lead']),
  email: z.email('Введите корректный email'),
  phone: z.string(),
  skills: z
    .string()
    .trim()
    .min(1, 'Укажите хотя бы один навык')
    .refine(
      (value) => value.split(',').some((skill) => skill.trim().length > 0),
      'Укажите хотя бы один навык',
    ),
  bio: z.string().trim().min(1, 'Расскажите о себе'),
  companyName: z.string(),
  department: z.string(),
  location: z.string(),
});

export type ResumeFormValues = z.infer<typeof resumeSchema>;
