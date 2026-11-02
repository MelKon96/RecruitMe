import { useResumeContext } from '../context/useResumeContext';

export const useResume = () => {
  return useResumeContext().resume;
};
