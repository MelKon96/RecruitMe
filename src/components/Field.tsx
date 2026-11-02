import type { ReactNode } from 'react';

interface IFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}

export const Field = ({ label, htmlFor, error, children }: IFieldProps) => {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      {children}

      {/* Здесь можно дать ошибке id={`${htmlFor}-error`} и role="alert", а на input в ResumeForm повесить aria-invalid и aria-describedby с этим id. Сейчас подпись есть, а текст ошибки с полем не связан. */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
