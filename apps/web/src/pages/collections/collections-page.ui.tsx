import { useCollectionsSuspenseQuery } from '@/shared/gql/__generated__/operations';
import { Navbar } from '@/widgets/navbar';
import { NavLink } from 'react-router';
import { SidebarInset, SidebarProvider } from '@betterdocs/ui/sidebar';
import { DocumentsSidebar } from '@/widgets/documents-sidebar';
import { DocumentEditor } from '@/widgets/document-editor';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@betterdocs/ui/resizable';
import { DocumentPrompt } from '@/widgets/document-prompt';

export function CollectionsPage() {
  const { data } = useCollectionsSuspenseQuery();

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center gap-6 p-6 min-h-svh bg-background md:p-10">
        {data?.collections.map((collection) => (
          <NavLink
            key={collection.id}
            to={collection.id.toString()}
            className="block w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {collection.name}
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {collection.description}
            </p>
          </NavLink>
        ))}
      </div>
    </>
  );
}

export function CollectionPage() {
  return (
    <SidebarProvider>
      <DocumentsSidebar collapsible="icon" />
      <SidebarInset className="min-w-0">
        <div className="w-full h-screen" data-registry="plate">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel>
              <DocumentEditor />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <DocumentPrompt />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
