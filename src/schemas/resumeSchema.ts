import { z } from 'zod';
import { DEV_LEVELS } from '../constants/devLevels';

export const resumeSchema = z.object({
  firstName: z.string().trim().min(1, 'Введите имя'),
  lastName: z.string().trim().min(1, 'Введите фамилию'),
  position: z.string().trim().min(1, 'Укажите желаемую должность'),
  level: z.enum(DEV_LEVELS),
  email: z.email('Введите корректный email'),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{7,20}$/, 'Введите корректный номер телефона')
    .refine(
      (phone) =>
        (phone.match(/\d/g) ?? []).length >= 7 &&
        (phone.match(/\d/g) ?? []).length <= 15,
      'Номер должен содержать от 7 до 15 цифр',
    ),
  skills: z.array(z.string()).min(1, 'Укажите хотя бы один навык'),
  bio: z.string().trim().min(1, 'Расскажите о себе'),
  companyName: z.string().trim(),
  department: z.string().trim(),
  location: z.string().trim(),
});

export type ResumeFormValues = z.infer<typeof resumeSchema>;
