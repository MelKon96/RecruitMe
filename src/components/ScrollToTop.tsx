import { useEffect, useState } from 'react';

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="Вернуться наверх"
      title="Вернуться наверх"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`group fixed left-0 top-0 z-40 hidden h-dvh w-16 items-center justify-center border-r transition-all duration-200 focus-visible:outline-2 focus-visible:outline-indigo-500 min-[1300px]:flex ${
        isVisible
          ? 'translate-x-0 cursor-pointer border-gray-200 bg-gray-100/50 opacity-100 hover:border-indigo-200 hover:bg-indigo-50/80'
          : 'pointer-events-none -translate-x-full border-transparent opacity-0'
      }`}
      tabIndex={isVisible ? 0 : -1}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white opacity-70 shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:opacity-100 group-focus-visible:opacity-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
      </span>
    </button>
  );
};
