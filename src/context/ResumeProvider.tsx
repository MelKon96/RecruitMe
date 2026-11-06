import { useCallback, useEffect, useState, type ReactNode } from 'react';
import type { IUser } from '../types/user';
import {
  getResumeStorage,
  saveResumeStorage,
  type IResumeStorage,
} from '../storage/resumeStorage';
import { ResumeContext } from './ResumeContext';

interface ResumeProviderProps {
  children: ReactNode;
}

export function ResumeProvider({ children }: ResumeProviderProps) {
  const [storage, setStorage] = useState<IResumeStorage>(getResumeStorage);

  const saveResume = useCallback(
    (newResume: IUser) => {
      const existingResume = storage.resumes.some(
        (resume) => resume.id === newResume.id,
      );

      const resumes = existingResume
        ? storage.resumes.map((resume) =>
            resume.id === newResume.id ? newResume : resume,
          )
        : [...storage.resumes, newResume];

      const nextStorage: IResumeStorage = {
        resumes,
        activeResumeId: storage.activeResumeId ?? newResume.id,
      };

      saveResumeStorage(nextStorage);
      setStorage(nextStorage);
    },
    [storage],
  );

  const removeResume = useCallback(
    (id: number) => {
      const resumes = storage.resumes.filter((resume) => resume.id !== id);

      const nextStorage: IResumeStorage = {
        resumes,
        activeResumeId:
          storage.activeResumeId === id
            ? (resumes[0]?.id ?? null)
            : storage.activeResumeId,
      };

      saveResumeStorage(nextStorage);
      setStorage(nextStorage);
    },
    [storage],
  );

  const setActiveResume = useCallback(
    (id: number) => {
      const nextStorage: IResumeStorage = {
        ...storage,
        activeResumeId: storage.activeResumeId === id ? null : id,
      };

      saveResumeStorage(nextStorage);
      setStorage(nextStorage);
    },
    [storage],
  );

  useEffect(() => {
    const updateResumeStorage = () => {
      setStorage(getResumeStorage());
    };

    window.addEventListener('storage', updateResumeStorage);

    return () => {
      window.removeEventListener('storage', updateResumeStorage);
    };
  }, []);

  const activeResume =
    storage.resumes.find((resume) => resume.id === storage.activeResumeId) ??
    null;

  return (
    <ResumeContext.Provider
      value={{
        resumes: storage.resumes,
        activeResumeId: storage.activeResumeId,
        activeResume,
        saveResume,
        removeResume,
        setActiveResume,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}
