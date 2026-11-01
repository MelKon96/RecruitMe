import { Outlet } from '@tanstack/react-router';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';

export const RootLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 font-sans text-gray-900">
      <ScrollToTop />
      <Header />

      <div className="flex-1">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};