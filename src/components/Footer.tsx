export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 text-center">
        <p className="text-xs text-gray-500">
          © {currentYear} Recruit Me. Все права защищены.
        </p>
      </div>
    </footer>
  );
};
