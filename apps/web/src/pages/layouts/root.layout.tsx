import { DocumentsSidebar } from '@/widgets/documents-sidebar';
import { SidebarInset, SidebarProvider } from '@betterdocs/ui/sidebar';
import { Outlet } from 'react-router';
import { AssistantRuntimeProvider } from '@/app/providers/assistant-runtime-provider';

export function RootLayout() {
  return (
    <AssistantRuntimeProvider>
      <SidebarProvider>
        <DocumentsSidebar collapsible="icon" />
        <SidebarInset className="min-w-0">
          <div className="w-full h-screen" data-registry="plate">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AssistantRuntimeProvider>
  );
}
