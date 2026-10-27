import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  Outlet,
} from '@tanstack/react-router';

import { UsersPage } from '../pages/UsersPage';
import { UserDetailPage } from '../pages/UserDetailPage';
import { MyResumesPage } from '../pages/MyResumesPage';

import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ScrollToTop } from '../components/ScrollToTop';
import { MessagesPage } from '../pages/MessagesPage';
import { NotFoundPage } from '../pages/NotFoundPage';

const rootRoute = createRootRoute({
  component: () => (
    <div className="flex min-h-screen flex-col bg-gray-50 font-sans text-gray-900">
      <ScrollToTop />
      <Header />

      <div className="flex-1">
        <Outlet />
      </div>

      <Footer />
    </div>
  ),
  notFoundComponent: NotFoundPage,
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

const myResumesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-resumes',
  component: MyResumesPage,
});

const createResumeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-resume',
  component: lazyRouteComponent(
    () => import('../pages/CreateResumePage'),
    'CreateResumePage',
  ),
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat/$userId',
  component: lazyRouteComponent(() => import('../pages/ChatPage'), 'ChatPage'),
});

const messagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/messages',
  component: MessagesPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  userDetailRoute,
  myResumesRoute,
  createResumeRoute,
  chatRoute,
  messagesRoute,
]);

export const router = createRouter({
  routeTree,
  basepath: import.meta.env.PROD ? '/RecruitMe' : '/',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
