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
};
