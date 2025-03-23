import { compose, withSuspense } from '@/shared/lib/react';
import { pathKeys } from '@/shared/lib/react-router';
import React from 'react';
import { RouteObject } from 'react-router';
import { SignUpPageSkeleton } from './sign-up-page.skeleton';

const SignUpPage = React.lazy(() =>
  import('./sign-up-page.ui').then((module) => ({
    default: module.SignUpPage,
  }))
);

const enhance = compose((component) =>
  withSuspense(component, { FallbackComponent: SignUpPageSkeleton })
);

export const signUpPageRoute: RouteObject = {
  path: pathKeys.auth.signUp(),
  element: React.createElement(enhance(SignUpPage)),
};
