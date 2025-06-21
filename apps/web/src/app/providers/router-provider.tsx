import {
  createBrowserRouter,
  LoaderFunctionArgs,
  redirect,
  RouterProvider,
  useRouteError,
} from 'react-router';
import { signInPageRoute } from '@/pages/sign-in';
import { signUpPageRoute } from '@/pages/sign-up';
import React from 'react';
import { collectionsPageRoute } from '@/pages/collections';
import { compose, withSuspense } from '@/shared/lib/react';
import { pathKeys } from '@/shared/lib/react-router';
import { page404Route } from '@/pages/page-404';
import { PageLoader } from '@/shared/ui/page-loader';
import { RootLayout } from '@/pages/layouts';

// https://github.com/remix-run/react-router/discussions/10166
function BubbleError() {
  const error = useRouteError();

  if (error) throw error;
  return null;
}

const enhance = compose((component) =>
  // TODO Create skeleton
  withSuspense(component, { fallback: <div>Loading...</div> })
);

const layoutLoader = (args: LoaderFunctionArgs) =>
  import('@/pages/layouts/layout.model').then((module) =>
    module.RootLayout.layout(args)
  );

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
        loader: layoutLoader,
        HydrateFallback: PageLoader,
        element: React.createElement(RootLayout),
        children: [collectionsPageRoute],
      },
      {
        element: React.createElement(enhance(AuthLayout)),
        children: [signInPageRoute, signUpPageRoute],
      },
      {
        path: '*',
        loader: () => redirect(pathKeys.page404()),
      },
      page404Route,
    ],
  },
]);

export function BrowserRouter() {
  return <RouterProvider router={browserRouter} />;
}
