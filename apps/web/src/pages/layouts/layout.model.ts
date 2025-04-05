import { pathKeys } from '@/shared/lib/react-router';
import { useSessionStore } from '@/shared/session';
import { LoaderFunctionArgs, redirect } from 'react-router';

export class RootLayout {
  static async layout(args: LoaderFunctionArgs) {
    if (!RootLayout.ensureSession()) {
      return redirect(pathKeys.auth.signIn());
    }

    return args;
  }

  private static ensureSession(): boolean {
    return Boolean(useSessionStore.getState().session);
  }
}
