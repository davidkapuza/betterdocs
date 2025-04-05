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
    byId(id: string) {
      return pathKeys.collections.root().concat('/', id);
    },
  },
};
