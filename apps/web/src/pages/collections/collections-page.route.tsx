import { compose, withSuspense } from '@/shared/lib/react';
import { pathKeys } from '@/shared/lib/react-router';
import React from 'react';
import { RouteObject } from 'react-router';
import { CollectionsPageSkeleton } from './collections-page.skeleton';

const CollectionsPage = React.lazy(() =>
  import('./collections-page.ui').then((module) => ({
    default: module.CollectionsPage,
  }))
);

const CollectionPage = React.lazy(() =>
  import('./collections-page.ui').then((module) => ({
    default: module.CollectionPage,
  }))
);

const enhance = compose((component) =>
  withSuspense(component, { FallbackComponent: CollectionsPageSkeleton })
);

export const collectionsPageRoute: RouteObject = {
  path: pathKeys.root,
  children: [
    {
      index: true,
      element: React.createElement(enhance(CollectionsPage)),
    },
    {
      path: ':collectionId',
      element: React.createElement(enhance(CollectionPage)),
    },
  ],
};
