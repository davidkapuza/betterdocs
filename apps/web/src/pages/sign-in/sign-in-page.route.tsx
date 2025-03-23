import { compose, withSuspense } from '@/shared/lib/react';
import { pathKeys } from '@/shared/lib/react-router';
import React from 'react';
import { RouteObject } from 'react-router';
import { SignInPageSkeleton } from './sign-in-page.skeleton';

const SignInPage = React.lazy(() =>
  import('./sign-in-page.ui').then((module) => ({
    default: module.SignInPage,
  }))
);

const enhance = compose((component) =>
  withSuspense(component, { FallbackComponent: SignInPageSkeleton })
);

export const signInPageRoute: RouteObject = {
  path: pathKeys.auth.signIn(),
  element: React.createElement(enhance(SignInPage)),
};
