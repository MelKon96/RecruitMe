import { useContext } from 'react';
import { ResumeContext } from './ResumeContext';

export function useResumeContext() {
  const context = useContext(ResumeContext);

  if (!context) {
    throw new Error('useResumeContext must be used within ResumeProvider');
  }

  return context;
}
