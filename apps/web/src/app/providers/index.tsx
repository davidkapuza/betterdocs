import { compose } from '@/shared/lib/react';
import { ErrorHandler } from '@/shared/ui/error-handler';
import { withErrorBoundary } from 'react-error-boundary';
import { BrowserRouter } from './router-provider';
import { ApolloProvider } from './apollo-provider';

const enhance = compose((component) =>
  withErrorBoundary(component, {
    FallbackComponent: ErrorHandler,
  })
);

export const Providers = enhance(() => (
  <ApolloProvider>
    <BrowserRouter />
  </ApolloProvider>
));
