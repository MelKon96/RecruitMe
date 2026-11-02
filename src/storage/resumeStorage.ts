import type { IUser } from '../types/user';

const RESUME_STORAGE_KEY = 'recruit_me_resume';
const RESUME_UPDATED_EVENT = 'resume-updated';

export const getResume = (): IUser | null => {
  try {
    const savedResume = localStorage.getItem(RESUME_STORAGE_KEY);
    return savedResume ? (JSON.parse(savedResume) as IUser) : null;
  } catch {
    return null;
  }
};

// dispatchEvent ниже — обходной путь: запись в localStorage не обновляет React в этой же вкладке.
// По-человечески держать резюме в общем state. Отдельный Zustand/Redux не нужен.
// Новый context/ResumeContext.tsx: useState + save/remove. save пишет в localStorage и сразу меняет state.
// Связанные файлы:
// - main.tsx: обернуть App в ResumeProvider;
// - hooks/useResume.ts: читать контекст и убрать подписку на resume-updated;
// - pages/CreateResumePage.tsx: save брать из провайдера;
// - pages/MyResumesPage.tsx: remove брать из провайдера;
// - pages/UsersPage.tsx и pages/UserDetailPage.tsx не трогать, если useResume по-прежнему возвращает резюме.
// Слушатель window "storage" оставить в провайдере: он нужен другим вкладкам, это событие до них не доходит.
export const saveResume = (resume: IUser): void => {
  localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(resume));
  window.dispatchEvent(new Event(RESUME_UPDATED_EVENT));
};

export const removeResume = (): void => {
  localStorage.removeItem(RESUME_STORAGE_KEY);
  // То же событие, что в saveResume. Уходит вместе с переходом на ResumeProvider, описанным выше.
  window.dispatchEvent(new Event(RESUME_UPDATED_EVENT));
};
