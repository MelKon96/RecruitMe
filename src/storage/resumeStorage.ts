import type { IUser } from '../types/user';

export const RESUME_STORAGE_KEY = 'recruit_me_resume';

export interface IResumeStorage {
  resumes: IUser[];
  activeResumeId: number | null;
}

const emptyStorage: IResumeStorage = {
  resumes: [],
  activeResumeId: null,
};

export const getResumeStorage = (): IResumeStorage => {
  try {
    const savedData = localStorage.getItem(RESUME_STORAGE_KEY);

    if (!savedData) return emptyStorage;

    const parsedData: unknown = JSON.parse(savedData);

    if (
      typeof parsedData === 'object' &&
      parsedData !== null &&
      'resumes' in parsedData &&
      Array.isArray(parsedData.resumes)
    ) {
      return parsedData as IResumeStorage;
    }

    // Перенос старого формата: одно резюме -> массив резюме.
    if (
      typeof parsedData === 'object' &&
      parsedData !== null &&
      'id' in parsedData &&
      typeof parsedData.id === 'number'
    ) {
      const resume = parsedData as IUser;

      return {
        resumes: [resume],
        activeResumeId: resume.id,
      };
    }

    return emptyStorage;
  } catch {
    return emptyStorage;
  }
};

export const saveResumeStorage = (data: IResumeStorage): void => {
  localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(data));
};
