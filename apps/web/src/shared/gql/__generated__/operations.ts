import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SignUpMutationVariables = Exact<{
  signUpInput: SignUpInput;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp?: any | null };

export type SignInMutationVariables = Exact<{
  signInInput: SignInInput;
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn: { __typename?: 'SignInResponseModel', accessToken: string, refreshToken: string, user: { __typename?: 'User', id: number, email: string, firstName: string, lastName: string, role: Role, status: UserStatus } } };

export type RefreshTokensMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshTokensMutation = { __typename?: 'Mutation', refreshTokens: { __typename?: 'TokensResponseModel', accessToken: string, refreshToken: string } };

export type SignOutMutationVariables = Exact<{ [key: string]: never; }>;


export type SignOutMutation = { __typename?: 'Mutation', signOut?: any | null };

export type CollectionsQueryVariables = Exact<{ [key: string]: never; }>;


export type CollectionsQuery = { __typename?: 'Query', collections: Array<{ __typename?: 'Collection', id: number, name: string, description?: string | null, documents: Array<{ __typename?: 'Document', id: number, title: string, content: string }> }> };

export type CollectionQueryVariables = Exact<{
  collectionId: Scalars['Int']['input'];
}>;


export type CollectionQuery = { __typename?: 'Query', collection: { __typename?: 'Collection', id: number, name: string, description?: string | null, documents: Array<{ __typename?: 'Document', id: number, title: string, content: string, author: { __typename?: 'User', role: Role, status: UserStatus, id: number, email: string, firstName: string, lastName: string } }> } };

export type CollectionDocumentsQueryVariables = Exact<{
  collectionId: Scalars['Int']['input'];
}>;


export type CollectionDocumentsQuery = { __typename?: 'Query', collection: { __typename?: 'Collection', documents: Array<{ __typename?: 'Document', id: number, title: string, collectionId: number, children: Array<{ __typename?: 'Document', id: number, title: string, collectionId: number }> }> } };

export type CreateCollectionMutationVariables = Exact<{
  createCollectionInput: CreateCollectionInput;
}>;


export type CreateCollectionMutation = { __typename?: 'Mutation', createCollection: { __typename?: 'Collection', id: number, name: string, description?: string | null } };

export type UpdateCollectionMutationVariables = Exact<{
  updateCollectionInput: UpdateCollectionInput;
}>;


export type UpdateCollectionMutation = { __typename?: 'Mutation', updateCollection: { __typename?: 'Collection', id: number, name: string, description?: string | null } };

export type DeleteCollectionMutationVariables = Exact<{
  deleteCollectionInput: DeleteCollectionInput;
}>;


export type DeleteCollectionMutation = { __typename?: 'Mutation', deleteCollection: { __typename?: 'Collection', id: number, name: string, description?: string | null } };

export type QueryCollectionSubscriptionVariables = Exact<{
  queryCollectionInput: QueryCollectionInput;
}>;


export type QueryCollectionSubscription = { __typename?: 'Subscription', queryCollection: { __typename?: 'QueryResponse', token: string, completed: boolean } };

export type InviteUserToCollectionMutationVariables = Exact<{
  inviteUserToCollectionInput: InviteUserToCollectionInput;
}>;


export type InviteUserToCollectionMutation = { __typename?: 'Mutation', inviteUserToCollection: { __typename?: 'CollectionInvite', id: string, collectionId: number, inviterEmail: string, inviteeEmail: string, role: UserCollectionRole, token: string, expiresAt: any, createdAt: any, collection: { __typename?: 'Collection', id: number, name: string, description?: string | null } } };

export type AcceptCollectionInviteMutationVariables = Exact<{
  acceptCollectionInviteInput: AcceptCollectionInviteInput;
}>;


export type AcceptCollectionInviteMutation = { __typename?: 'Mutation', acceptCollectionInvite: { __typename?: 'Collection', id: number, name: string, description?: string | null } };

export type GenerateCollectionShareLinkMutationVariables = Exact<{
  generateCollectionShareLinkInput: GenerateCollectionShareLinkInput;
}>;


export type GenerateCollectionShareLinkMutation = { __typename?: 'Mutation', generateCollectionShareLink: { __typename?: 'CollectionShareLink', url: string, token: string, role: UserCollectionRole, expiresAt?: any | null } };

export type JoinCollectionByShareLinkMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type JoinCollectionByShareLinkMutation = { __typename?: 'Mutation', joinCollectionByShareLink: { __typename?: 'Collection', id: number, name: string, description?: string | null } };

export type RemoveUserFromCollectionMutationVariables = Exact<{
  removeUserFromCollectionInput: RemoveUserFromCollectionInput;
}>;


export type RemoveUserFromCollectionMutation = { __typename?: 'Mutation', removeUserFromCollection: { __typename?: 'CollectionMember', role: UserCollectionRole, joinedAt: any, user: { __typename?: 'User', id: number, email: string, firstName: string, lastName: string } } };

export type CollectionMembersQueryVariables = Exact<{
  collectionId: Scalars['Int']['input'];
}>;


export type CollectionMembersQuery = { __typename?: 'Query', collectionMembers: Array<{ __typename?: 'CollectionMember', role: UserCollectionRole, joinedAt: any, user: { __typename?: 'User', id: number, email: string, firstName: string, lastName: string } }> };

export type CollectionPendingInvitesQueryVariables = Exact<{
  collectionId: Scalars['Int']['input'];
}>;


export type CollectionPendingInvitesQuery = { __typename?: 'Query', collectionPendingInvites: Array<{ __typename?: 'CollectionInvite', id: string, inviterEmail: string, inviteeEmail: string, role: UserCollectionRole, expiresAt: any, createdAt: any }> };

export type CollectionShareLinksQueryVariables = Exact<{
  collectionId: Scalars['Int']['input'];
}>;


export type CollectionShareLinksQuery = { __typename?: 'Query', collectionShareLinks: Array<{ __typename?: 'CollectionShareLink', id: string, role: UserCollectionRole, token: string, expiresAt?: any | null, createdAt: any }> };

export type DeleteCollectionShareLinkMutationVariables = Exact<{
  shareLinkId: Scalars['String']['input'];
}>;


export type DeleteCollectionShareLinkMutation = { __typename?: 'Mutation', deleteCollectionShareLink: { __typename?: 'CollectionShareLink', id: string } };

export type GetDocumentQueryVariables = Exact<{
  getDocumentInput: GetDocumentInput;
}>;


export type GetDocumentQuery = { __typename?: 'Query', document: { __typename?: 'Document', id: number, title: string, content: string, collectionId: number, author: { __typename?: 'User', role: Role, status: UserStatus, id: number, email: string, firstName: string, lastName: string } } };

export type DocumentTreeQueryVariables = Exact<{
  getDocumentInput: GetDocumentInput;
}>;


export type DocumentTreeQuery = { __typename?: 'Query', document: { __typename?: 'Document', id: number, title: string, collectionId: number, children: Array<{ __typename?: 'Document', id: number, title: string, collectionId: number, children: Array<{ __typename?: 'Document', id: number, title: string, collectionId: number }> }> } };

export type UpdateDocumentMutationVariables = Exact<{
  updateDocumentInput: UpdateDocumentInput;
}>;


export type UpdateDocumentMutation = { __typename?: 'Mutation', updateDocument: { __typename?: 'Document', id: number, title: string, content: string, parentId?: number | null, collectionId: number, author: { __typename?: 'User', role: Role, status: UserStatus, id: number, email: string, firstName: string, lastName: string } } };

export type CreateDocumentMutationVariables = Exact<{
  createDocumentInput: CreateDocumentInput;
}>;


export type CreateDocumentMutation = { __typename?: 'Mutation', createDocument: { __typename?: 'Document', id: number, title: string, content: string, collectionId: number, author: { __typename?: 'User', role: Role, status: UserStatus, id: number, email: string, firstName: string, lastName: string } } };

export type DeleteDocumentMutationVariables = Exact<{
  deleteDocumentInput: DeleteDocumentInput;
}>;


export type DeleteDocumentMutation = { __typename?: 'Mutation', deleteDocument: { __typename?: 'Document', id: number, title: string, collectionId: number } };

export type UserQueryVariables = Exact<{ [key: string]: never; }>;


export type UserQuery = { __typename?: 'Query', user: { __typename?: 'User', role: Role, status: UserStatus, id: number, email: string, firstName: string, lastName: string } };


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
export const SignOutDocument = gql`
    mutation SignOut {
  signOut
}
    `;
export type SignOutMutationFn = Apollo.MutationFunction<SignOutMutation, SignOutMutationVariables>;

/**
 * __useSignOutMutation__
 *
 * To run a mutation, you first call `useSignOutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignOutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signOutMutation, { data, loading, error }] = useSignOutMutation({
 *   variables: {
 *   },
 * });
 */
export function useSignOutMutation(baseOptions?: Apollo.MutationHookOptions<SignOutMutation, SignOutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignOutMutation, SignOutMutationVariables>(SignOutDocument, options);
      }
export type SignOutMutationHookResult = ReturnType<typeof useSignOutMutation>;
export type SignOutMutationResult = Apollo.MutationResult<SignOutMutation>;
export type SignOutMutationOptions = Apollo.BaseMutationOptions<SignOutMutation, SignOutMutationVariables>;
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
export const CreateCollectionDocument = gql`
    mutation CreateCollection($createCollectionInput: CreateCollectionInput!) {
  createCollection(createCollectionInput: $createCollectionInput) {
    id
    name
    description
  }
}
    `;
export type CreateCollectionMutationFn = Apollo.MutationFunction<CreateCollectionMutation, CreateCollectionMutationVariables>;

/**
 * __useCreateCollectionMutation__
 *
 * To run a mutation, you first call `useCreateCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCollectionMutation, { data, loading, error }] = useCreateCollectionMutation({
 *   variables: {
 *      createCollectionInput: // value for 'createCollectionInput'
 *   },
 * });
 */
export function useCreateCollectionMutation(baseOptions?: Apollo.MutationHookOptions<CreateCollectionMutation, CreateCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCollectionMutation, CreateCollectionMutationVariables>(CreateCollectionDocument, options);
      }
export type CreateCollectionMutationHookResult = ReturnType<typeof useCreateCollectionMutation>;
export type CreateCollectionMutationResult = Apollo.MutationResult<CreateCollectionMutation>;
export type CreateCollectionMutationOptions = Apollo.BaseMutationOptions<CreateCollectionMutation, CreateCollectionMutationVariables>;
export const UpdateCollectionDocument = gql`
    mutation UpdateCollection($updateCollectionInput: UpdateCollectionInput!) {
  updateCollection(updateCollectionInput: $updateCollectionInput) {
    id
    name
    description
  }
}
    `;
export type UpdateCollectionMutationFn = Apollo.MutationFunction<UpdateCollectionMutation, UpdateCollectionMutationVariables>;

/**
 * __useUpdateCollectionMutation__
 *
 * To run a mutation, you first call `useUpdateCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCollectionMutation, { data, loading, error }] = useUpdateCollectionMutation({
 *   variables: {
 *      updateCollectionInput: // value for 'updateCollectionInput'
 *   },
 * });
 */
export function useUpdateCollectionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCollectionMutation, UpdateCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCollectionMutation, UpdateCollectionMutationVariables>(UpdateCollectionDocument, options);
      }
export type UpdateCollectionMutationHookResult = ReturnType<typeof useUpdateCollectionMutation>;
export type UpdateCollectionMutationResult = Apollo.MutationResult<UpdateCollectionMutation>;
export type UpdateCollectionMutationOptions = Apollo.BaseMutationOptions<UpdateCollectionMutation, UpdateCollectionMutationVariables>;
export const DeleteCollectionDocument = gql`
    mutation DeleteCollection($deleteCollectionInput: DeleteCollectionInput!) {
  deleteCollection(deleteCollectionInput: $deleteCollectionInput) {
    id
    name
    description
  }
}
    `;
export type DeleteCollectionMutationFn = Apollo.MutationFunction<DeleteCollectionMutation, DeleteCollectionMutationVariables>;

/**
 * __useDeleteCollectionMutation__
 *
 * To run a mutation, you first call `useDeleteCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCollectionMutation, { data, loading, error }] = useDeleteCollectionMutation({
 *   variables: {
 *      deleteCollectionInput: // value for 'deleteCollectionInput'
 *   },
 * });
 */
export function useDeleteCollectionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCollectionMutation, DeleteCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCollectionMutation, DeleteCollectionMutationVariables>(DeleteCollectionDocument, options);
      }
export type DeleteCollectionMutationHookResult = ReturnType<typeof useDeleteCollectionMutation>;
export type DeleteCollectionMutationResult = Apollo.MutationResult<DeleteCollectionMutation>;
export type DeleteCollectionMutationOptions = Apollo.BaseMutationOptions<DeleteCollectionMutation, DeleteCollectionMutationVariables>;
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
export const InviteUserToCollectionDocument = gql`
    mutation InviteUserToCollection($inviteUserToCollectionInput: InviteUserToCollectionInput!) {
  inviteUserToCollection(
    inviteUserToCollectionInput: $inviteUserToCollectionInput
  ) {
    id
    collectionId
    inviterEmail
    inviteeEmail
    role
    token
    expiresAt
    createdAt
    collection {
      id
      name
      description
    }
  }
}
    `;
export type InviteUserToCollectionMutationFn = Apollo.MutationFunction<InviteUserToCollectionMutation, InviteUserToCollectionMutationVariables>;

/**
 * __useInviteUserToCollectionMutation__
 *
 * To run a mutation, you first call `useInviteUserToCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInviteUserToCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [inviteUserToCollectionMutation, { data, loading, error }] = useInviteUserToCollectionMutation({
 *   variables: {
 *      inviteUserToCollectionInput: // value for 'inviteUserToCollectionInput'
 *   },
 * });
 */
export function useInviteUserToCollectionMutation(baseOptions?: Apollo.MutationHookOptions<InviteUserToCollectionMutation, InviteUserToCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InviteUserToCollectionMutation, InviteUserToCollectionMutationVariables>(InviteUserToCollectionDocument, options);
      }
export type InviteUserToCollectionMutationHookResult = ReturnType<typeof useInviteUserToCollectionMutation>;
export type InviteUserToCollectionMutationResult = Apollo.MutationResult<InviteUserToCollectionMutation>;
export type InviteUserToCollectionMutationOptions = Apollo.BaseMutationOptions<InviteUserToCollectionMutation, InviteUserToCollectionMutationVariables>;
export const AcceptCollectionInviteDocument = gql`
    mutation AcceptCollectionInvite($acceptCollectionInviteInput: AcceptCollectionInviteInput!) {
  acceptCollectionInvite(
    acceptCollectionInviteInput: $acceptCollectionInviteInput
  ) {
    id
    name
    description
  }
}
    `;
export type AcceptCollectionInviteMutationFn = Apollo.MutationFunction<AcceptCollectionInviteMutation, AcceptCollectionInviteMutationVariables>;

/**
 * __useAcceptCollectionInviteMutation__
 *
 * To run a mutation, you first call `useAcceptCollectionInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptCollectionInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptCollectionInviteMutation, { data, loading, error }] = useAcceptCollectionInviteMutation({
 *   variables: {
 *      acceptCollectionInviteInput: // value for 'acceptCollectionInviteInput'
 *   },
 * });
 */
export function useAcceptCollectionInviteMutation(baseOptions?: Apollo.MutationHookOptions<AcceptCollectionInviteMutation, AcceptCollectionInviteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptCollectionInviteMutation, AcceptCollectionInviteMutationVariables>(AcceptCollectionInviteDocument, options);
      }
export type AcceptCollectionInviteMutationHookResult = ReturnType<typeof useAcceptCollectionInviteMutation>;
export type AcceptCollectionInviteMutationResult = Apollo.MutationResult<AcceptCollectionInviteMutation>;
export type AcceptCollectionInviteMutationOptions = Apollo.BaseMutationOptions<AcceptCollectionInviteMutation, AcceptCollectionInviteMutationVariables>;
export const GenerateCollectionShareLinkDocument = gql`
    mutation GenerateCollectionShareLink($generateCollectionShareLinkInput: GenerateCollectionShareLinkInput!) {
  generateCollectionShareLink(
    generateCollectionShareLinkInput: $generateCollectionShareLinkInput
  ) {
    url
    token
    role
    expiresAt
  }
}
    `;
export type GenerateCollectionShareLinkMutationFn = Apollo.MutationFunction<GenerateCollectionShareLinkMutation, GenerateCollectionShareLinkMutationVariables>;

/**
 * __useGenerateCollectionShareLinkMutation__
 *
 * To run a mutation, you first call `useGenerateCollectionShareLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateCollectionShareLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateCollectionShareLinkMutation, { data, loading, error }] = useGenerateCollectionShareLinkMutation({
 *   variables: {
 *      generateCollectionShareLinkInput: // value for 'generateCollectionShareLinkInput'
 *   },
 * });
 */
export function useGenerateCollectionShareLinkMutation(baseOptions?: Apollo.MutationHookOptions<GenerateCollectionShareLinkMutation, GenerateCollectionShareLinkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GenerateCollectionShareLinkMutation, GenerateCollectionShareLinkMutationVariables>(GenerateCollectionShareLinkDocument, options);
      }
export type GenerateCollectionShareLinkMutationHookResult = ReturnType<typeof useGenerateCollectionShareLinkMutation>;
export type GenerateCollectionShareLinkMutationResult = Apollo.MutationResult<GenerateCollectionShareLinkMutation>;
export type GenerateCollectionShareLinkMutationOptions = Apollo.BaseMutationOptions<GenerateCollectionShareLinkMutation, GenerateCollectionShareLinkMutationVariables>;
export const JoinCollectionByShareLinkDocument = gql`
    mutation JoinCollectionByShareLink($token: String!) {
  joinCollectionByShareLink(token: $token) {
    id
    name
    description
  }
}
    `;
export type JoinCollectionByShareLinkMutationFn = Apollo.MutationFunction<JoinCollectionByShareLinkMutation, JoinCollectionByShareLinkMutationVariables>;

/**
 * __useJoinCollectionByShareLinkMutation__
 *
 * To run a mutation, you first call `useJoinCollectionByShareLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinCollectionByShareLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinCollectionByShareLinkMutation, { data, loading, error }] = useJoinCollectionByShareLinkMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useJoinCollectionByShareLinkMutation(baseOptions?: Apollo.MutationHookOptions<JoinCollectionByShareLinkMutation, JoinCollectionByShareLinkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<JoinCollectionByShareLinkMutation, JoinCollectionByShareLinkMutationVariables>(JoinCollectionByShareLinkDocument, options);
      }
export type JoinCollectionByShareLinkMutationHookResult = ReturnType<typeof useJoinCollectionByShareLinkMutation>;
export type JoinCollectionByShareLinkMutationResult = Apollo.MutationResult<JoinCollectionByShareLinkMutation>;
export type JoinCollectionByShareLinkMutationOptions = Apollo.BaseMutationOptions<JoinCollectionByShareLinkMutation, JoinCollectionByShareLinkMutationVariables>;
export const RemoveUserFromCollectionDocument = gql`
    mutation RemoveUserFromCollection($removeUserFromCollectionInput: RemoveUserFromCollectionInput!) {
  removeUserFromCollection(
    removeUserFromCollectionInput: $removeUserFromCollectionInput
  ) {
    user {
      id
      email
      firstName
      lastName
    }
    role
    joinedAt
  }
}
    `;
export type RemoveUserFromCollectionMutationFn = Apollo.MutationFunction<RemoveUserFromCollectionMutation, RemoveUserFromCollectionMutationVariables>;

/**
 * __useRemoveUserFromCollectionMutation__
 *
 * To run a mutation, you first call `useRemoveUserFromCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveUserFromCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeUserFromCollectionMutation, { data, loading, error }] = useRemoveUserFromCollectionMutation({
 *   variables: {
 *      removeUserFromCollectionInput: // value for 'removeUserFromCollectionInput'
 *   },
 * });
 */
export function useRemoveUserFromCollectionMutation(baseOptions?: Apollo.MutationHookOptions<RemoveUserFromCollectionMutation, RemoveUserFromCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveUserFromCollectionMutation, RemoveUserFromCollectionMutationVariables>(RemoveUserFromCollectionDocument, options);
      }
export type RemoveUserFromCollectionMutationHookResult = ReturnType<typeof useRemoveUserFromCollectionMutation>;
export type RemoveUserFromCollectionMutationResult = Apollo.MutationResult<RemoveUserFromCollectionMutation>;
export type RemoveUserFromCollectionMutationOptions = Apollo.BaseMutationOptions<RemoveUserFromCollectionMutation, RemoveUserFromCollectionMutationVariables>;
export const CollectionMembersDocument = gql`
    query CollectionMembers($collectionId: Int!) {
  collectionMembers(collectionId: $collectionId) {
    user {
      id
      email
      firstName
      lastName
    }
    role
    joinedAt
  }
}
    `;

/**
 * __useCollectionMembersQuery__
 *
 * To run a query within a React component, call `useCollectionMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionMembersQuery({
 *   variables: {
 *      collectionId: // value for 'collectionId'
 *   },
 * });
 */
export function useCollectionMembersQuery(baseOptions: Apollo.QueryHookOptions<CollectionMembersQuery, CollectionMembersQueryVariables> & ({ variables: CollectionMembersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CollectionMembersQuery, CollectionMembersQueryVariables>(CollectionMembersDocument, options);
      }
export function useCollectionMembersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionMembersQuery, CollectionMembersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CollectionMembersQuery, CollectionMembersQueryVariables>(CollectionMembersDocument, options);
        }
export function useCollectionMembersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CollectionMembersQuery, CollectionMembersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CollectionMembersQuery, CollectionMembersQueryVariables>(CollectionMembersDocument, options);
        }
export type CollectionMembersQueryHookResult = ReturnType<typeof useCollectionMembersQuery>;
export type CollectionMembersLazyQueryHookResult = ReturnType<typeof useCollectionMembersLazyQuery>;
export type CollectionMembersSuspenseQueryHookResult = ReturnType<typeof useCollectionMembersSuspenseQuery>;
export type CollectionMembersQueryResult = Apollo.QueryResult<CollectionMembersQuery, CollectionMembersQueryVariables>;
export const CollectionPendingInvitesDocument = gql`
    query CollectionPendingInvites($collectionId: Int!) {
  collectionPendingInvites(collectionId: $collectionId) {
    id
    inviterEmail
    inviteeEmail
    role
    expiresAt
    createdAt
  }
}
    `;

/**
 * __useCollectionPendingInvitesQuery__
 *
 * To run a query within a React component, call `useCollectionPendingInvitesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionPendingInvitesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionPendingInvitesQuery({
 *   variables: {
 *      collectionId: // value for 'collectionId'
 *   },
 * });
 */
export function useCollectionPendingInvitesQuery(baseOptions: Apollo.QueryHookOptions<CollectionPendingInvitesQuery, CollectionPendingInvitesQueryVariables> & ({ variables: CollectionPendingInvitesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CollectionPendingInvitesQuery, CollectionPendingInvitesQueryVariables>(CollectionPendingInvitesDocument, options);
      }
export function useCollectionPendingInvitesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionPendingInvitesQuery, CollectionPendingInvitesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CollectionPendingInvitesQuery, CollectionPendingInvitesQueryVariables>(CollectionPendingInvitesDocument, options);
        }
export function useCollectionPendingInvitesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CollectionPendingInvitesQuery, CollectionPendingInvitesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CollectionPendingInvitesQuery, CollectionPendingInvitesQueryVariables>(CollectionPendingInvitesDocument, options);
        }
export type CollectionPendingInvitesQueryHookResult = ReturnType<typeof useCollectionPendingInvitesQuery>;
export type CollectionPendingInvitesLazyQueryHookResult = ReturnType<typeof useCollectionPendingInvitesLazyQuery>;
export type CollectionPendingInvitesSuspenseQueryHookResult = ReturnType<typeof useCollectionPendingInvitesSuspenseQuery>;
export type CollectionPendingInvitesQueryResult = Apollo.QueryResult<CollectionPendingInvitesQuery, CollectionPendingInvitesQueryVariables>;
export const CollectionShareLinksDocument = gql`
    query CollectionShareLinks($collectionId: Int!) {
  collectionShareLinks(collectionId: $collectionId) {
    id
    role
    token
    expiresAt
    createdAt
  }
}
    `;

/**
 * __useCollectionShareLinksQuery__
 *
 * To run a query within a React component, call `useCollectionShareLinksQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionShareLinksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionShareLinksQuery({
 *   variables: {
 *      collectionId: // value for 'collectionId'
 *   },
 * });
 */
export function useCollectionShareLinksQuery(baseOptions: Apollo.QueryHookOptions<CollectionShareLinksQuery, CollectionShareLinksQueryVariables> & ({ variables: CollectionShareLinksQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CollectionShareLinksQuery, CollectionShareLinksQueryVariables>(CollectionShareLinksDocument, options);
      }
export function useCollectionShareLinksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionShareLinksQuery, CollectionShareLinksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CollectionShareLinksQuery, CollectionShareLinksQueryVariables>(CollectionShareLinksDocument, options);
        }
export function useCollectionShareLinksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CollectionShareLinksQuery, CollectionShareLinksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CollectionShareLinksQuery, CollectionShareLinksQueryVariables>(CollectionShareLinksDocument, options);
        }
export type CollectionShareLinksQueryHookResult = ReturnType<typeof useCollectionShareLinksQuery>;
export type CollectionShareLinksLazyQueryHookResult = ReturnType<typeof useCollectionShareLinksLazyQuery>;
export type CollectionShareLinksSuspenseQueryHookResult = ReturnType<typeof useCollectionShareLinksSuspenseQuery>;
export type CollectionShareLinksQueryResult = Apollo.QueryResult<CollectionShareLinksQuery, CollectionShareLinksQueryVariables>;
export const DeleteCollectionShareLinkDocument = gql`
    mutation DeleteCollectionShareLink($shareLinkId: String!) {
  deleteCollectionShareLink(shareLinkId: $shareLinkId) {
    id
  }
}
    `;
export type DeleteCollectionShareLinkMutationFn = Apollo.MutationFunction<DeleteCollectionShareLinkMutation, DeleteCollectionShareLinkMutationVariables>;

/**
 * __useDeleteCollectionShareLinkMutation__
 *
 * To run a mutation, you first call `useDeleteCollectionShareLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCollectionShareLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCollectionShareLinkMutation, { data, loading, error }] = useDeleteCollectionShareLinkMutation({
 *   variables: {
 *      shareLinkId: // value for 'shareLinkId'
 *   },
 * });
 */
export function useDeleteCollectionShareLinkMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCollectionShareLinkMutation, DeleteCollectionShareLinkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCollectionShareLinkMutation, DeleteCollectionShareLinkMutationVariables>(DeleteCollectionShareLinkDocument, options);
      }
export type DeleteCollectionShareLinkMutationHookResult = ReturnType<typeof useDeleteCollectionShareLinkMutation>;
export type DeleteCollectionShareLinkMutationResult = Apollo.MutationResult<DeleteCollectionShareLinkMutation>;
export type DeleteCollectionShareLinkMutationOptions = Apollo.BaseMutationOptions<DeleteCollectionShareLinkMutation, DeleteCollectionShareLinkMutationVariables>;
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
export const DeleteDocumentDocument = gql`
    mutation DeleteDocument($deleteDocumentInput: DeleteDocumentInput!) {
  deleteDocument(deleteDocumentInput: $deleteDocumentInput) {
    id
    title
    collectionId
  }
}
    `;
export type DeleteDocumentMutationFn = Apollo.MutationFunction<DeleteDocumentMutation, DeleteDocumentMutationVariables>;

/**
 * __useDeleteDocumentMutation__
 *
 * To run a mutation, you first call `useDeleteDocumentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteDocumentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteDocumentMutation, { data, loading, error }] = useDeleteDocumentMutation({
 *   variables: {
 *      deleteDocumentInput: // value for 'deleteDocumentInput'
 *   },
 * });
 */
export function useDeleteDocumentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteDocumentMutation, DeleteDocumentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteDocumentMutation, DeleteDocumentMutationVariables>(DeleteDocumentDocument, options);
      }
export type DeleteDocumentMutationHookResult = ReturnType<typeof useDeleteDocumentMutation>;
export type DeleteDocumentMutationResult = Apollo.MutationResult<DeleteDocumentMutation>;
export type DeleteDocumentMutationOptions = Apollo.BaseMutationOptions<DeleteDocumentMutation, DeleteDocumentMutationVariables>;
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