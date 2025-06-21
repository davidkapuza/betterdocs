import * as types from "@nx-apollo/models-graphql"
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SignUpMutationVariables = types.Exact<{
  signUpInput: types.SignUpInput;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp?: any | null };

export type SignInMutationVariables = types.Exact<{
  signInInput: types.SignInInput;
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn: { __typename?: 'SignInResponseModel', accessToken: string, refreshToken: string, user: { __typename?: 'User', id: number, email: string, firstName: string, lastName: string, role: types.Role, status: types.UserStatus } } };

export type RefreshTokensMutationVariables = types.Exact<{ [key: string]: never; }>;


export type RefreshTokensMutation = { __typename?: 'Mutation', refreshTokens: { __typename?: 'TokensResponseModel', accessToken: string, refreshToken: string } };

export type CollectionsQueryVariables = types.Exact<{ [key: string]: never; }>;


export type CollectionsQuery = { __typename?: 'Query', collections: Array<{ __typename?: 'Collection', id: number, name: string, description: string, documents: Array<{ __typename?: 'Document', id: number, title: string, content: string }> }> };

export type CollectionQueryVariables = types.Exact<{
  collectionId: types.Scalars['Int']['input'];
}>;


export type CollectionQuery = { __typename?: 'Query', collection: { __typename?: 'Collection', id: number, name: string, description: string, documents: Array<{ __typename?: 'Document', id: number, title: string, content: string, author: { __typename?: 'User', role: types.Role, status: types.UserStatus, id: number, email: string, firstName: string, lastName: string } }> } };

export type CollectionDocumentsQueryVariables = types.Exact<{
  collectionId: types.Scalars['Int']['input'];
}>;


export type CollectionDocumentsQuery = { __typename?: 'Query', collection: { __typename?: 'Collection', documents: Array<{ __typename?: 'Document', id: number, title: string, collectionId: number, children: Array<{ __typename?: 'Document', id: number, title: string, collectionId: number }> }> } };

export type DocumentTreeQueryVariables = types.Exact<{
  getDocumentInput: types.GetDocumentInput;
}>;


export type DocumentTreeQuery = { __typename?: 'Query', document: { __typename?: 'Document', id: number, title: string, collectionId: number, children: Array<{ __typename?: 'Document', id: number, title: string, collectionId: number, children: Array<{ __typename?: 'Document', id: number, title: string, collectionId: number, children: Array<{ __typename?: 'Document', id: number, title: string, collectionId: number }> }> }> } };

export type QueryCollectionSubscriptionVariables = types.Exact<{
  queryCollectionInput: types.QueryCollectionInput;
}>;


export type QueryCollectionSubscription = { __typename?: 'Subscription', queryCollection: { __typename?: 'QueryResponse', token: string, completed: boolean } };

export type GetDocumentQueryVariables = types.Exact<{
  getDocumentInput: types.GetDocumentInput;
}>;


export type GetDocumentQuery = { __typename?: 'Query', document: { __typename?: 'Document', id: number, title: string, content: string, collectionId: number, author: { __typename?: 'User', role: types.Role, status: types.UserStatus, id: number, email: string, firstName: string, lastName: string } } };

export type UpdateDocumentMutationVariables = types.Exact<{
  updateDocumentInput: types.UpdateDocumentInput;
}>;


export type UpdateDocumentMutation = { __typename?: 'Mutation', updateDocument: { __typename?: 'Document', id: number, title: string, content: string, parentId?: number | null, collectionId: number, author: { __typename?: 'User', role: types.Role, status: types.UserStatus, id: number, email: string, firstName: string, lastName: string } } };

export type CreateDocumentMutationVariables = types.Exact<{
  createDocumentInput: types.CreateDocumentInput;
}>;


export type CreateDocumentMutation = { __typename?: 'Mutation', createDocument: { __typename?: 'Document', id: number, title: string, content: string, collectionId: number, author: { __typename?: 'User', role: types.Role, status: types.UserStatus, id: number, email: string, firstName: string, lastName: string } } };

export type UserQueryVariables = types.Exact<{ [key: string]: never; }>;


export type UserQuery = { __typename?: 'Query', user: { __typename?: 'User', role: types.Role, status: types.UserStatus, id: number, email: string, firstName: string, lastName: string } };


export const SignUpDocument = gql`
    mutation SignUp($signUpInput: SignUpInput!) {
  signUp(signUpInput: $signUpInput)
}
    `;
export type SignUpMutationFn = Apollo.MutationFunction<SignUpMutation, SignUpMutationVariables>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      signUpInput: // value for 'signUpInput'
 *   },
 * });
 */
export function useSignUpMutation(baseOptions?: Apollo.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, options);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = Apollo.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;
export const SignInDocument = gql`
    mutation SignIn($signInInput: SignInInput!) {
  signIn(signInInput: $signInInput) {
    user {
      id
      email
      firstName
      lastName
      role
      status
    }
    accessToken
    refreshToken
  }
}
    `;
export type SignInMutationFn = Apollo.MutationFunction<SignInMutation, SignInMutationVariables>;

/**
 * __useSignInMutation__
 *
 * To run a mutation, you first call `useSignInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signInMutation, { data, loading, error }] = useSignInMutation({
 *   variables: {
 *      signInInput: // value for 'signInInput'
 *   },
 * });
 */
export function useSignInMutation(baseOptions?: Apollo.MutationHookOptions<SignInMutation, SignInMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignInMutation, SignInMutationVariables>(SignInDocument, options);
      }
export type SignInMutationHookResult = ReturnType<typeof useSignInMutation>;
export type SignInMutationResult = Apollo.MutationResult<SignInMutation>;
export type SignInMutationOptions = Apollo.BaseMutationOptions<SignInMutation, SignInMutationVariables>;
export const RefreshTokensDocument = gql`
    mutation RefreshTokens {
  refreshTokens {
    accessToken
    refreshToken
  }
}
    `;
export type RefreshTokensMutationFn = Apollo.MutationFunction<RefreshTokensMutation, RefreshTokensMutationVariables>;

/**
 * __useRefreshTokensMutation__
 *
 * To run a mutation, you first call `useRefreshTokensMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefreshTokensMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refreshTokensMutation, { data, loading, error }] = useRefreshTokensMutation({
 *   variables: {
 *   },
 * });
 */
export function useRefreshTokensMutation(baseOptions?: Apollo.MutationHookOptions<RefreshTokensMutation, RefreshTokensMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RefreshTokensMutation, RefreshTokensMutationVariables>(RefreshTokensDocument, options);
      }
export type RefreshTokensMutationHookResult = ReturnType<typeof useRefreshTokensMutation>;
export type RefreshTokensMutationResult = Apollo.MutationResult<RefreshTokensMutation>;
export type RefreshTokensMutationOptions = Apollo.BaseMutationOptions<RefreshTokensMutation, RefreshTokensMutationVariables>;
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
export const CollectionDocument = gql`
    query Collection($collectionId: Int!) {
  collection(collectionId: $collectionId) {
    id
    name
    description
    documents {
      id
      title
      content
      author {
        role
        status
        id
        email
        firstName
        lastName
      }
    }
  }
}
    `;

/**
 * __useCollectionQuery__
 *
 * To run a query within a React component, call `useCollectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionQuery({
 *   variables: {
 *      collectionId: // value for 'collectionId'
 *   },
 * });
 */
export function useCollectionQuery(baseOptions: Apollo.QueryHookOptions<CollectionQuery, CollectionQueryVariables> & ({ variables: CollectionQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CollectionQuery, CollectionQueryVariables>(CollectionDocument, options);
      }
export function useCollectionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionQuery, CollectionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CollectionQuery, CollectionQueryVariables>(CollectionDocument, options);
        }
export function useCollectionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CollectionQuery, CollectionQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CollectionQuery, CollectionQueryVariables>(CollectionDocument, options);
        }
export type CollectionQueryHookResult = ReturnType<typeof useCollectionQuery>;
export type CollectionLazyQueryHookResult = ReturnType<typeof useCollectionLazyQuery>;
export type CollectionSuspenseQueryHookResult = ReturnType<typeof useCollectionSuspenseQuery>;
export type CollectionQueryResult = Apollo.QueryResult<CollectionQuery, CollectionQueryVariables>;
export const CollectionDocumentsDocument = gql`
    query CollectionDocuments($collectionId: Int!) {
  collection(collectionId: $collectionId) {
    documents {
      id
      title
      collectionId
      children {
        id
        title
        collectionId
      }
    }
  }
}
    `;

/**
 * __useCollectionDocumentsQuery__
 *
 * To run a query within a React component, call `useCollectionDocumentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionDocumentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionDocumentsQuery({
 *   variables: {
 *      collectionId: // value for 'collectionId'
 *   },
 * });
 */
export function useCollectionDocumentsQuery(baseOptions: Apollo.QueryHookOptions<CollectionDocumentsQuery, CollectionDocumentsQueryVariables> & ({ variables: CollectionDocumentsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CollectionDocumentsQuery, CollectionDocumentsQueryVariables>(CollectionDocumentsDocument, options);
      }
export function useCollectionDocumentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionDocumentsQuery, CollectionDocumentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CollectionDocumentsQuery, CollectionDocumentsQueryVariables>(CollectionDocumentsDocument, options);
        }
export function useCollectionDocumentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CollectionDocumentsQuery, CollectionDocumentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CollectionDocumentsQuery, CollectionDocumentsQueryVariables>(CollectionDocumentsDocument, options);
        }
export type CollectionDocumentsQueryHookResult = ReturnType<typeof useCollectionDocumentsQuery>;
export type CollectionDocumentsLazyQueryHookResult = ReturnType<typeof useCollectionDocumentsLazyQuery>;
export type CollectionDocumentsSuspenseQueryHookResult = ReturnType<typeof useCollectionDocumentsSuspenseQuery>;
export type CollectionDocumentsQueryResult = Apollo.QueryResult<CollectionDocumentsQuery, CollectionDocumentsQueryVariables>;
export const DocumentTreeDocument = gql`
    query DocumentTree($getDocumentInput: GetDocumentInput!) {
  document(getDocumentInput: $getDocumentInput) {
    id
    title
    collectionId
    children {
      id
      title
      collectionId
      children {
        id
        title
        collectionId
        children {
          id
          title
          collectionId
        }
      }
    }
  }
}
    `;

/**
 * __useDocumentTreeQuery__
 *
 * To run a query within a React component, call `useDocumentTreeQuery` and pass it any options that fit your needs.
 * When your component renders, `useDocumentTreeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDocumentTreeQuery({
 *   variables: {
 *      getDocumentInput: // value for 'getDocumentInput'
 *   },
 * });
 */
export function useDocumentTreeQuery(baseOptions: Apollo.QueryHookOptions<DocumentTreeQuery, DocumentTreeQueryVariables> & ({ variables: DocumentTreeQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DocumentTreeQuery, DocumentTreeQueryVariables>(DocumentTreeDocument, options);
      }
export function useDocumentTreeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DocumentTreeQuery, DocumentTreeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DocumentTreeQuery, DocumentTreeQueryVariables>(DocumentTreeDocument, options);
        }
export function useDocumentTreeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DocumentTreeQuery, DocumentTreeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DocumentTreeQuery, DocumentTreeQueryVariables>(DocumentTreeDocument, options);
        }
export type DocumentTreeQueryHookResult = ReturnType<typeof useDocumentTreeQuery>;
export type DocumentTreeLazyQueryHookResult = ReturnType<typeof useDocumentTreeLazyQuery>;
export type DocumentTreeSuspenseQueryHookResult = ReturnType<typeof useDocumentTreeSuspenseQuery>;
export type DocumentTreeQueryResult = Apollo.QueryResult<DocumentTreeQuery, DocumentTreeQueryVariables>;
export const QueryCollectionDocument = gql`
    subscription QueryCollection($queryCollectionInput: QueryCollectionInput!) {
  queryCollection(queryCollectionInput: $queryCollectionInput) {
    token
    completed
  }
}
    `;

/**
 * __useQueryCollectionSubscription__
 *
 * To run a query within a React component, call `useQueryCollectionSubscription` and pass it any options that fit your needs.
 * When your component renders, `useQueryCollectionSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQueryCollectionSubscription({
 *   variables: {
 *      queryCollectionInput: // value for 'queryCollectionInput'
 *   },
 * });
 */
export function useQueryCollectionSubscription(baseOptions: Apollo.SubscriptionHookOptions<QueryCollectionSubscription, QueryCollectionSubscriptionVariables> & ({ variables: QueryCollectionSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<QueryCollectionSubscription, QueryCollectionSubscriptionVariables>(QueryCollectionDocument, options);
      }
export type QueryCollectionSubscriptionHookResult = ReturnType<typeof useQueryCollectionSubscription>;
export type QueryCollectionSubscriptionResult = Apollo.SubscriptionResult<QueryCollectionSubscription>;
export const GetDocumentDocument = gql`
    query GetDocument($getDocumentInput: GetDocumentInput!) {
  document(getDocumentInput: $getDocumentInput) {
    id
    title
    content
    author {
      role
      status
      id
      email
      firstName
      lastName
    }
    collectionId
  }
}
    `;

/**
 * __useGetDocumentQuery__
 *
 * To run a query within a React component, call `useGetDocumentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDocumentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDocumentQuery({
 *   variables: {
 *      getDocumentInput: // value for 'getDocumentInput'
 *   },
 * });
 */
export function useGetDocumentQuery(baseOptions: Apollo.QueryHookOptions<GetDocumentQuery, GetDocumentQueryVariables> & ({ variables: GetDocumentQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDocumentQuery, GetDocumentQueryVariables>(GetDocumentDocument, options);
      }
export function useGetDocumentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDocumentQuery, GetDocumentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDocumentQuery, GetDocumentQueryVariables>(GetDocumentDocument, options);
        }
export function useGetDocumentSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDocumentQuery, GetDocumentQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDocumentQuery, GetDocumentQueryVariables>(GetDocumentDocument, options);
        }
export type GetDocumentQueryHookResult = ReturnType<typeof useGetDocumentQuery>;
export type GetDocumentLazyQueryHookResult = ReturnType<typeof useGetDocumentLazyQuery>;
export type GetDocumentSuspenseQueryHookResult = ReturnType<typeof useGetDocumentSuspenseQuery>;
export type GetDocumentQueryResult = Apollo.QueryResult<GetDocumentQuery, GetDocumentQueryVariables>;
export const UpdateDocumentDocument = gql`
    mutation UpdateDocument($updateDocumentInput: UpdateDocumentInput!) {
  updateDocument(updateDocumentInput: $updateDocumentInput) {
    id
    title
    content
    author {
      role
      status
      id
      email
      firstName
      lastName
    }
    parentId
    collectionId
  }
}
    `;
export type UpdateDocumentMutationFn = Apollo.MutationFunction<UpdateDocumentMutation, UpdateDocumentMutationVariables>;

/**
 * __useUpdateDocumentMutation__
 *
 * To run a mutation, you first call `useUpdateDocumentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDocumentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDocumentMutation, { data, loading, error }] = useUpdateDocumentMutation({
 *   variables: {
 *      updateDocumentInput: // value for 'updateDocumentInput'
 *   },
 * });
 */
export function useUpdateDocumentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDocumentMutation, UpdateDocumentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDocumentMutation, UpdateDocumentMutationVariables>(UpdateDocumentDocument, options);
      }
export type UpdateDocumentMutationHookResult = ReturnType<typeof useUpdateDocumentMutation>;
export type UpdateDocumentMutationResult = Apollo.MutationResult<UpdateDocumentMutation>;
export type UpdateDocumentMutationOptions = Apollo.BaseMutationOptions<UpdateDocumentMutation, UpdateDocumentMutationVariables>;
export const CreateDocumentDocument = gql`
    mutation CreateDocument($createDocumentInput: CreateDocumentInput!) {
  createDocument(createDocumentInput: $createDocumentInput) {
    id
    title
    content
    author {
      role
      status
      id
      email
      firstName
      lastName
    }
    collectionId
  }
}
    `;
export type CreateDocumentMutationFn = Apollo.MutationFunction<CreateDocumentMutation, CreateDocumentMutationVariables>;

/**
 * __useCreateDocumentMutation__
 *
 * To run a mutation, you first call `useCreateDocumentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDocumentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDocumentMutation, { data, loading, error }] = useCreateDocumentMutation({
 *   variables: {
 *      createDocumentInput: // value for 'createDocumentInput'
 *   },
 * });
 */
export function useCreateDocumentMutation(baseOptions?: Apollo.MutationHookOptions<CreateDocumentMutation, CreateDocumentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDocumentMutation, CreateDocumentMutationVariables>(CreateDocumentDocument, options);
      }
export type CreateDocumentMutationHookResult = ReturnType<typeof useCreateDocumentMutation>;
export type CreateDocumentMutationResult = Apollo.MutationResult<CreateDocumentMutation>;
export type CreateDocumentMutationOptions = Apollo.BaseMutationOptions<CreateDocumentMutation, CreateDocumentMutationVariables>;
export const UserDocument = gql`
    query User {
  user {
    role
    status
    id
    email
    firstName
    lastName
  }
}
    `;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserQuery(baseOptions?: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, options);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export function useUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserSuspenseQueryHookResult = ReturnType<typeof useUserSuspenseQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;