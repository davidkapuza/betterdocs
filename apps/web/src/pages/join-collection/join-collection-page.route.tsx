import { compose, withSuspense } from '@/shared/lib/react';
import React from 'react';
import { RouteObject } from 'react-router';

const JoinCollectionPage = React.lazy(() =>
  import('./join-collection-page.ui').then((module) => ({
    default: module.JoinCollectionPage,
  }))
);

const enhance = compose((component) =>
  withSuspense(component, { fallback: <div>Loading...</div> })
);

export const joinCollectionPageRoute: RouteObject = {
  path: 'join/:token',
  element: React.createElement(enhance(JoinCollectionPage)),
};
