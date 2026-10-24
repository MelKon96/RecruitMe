import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router';
import { UsersPage } from '../pages/UsersPage';
import { UserDetailPage } from '../pages/UserDetailPage';
import { Header } from '../components/Header';

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header />
      <Outlet />
    </div>
  ),
});

// индексный роут
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: UsersPage,
});

// динамический роут
const userDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/users/$id',
  component: UserDetailPage,
});

const routeTree = rootRoute.addChildren([indexRoute, userDetailRoute]);
export const router = createRouter({ routeTree });

// Регистрация типов роутера для TypeScript
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
