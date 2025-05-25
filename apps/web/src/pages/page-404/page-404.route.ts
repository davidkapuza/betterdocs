import { compose, withSuspense } from '@/shared/lib/react';
import { pathKeys } from '@/shared/lib/react-router';
import { PageLoader } from '@/shared/ui/page-loader';
import React from 'react';
import { RouteObject } from 'react-router';

const Page404 = React.lazy(() =>
  import('./page-404.ui').then((module) => ({
    default: module.Page404,
  }))
);

const enhance = compose((component) =>
  withSuspense(component, {
    FallbackComponent: PageLoader,
  })
);

export const page404Route: RouteObject = {
  path: pathKeys.page404(),
  element: React.createElement(enhance(Page404)),
};
