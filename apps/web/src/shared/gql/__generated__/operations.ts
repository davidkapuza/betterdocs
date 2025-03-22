import * as types from "@nx-apollo/models-graphql"
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CollectionsQueryVariables = types.Exact<{ [key: string]: never; }>;


export type CollectionsQuery = { __typename?: 'Query', collections: Array<{ __typename?: 'Collection', id: number, name: string, description: string, documents: Array<{ __typename?: 'Document', id: number, title: string, content: string }> }> };


export const CollectionsDocument = gql`
    query Collections {
  collections {
    id
    name
    description
    documents {
      id
      title
      content
    }
  }
}
    `;

/**
 * __useCollectionsQuery__
 *
 * To run a query within a React component, call `useCollectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useCollectionsQuery(baseOptions?: Apollo.QueryHookOptions<CollectionsQuery, CollectionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CollectionsQuery, CollectionsQueryVariables>(CollectionsDocument, options);
      }
export function useCollectionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionsQuery, CollectionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CollectionsQuery, CollectionsQueryVariables>(CollectionsDocument, options);
        }
export function useCollectionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CollectionsQuery, CollectionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CollectionsQuery, CollectionsQueryVariables>(CollectionsDocument, options);
        }
export type CollectionsQueryHookResult = ReturnType<typeof useCollectionsQuery>;
export type CollectionsLazyQueryHookResult = ReturnType<typeof useCollectionsLazyQuery>;
export type CollectionsSuspenseQueryHookResult = ReturnType<typeof useCollectionsSuspenseQuery>;
export type CollectionsQueryResult = Apollo.QueryResult<CollectionsQuery, CollectionsQueryVariables>;