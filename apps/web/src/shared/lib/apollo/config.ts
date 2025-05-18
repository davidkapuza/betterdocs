import {
  RefreshTokensDocument,
  RefreshTokensMutation,
} from '@/shared/gql/__generated__/operations';
import { useSessionStore } from '@/shared/session';
import {
  ApolloClient,
  FetchResult,
  GraphQLRequest,
  InMemoryCache,
  Observable,
  createHttpLink,
  from,
  split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { GraphQLError } from 'graphql';
import { pathKeys } from '../react-router';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:3000/subscriptions',
    connectionParams: {
      Authorization: `Bearer ${
        useSessionStore.getState().session?.accessToken
      }`,
    },
  })
);

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
});

function isRefreshRequest(operation: GraphQLRequest) {
  return operation.operationName === 'RefreshTokens';
}

function returnTokenDependingOnOperation(operation: GraphQLRequest) {
  const session = useSessionStore.getState().session;
  if (!session) return '';
  if (isRefreshRequest(operation)) return session.refreshToken;
  else return session.accessToken;
}

const authLink = setContext((operation, { headers }) => {
  const token = returnTokenDependingOnOperation(operation);

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        switch (err.extensions?.code) {
          case 'UNAUTHENTICATED': {
            // ignore 401 error for a refresh request
            if (operation.operationName === 'RefreshTokens') return;

            const observable = new Observable<
              FetchResult<Record<string, unknown>>
            >((observer) => {
              (async () => {
                try {
                  const accessToken = await refreshToken();

                  if (!accessToken) {
                    throw new GraphQLError('Empty AccessToken');
                  }

                  // Retry the failed request
                  const subscriber = {
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                  };

                  forward(operation).subscribe(subscriber);
                } catch (err) {
                  observer.error(err);
                }
              })();
            });

            return observable;
          }
        }
      }
    }

    if (networkError) console.log(`[Network error]: ${networkError}`);
  }
);

const refreshToken = async () => {
  try {
    const refreshResolverResponse = await client.mutate<RefreshTokensMutation>({
      mutation: RefreshTokensDocument,
    });

    const tokens = refreshResolverResponse.data?.refreshTokens;
    if (tokens) {
      useSessionStore
        .getState()
        .updateTokens(tokens.accessToken, tokens.refreshToken);
    }

    return tokens?.accessToken;
  } catch (err) {
    useSessionStore.getState().clearSession();
    window.location.href = pathKeys.auth.signIn();
    throw err;
  }
};

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

export const client = new ApolloClient({
  link: from([errorLink, authLink, splitLink]),
  cache: new InMemoryCache(),
});
