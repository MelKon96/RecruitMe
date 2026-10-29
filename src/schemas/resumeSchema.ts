import { z } from 'zod';

export const resumeSchema = z.object({
  firstName: z.string().trim().min(1, 'Введите имя'),
  lastName: z.string().trim().min(1, 'Введите фамилию'),
  position: z.string().trim().min(1, 'Укажите желаемую должность'),
  // Здесь можно заменить литералы на z.enum(DEV_LEVELS), если уровни живут в одной константе.
  level: z.enum(['Junior', 'Middle', 'Senior', 'Lead']),
  email: z.email('Введите корректный email'),
  phone: z.string(),
  // Здесь можно описать skills как z.array(z.string()).min(1): сейчас это строка через запятую, а форма параллельно держит массив.
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
