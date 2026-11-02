import { useEffect, useState } from 'react';
import type { IUser } from '../types/user';
import { getResume } from '../storage/resumeStorage';

export const useResume = () => {
  const [resume, setResume] = useState<IUser | null>(getResume);

  useEffect(() => {
    const updateResume = () => {
      setResume(getResume());
    };

    window.addEventListener('resume-updated', updateResume);
    window.addEventListener('storage', updateResume);

    return () => {
      window.removeEventListener('resume-updated', updateResume);
      window.removeEventListener('storage', updateResume);
    };
  }, []);

  return resume;
};
