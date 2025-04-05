import { StateCreator, create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createSelectors } from '../lib/zustand';
import { SignInMutation } from '../gql/__generated__/operations';

type State = {
  session: SignInMutation['signIn'] | null;
};

type Actions = {
  setSession: (session: State['session']) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  clearSession: () => void;
};

function createSessionSlice() {
  const sessionSlice: StateCreator<
    State & Actions,
    [['zustand/devtools', never], ['zustand/persist', unknown]],
    [],
    State & Actions
  > = (set) => ({
    session: null,

    setSession: (session: State['session']) =>
      set({ session }, false, 'setSession'),
    updateTokens: (accessToken: string, refreshToken: string) =>
      set(
        (state) => {
          if (!state.session) return state;
          return {
            session: {
              ...state.session,
              accessToken,
              refreshToken,
            },
          };
        },
        false,
        'updateTokens'
      ),
    clearSession: () => set({ session: null }, false, 'clearSession'),
  });
  return sessionSlice;
}

const slice = createSessionSlice();
const withPersist = persist(slice, { name: 'session' });
const withDevtools = devtools(withPersist, { name: 'Session Store' });
const store = create(withDevtools);
export const useSessionStore = createSelectors(store);
