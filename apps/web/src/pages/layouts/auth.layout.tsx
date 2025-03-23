import { ThemeToggle } from '@betterdocs/ui/theme-toggle';
import { Outlet } from 'react-router';

export function AuthLayout() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <header className='absolute top-6 right-6'>
          <ThemeToggle />
        </header>
        <Outlet />
      </div>
    </div>
  );
}
