import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
} from 'react-router';
import { collectionsPageRoute } from '@/pages/collections';

// https://github.com/remix-run/react-router/discussions/10166
function BubbleError() {
  const error = useRouteError();

  if (error) throw error;
  return null;
}

const browserRouter = createBrowserRouter([
  {
    errorElement: <BubbleError />,
    children: [collectionsPageRoute],
  },
]);

export function BrowserRouter() {
  return <RouterProvider router={browserRouter} />;
}
