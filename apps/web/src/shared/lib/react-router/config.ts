import { DocumentPageParams } from './react-router.types';

export const pathKeys = {
  root: '/',
  auth: {
    root() {
      return pathKeys.root.concat('auth');
    },
    signIn() {
      return pathKeys.auth.root().concat('/sign-in');
    },
    signUp() {
      return pathKeys.auth.root().concat('/sign-up');
    },
  },
  documents: {
    root() {
      return pathKeys.root.concat('collections');
    },
    document({ collectionId, documentId }: DocumentPageParams) {
      return pathKeys.documents
        .root()
        .concat('/', collectionId, '/', documentId);
    },
  },
  page404() {
    return pathKeys.root.concat('404');
  },
};
