import { useCollectionsSuspenseQuery } from '@/shared/gql/__generated__/operations';
import { NavLink } from 'react-router';
import { DocumentEditor } from '@/widgets/document-editor';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@betterdocs/ui/resizable';
import { DocumentPrompt } from '@/widgets/document-prompt';
import { pathKeys } from '@/shared/lib/react-router';
import { SidebarTrigger } from '@betterdocs/ui/sidebar';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@betterdocs/ui/drawer';
import { Button } from '@betterdocs/ui/button';
import { MessageCircle } from 'lucide-react';

export function CollectionsPage() {
  const { data } = useCollectionsSuspenseQuery();

  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col gap-6 p-6 min-h-svh bg-background md:p-10">
      {isMobile && <SidebarTrigger />}
      {data?.collections.map((collection) => (
        <NavLink
          key={collection.id}
          to={pathKeys.documents.document({
            collectionId: collection.id.toString(),
            documentId: collection.documents[0]?.id.toString(),
          })}
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
  );
}

export function DocumentPage() {
  const isMobile = useIsMobile();

  if (isMobile)
    return (
      <>
        <DocumentEditor />
        <Drawer>
          <DrawerTrigger className="absolute bottom-6 right-6" asChild>
            <Button size="icon-lg" className="rounded-full shadow-lg">
              <MessageCircle />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[90vh]">
            <DrawerHeader className="invisible">
              <DrawerTitle>Use AI to search in your documents</DrawerTitle>
              <DrawerDescription>TODO</DrawerDescription>
            </DrawerHeader>
            <DocumentPrompt />
          </DrawerContent>
        </Drawer>
      </>
    );

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel minSize={30}>
        <DocumentEditor />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel minSize={30}>
        <DocumentPrompt />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
