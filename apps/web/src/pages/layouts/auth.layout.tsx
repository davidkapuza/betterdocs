import { Outlet } from 'react-router';

export function AuthLayout() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <Outlet />
    </div>
  );
}
