import { DocumentsPageParams } from './react-router.types';

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
  collections: {
    root() {
      return pathKeys.root.concat('collections');
    },
    collection({ collectionId }: DocumentsPageParams) {
      return pathKeys.collections.root().concat('/', collectionId);
    },
  },
  page404() {
    return pathKeys.root.concat('404');
  },
};
