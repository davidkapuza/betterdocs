import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
} from 'react-router';
import { signInPageRoute } from '@/pages/sign-in';
import { signUpPageRoute } from '@/pages/sign-up';
import React from 'react';

// https://github.com/remix-run/react-router/discussions/10166
function BubbleError() {
  const error = useRouteError();

  if (error) throw error;
  return null;
}

const AuthLayout = React.lazy(() =>
  import('@/pages/layouts').then((module) => ({
    default: module.AuthLayout,
  }))
);

const browserRouter = createBrowserRouter([
  {
    errorElement: <BubbleError />,
    children: [
      {
        element: React.createElement(AuthLayout),
        children: [signInPageRoute, signUpPageRoute],
      },
    ],
  },
]);

export function BrowserRouter() {
  return <RouterProvider router={browserRouter} />;
}
