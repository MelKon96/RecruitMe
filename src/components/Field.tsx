import type { ReactNode } from 'react';

interface IFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}

export const Field = ({ label, htmlFor, error, children }: IFieldProps) => {
  const errorId = `${htmlFor}-error`;

  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      {children}

      {error && (
        <p id={errorId} role="alert" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};
