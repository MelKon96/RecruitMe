import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
} from '@tanstack/react-router';

import { UsersPage } from '../pages/UsersPage';
import { UserDetailPage } from '../pages/UserDetailPage';
import { MyResumesPage } from '../pages/MyResumesPage';
import { MessagesPage } from '../pages/MessagesPage';
import { NotFoundPage } from '../pages/NotFoundPage';

import { RootLayout } from '../components/RootLayout';
import { ROUTES } from '../constants/paths';

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.home,
  validateSearch: (search: Record<string, unknown>): { search?: string } => {
    const value = search.search;

    return typeof value === 'string' && value.length > 0
      ? { search: value }
      : {};
  },
  component: UsersPage,
});

const userDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.users,
  component: UserDetailPage,
});

const myResumesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.myResumes,
  component: MyResumesPage,
});

const createResumeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.createResume,
  component: lazyRouteComponent(
    () => import('../pages/CreateResumePage'),
    'CreateResumePage',
  ),
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.chat,
  validateSearch: (
    search: Record<string, unknown>,
  ): { from?: 'user' | 'messages' } => ({
    from:
      search.from === 'user' || search.from === 'messages'
        ? search.from
        : undefined,
  }),
  component: lazyRouteComponent(() => import('../pages/ChatPage'), 'ChatPage'),
});

const messagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.messages,
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
  basepath: import.meta.env.BASE_URL,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
