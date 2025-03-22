import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as Apollo,
} from '@apollo/client';
import { ReactNode } from 'react';

type ApolloProviderProps = {
  children: ReactNode;
};

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
});

export function ApolloProvider({ children }: ApolloProviderProps) {
  return <Apollo client={client}>{children}</Apollo>;
}
