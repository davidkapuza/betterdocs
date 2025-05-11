import { compose } from '@/shared/lib/react';
import { ErrorHandler } from '@/shared/ui/error-handler';
import { withErrorBoundary } from 'react-error-boundary';
import { BrowserRouter } from './router-provider';
import { ApolloProvider } from './apollo-provider';
import { Toaster } from '@betterdocs/ui/sonner';
import { ThemeProvider } from '@betterdocs/ui/theme-provider';
import { AssistantRuntimeProvider } from './assistant-runtime-provider';

const enhance = compose((component) =>
  withErrorBoundary(component, {
    FallbackComponent: ErrorHandler,
  })
);

export const Providers = enhance(() => (
  <ApolloProvider>
    <AssistantRuntimeProvider>
      <ThemeProvider>
        <Toaster />
        <BrowserRouter />
      </ThemeProvider>
    </AssistantRuntimeProvider>
  </ApolloProvider>
));
