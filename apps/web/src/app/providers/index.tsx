import { compose } from '@/shared/lib/react';
import { ErrorHandler } from '@/shared/ui/error-handler';
import { withErrorBoundary } from 'react-error-boundary';
import { BrowserRouter } from './router-provider';
import { ApolloProvider } from './apollo-provider';
import { Toaster } from '@betterdocs/ui';
import { ThemeProvider } from '@betterdocs/ui';

const enhance = compose((component) =>
  withErrorBoundary(component, {
    FallbackComponent: ErrorHandler,
  })
);

export const Providers = enhance(() => (
  <ApolloProvider>
    <ThemeProvider>
      <Toaster />
      <BrowserRouter />
    </ThemeProvider>
  </ApolloProvider>
));
