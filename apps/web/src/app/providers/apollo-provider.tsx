import { ApolloProvider as Apollo } from '@apollo/client';
import { ReactNode } from 'react';
import { client } from '@/shared/lib/apollo';

type ApolloProviderProps = {
  children: ReactNode;
};

export function ApolloProvider({ children }: ApolloProviderProps) {
  return <Apollo client={client}>{children}</Apollo>;
}
