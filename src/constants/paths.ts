// Здесь можно сделать ROUTES единственным источником путей и собирать routeTree из этих констант: в router.tsx те же строки записаны ещё раз.
export const ROUTES = {
  home: '/',
  users: '/users/$id',
  messages: '/messages',
  chat: '/chat/$userId',
  myResumes: '/my-resumes',
  createResume: '/create-resume',
} as const;
