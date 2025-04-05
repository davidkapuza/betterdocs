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
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { GraphQLError } from 'graphql';
import { pathKeys } from '../react-router';

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
    window.location.href = pathKeys.auth.signIn()
    throw err;
  }
};

export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    addTypename: false,
  }),
});
