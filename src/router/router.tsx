import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router';
import { UsersPage } from '../pages/UsersPage';
import { UserDetailPage } from '../pages/UserDetailPage';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ScrollToTop } from '../components/ScrollToTop';

const rootRoute = createRootRoute({
  component: () => (
    <div className="flex min-h-screen flex-col bg-gray-50 font-sans text-gray-900">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: UsersPage,
});

const userDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/users/$id',
  component: UserDetailPage,
});

const routeTree = rootRoute.addChildren([indexRoute, userDetailRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
