import { RouterProvider } from '@tanstack/react-router';
import { router } from '../router/router';

// Здесь можно сделать именованный export function App: в остальных модулях default export не используется, импорт в main.tsx придётся поправить.
function App() {
  return <RouterProvider router={router} />;
}

export default App;
