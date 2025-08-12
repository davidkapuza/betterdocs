export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
  /** Represents NULL values */
  Void: { input: any; output: any; }
};

export type AcceptCollectionInviteInput = {
  inviteToken: Scalars['String']['input'];
};

export type Collection = {
  __typename?: 'Collection';
  description?: Maybe<Scalars['String']['output']>;
  documents: Array<Document>;
  id: Scalars['Float']['output'];
  members: Array<CollectionMember>;
  name: Scalars['String']['output'];
};

export type CollectionInvite = {
  __typename?: 'CollectionInvite';
  collection: Collection;
  collectionId: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  expiresAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  inviteeEmail: Scalars['String']['output'];
  inviterEmail: Scalars['String']['output'];
  role: UserCollectionRole;
  token: Scalars['String']['output'];
};

export type CollectionMember = {
  __typename?: 'CollectionMember';
  joinedAt: Scalars['DateTime']['output'];
  role: UserCollectionRole;
  user: User;
};

export type CollectionShareLink = {
  __typename?: 'CollectionShareLink';
  createdAt: Scalars['DateTime']['output'];
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  role: UserCollectionRole;
  token: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type CreateCollectionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateDocumentInput = {
  collectionId: Scalars['Float']['input'];
  content: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type DeleteCollectionInput = {
  collectionId: Scalars['Float']['input'];
};

export type DeleteDocumentInput = {
  documentId: Scalars['Float']['input'];
};

export type Document = {
  __typename?: 'Document';
  author: User;
  children: Array<Document>;
  collectionId: Scalars['Float']['output'];
  content: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  parentId?: Maybe<Scalars['Float']['output']>;
  title: Scalars['String']['output'];
};

export type GenerateCollectionShareLinkInput = {
  collectionId: Scalars['Float']['input'];
  expiresInDays?: InputMaybe<Scalars['Float']['input']>;
  role: UserCollectionRole;
};

export type GetDocumentInput = {
  documentId: Scalars['Float']['input'];
};

export type InviteUserToCollectionInput = {
  collectionId: Scalars['Float']['input'];
  email: Scalars['String']['input'];
  role: UserCollectionRole;
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptCollectionInvite: Collection;
  confirmEmail: SignInResponseModel;
  createCollection: Collection;
  createDocument: Document;
  deleteCollection: Collection;
  deleteCollectionShareLink: CollectionShareLink;
  deleteDocument: Document;
  generateCollectionShareLink: CollectionShareLink;
  inviteUserToCollection: CollectionInvite;
  joinCollectionByShareLink: Collection;
  refreshTokens: TokensResponseModel;
  removeUserFromCollection: CollectionMember;
  resetPassword: SignInResponseModel;
  resetPasswordRequest?: Maybe<Scalars['Void']['output']>;
  signIn: SignInResponseModel;
  signOut?: Maybe<Scalars['Void']['output']>;
  signUp?: Maybe<Scalars['Void']['output']>;
  updateCollection: Collection;
  updateDocument: Document;
};


export type MutationAcceptCollectionInviteArgs = {
  acceptCollectionInviteInput: AcceptCollectionInviteInput;
};


export type MutationConfirmEmailArgs = {
  hash: Scalars['String']['input'];
};


export type MutationCreateCollectionArgs = {
  createCollectionInput: CreateCollectionInput;
};


export type MutationCreateDocumentArgs = {
  createDocumentInput: CreateDocumentInput;
};


export type MutationDeleteCollectionArgs = {
  deleteCollectionInput: DeleteCollectionInput;
};


export type MutationDeleteCollectionShareLinkArgs = {
  shareLinkId: Scalars['String']['input'];
};


export type MutationDeleteDocumentArgs = {
  deleteDocumentInput: DeleteDocumentInput;
};


export type MutationGenerateCollectionShareLinkArgs = {
  generateCollectionShareLinkInput: GenerateCollectionShareLinkInput;
};


export type MutationInviteUserToCollectionArgs = {
  inviteUserToCollectionInput: InviteUserToCollectionInput;
};


export type MutationJoinCollectionByShareLinkArgs = {
  token: Scalars['String']['input'];
};


export type MutationRemoveUserFromCollectionArgs = {
  removeUserFromCollectionInput: RemoveUserFromCollectionInput;
};


export type MutationResetPasswordArgs = {
  resetPasswordInput: ResetPasswordInput;
};


export type MutationSignInArgs = {
  signInInput: SignInInput;
};


export type MutationSignUpArgs = {
  signUpInput: SignUpInput;
};


export type MutationUpdateCollectionArgs = {
  updateCollectionInput: UpdateCollectionInput;
};


export type MutationUpdateDocumentArgs = {
  updateDocumentInput: UpdateDocumentInput;
};

export type Query = {
  __typename?: 'Query';
  collection: Collection;
  collectionMembers: Array<CollectionMember>;
  collectionPendingInvites: Array<CollectionInvite>;
  collectionShareLinks: Array<CollectionShareLink>;
  collections: Array<Collection>;
  document: Document;
  user: User;
};


export type QueryCollectionArgs = {
  collectionId: Scalars['Int']['input'];
};


export type QueryCollectionMembersArgs = {
  collectionId: Scalars['Int']['input'];
};


export type QueryCollectionPendingInvitesArgs = {
  collectionId: Scalars['Int']['input'];
};


export type QueryCollectionShareLinksArgs = {
  collectionId: Scalars['Int']['input'];
};


export type QueryDocumentArgs = {
  getDocumentInput: GetDocumentInput;
};

export type QueryCollectionInput = {
  collectionId: Scalars['Float']['input'];
  query: Scalars['String']['input'];
};

export type QueryResponse = {
  __typename?: 'QueryResponse';
  completed: Scalars['Boolean']['output'];
  token: Scalars['String']['output'];
};

export type RemoveUserFromCollectionInput = {
  collectionId: Scalars['Float']['input'];
  userId: Scalars['Float']['input'];
};

export type ResetPasswordInput = {
  hash: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export enum Role {
  Admin = 'admin',
  User = 'user'
}

export type SignInInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SignInResponseModel = {
  __typename?: 'SignInResponseModel';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
  user: User;
};

export type SignUpInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  queryCollection: QueryResponse;
};


export type SubscriptionQueryCollectionArgs = {
  queryCollectionInput: QueryCollectionInput;
};

export type TokensResponseModel = {
  __typename?: 'TokensResponseModel';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type UpdateCollectionInput = {
  collectionId: Scalars['Float']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateDocumentInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  documentId: Scalars['Float']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  lastName: Scalars['String']['output'];
  role: Role;
  status: UserStatus;
};

/** The role of a user in a collection */
export enum UserCollectionRole {
  Editor = 'editor',
  Owner = 'owner',
  Viewer = 'viewer'
}

export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive'
}
