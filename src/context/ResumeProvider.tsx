import { useCallback, useEffect, useState, type ReactNode } from 'react';
import type { IUser } from '../types/user';
import { getResume, RESUME_STORAGE_KEY } from '../storage/resumeStorage';
import { ResumeContext } from './ResumeContext';

interface ResumeProviderProps {
  children: ReactNode;
}

export function ResumeProvider({ children }: ResumeProviderProps) {
  const [resume, setResume] = useState<IUser | null>(getResume);

  const saveResume = useCallback((newResume: IUser) => {
    localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(newResume));
    setResume(newResume);
  }, []);

  const removeResume = useCallback(() => {
    localStorage.removeItem(RESUME_STORAGE_KEY);
    setResume(null);
  }, []);

  useEffect(() => {
    const updateResume = () => {
      setResume(getResume());
    };

    window.addEventListener('storage', updateResume);

    return () => {
      window.removeEventListener('storage', updateResume);
    };
  }, []);

  return (
    <ResumeContext.Provider value={{ resume, saveResume, removeResume }}>
      {children}
    </ResumeContext.Provider>
  );
}
