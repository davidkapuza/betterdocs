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
import { MessageCircle, FolderOpen } from 'lucide-react';
import { CreateCollectionDialog } from '@/widgets/create-collection-dialog';

export function CollectionsPage() {
  const { data } = useCollectionsSuspenseQuery();

  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col gap-6 p-6 min-h-svh bg-background md:p-10">
      {isMobile && <SidebarTrigger />}
      
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
            <p className="text-muted-foreground">
              Organize your documents into collections for better management
            </p>
          </div>
          <CreateCollectionDialog />
        </div>

        {data?.collections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No collections yet</h3>
            <p className="text-muted-foreground text-center mb-6">
              Create your first collection to start organizing your documents
            </p>
            <CreateCollectionDialog />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.collections.map((collection) => (
              <NavLink
                key={collection.id}
                to={pathKeys.documents.document({
                  collectionId: collection.id.toString(),
                  documentId: collection.documents[0]?.id.toString(),
                })}
                className="block w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors"
              >
                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {collection.name}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400 mb-3">
                  {collection.description || 'No description'}
                </p>
                <div className="text-sm text-muted-foreground">
                  {collection.documents.length} document{collection.documents.length !== 1 ? 's' : ''}
                </div>
              </NavLink>
            ))}
          </div>
        )}
      </div>
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
