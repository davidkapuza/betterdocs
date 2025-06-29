import { compose, withSuspense } from '@/shared/lib/react';
import React from 'react';
import { RouteObject } from 'react-router';
import { DocumentsPageSkeleton } from './documents-page.skeleton';

const DocumentPage = React.lazy(() =>
  import('./documents-page.ui').then((module) => ({
    default: module.DocumentPage,
  }))
);

const enhance = compose((component) =>
  withSuspense(component, { FallbackComponent: DocumentsPageSkeleton })
);

export const documentsPageRoute: RouteObject = {
  path: ':collectionId',
  element: React.createElement(enhance(DocumentPage)),
};
