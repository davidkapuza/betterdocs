import { ThemeToggle } from '@betterdocs/ui/theme-toggle';
import { LogOut } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@betterdocs/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@betterdocs/ui/avatar';
import { useUserSuspenseQuery } from '@/shared/gql/__generated__/operations';
import { compose, withSuspense } from '@/shared/lib/react';
import { withErrorBoundary } from 'react-error-boundary';
import { ErrorHandler } from '@/shared/ui/error-handler';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex items-center px-4 -mb-4 h-18">
      <div className="absolute inset-0 w-full fade-bottom bg-background/15 backdrop-blur-lg"></div>
      <div className="relative flex gap-4 ms-auto">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}

const enhance = compose(
  (component) =>
    withSuspense(component, {
      fallback: <div>Loading...</div>,
    }),
  (component) =>
    withErrorBoundary(component, {
      FallbackComponent: ErrorHandler,
    })
);

export const UserMenu = enhance(() => {
  const { data } = useUserSuspenseQuery();

  if (!data) return;

  const initials =
    `${data.user.firstName[0]}${data.user.lastName[0]}`.toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="w-8 h-8 rounded-lg">
          <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="w-8 h-8 rounded-lg">
              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-sm leading-tight text-left">
              <span className="font-semibold truncate">
                {data.user.firstName} {data.user.lastName}
              </span>
              <span className="text-xs truncate text-muted-foreground">
                {data.user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
