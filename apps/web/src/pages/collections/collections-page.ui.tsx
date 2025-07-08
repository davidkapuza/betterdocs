import {
  useCollectionsSuspenseQuery,
  CollectionsQuery,
} from '@/shared/gql/__generated__/operations';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { pathKeys } from '@/shared/lib/react-router';
import { CreateCollectionDialog } from '@/widgets/create-collection-dialog';
import { EditCollectionDialog } from '@/widgets/edit-collection-dialog';
import { DeleteCollectionDialog } from '@/widgets/delete-collection-dialog';
import {
  SidebarTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
  DropdownMenuLabel,
  DropdownMenuGroup,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@betterdocs/ui';
import { FolderOpen, MoreHorizontal } from 'lucide-react';
import { createSearchParams, NavLink } from 'react-router';
import React from 'react';

export function CollectionsPage() {
  const { data } = useCollectionsSuspenseQuery();

  const isMobile = useIsMobile();

  const [editingCollection, setEditingCollection] = React.useState<
    CollectionsQuery['collections'][number] | null
  >(null);
  const [deletingCollection, setDeletingCollection] = React.useState<
    CollectionsQuery['collections'][number] | null
  >(null);

  const getDocumentLink = (
    collection: CollectionsQuery['collections'][number]
  ): string => {
    if (collection.documents.length > 0) {
      return pathKeys.collections
        .collection({
          collectionId: collection.id.toString(),
        })
        .concat(
          '?',
          createSearchParams({
            documentId: collection.documents[0].id.toString(),
          }).toString()
        );
    } else {
      return pathKeys.collections.collection({
        collectionId: collection.id.toString(),
      });
    }
  };

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
            <FolderOpen className="w-12 h-12 mb-4 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No collections yet</h3>
            <p className="mb-6 text-center text-muted-foreground">
              Create your first collection to start organizing your documents
            </p>
            <CreateCollectionDialog />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.collections.map((collection) => (
              <div key={collection.id}>
                <div className="relative">
                  <NavLink to={getDocumentLink(collection)}>
                    <Card>
                      <CardHeader className="pe-14">
                        <CardTitle>{collection.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                          {collection.description || 'No description'}
                        </p>
                        <div className="text-sm text-muted-foreground">
                          {collection.documents.length} document
                          {collection.documents.length !== 1 ? 's' : ''}
                        </div>
                      </CardContent>
                    </Card>
                  </NavLink>

                  <div className="absolute top-3.5 right-3.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuLabel>
                          Collection management
                        </DropdownMenuLabel>
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingCollection(collection);
                            }}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setDeletingCollection(collection);
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingCollection && (
        <EditCollectionDialog
          collection={editingCollection}
          open={Boolean(editingCollection)}
          onOpenChange={(open) => {
            if (!open) {
              setEditingCollection(null);
            }
          }}
        />
      )}

      {deletingCollection && (
        <DeleteCollectionDialog
          collection={deletingCollection}
          open={Boolean(deletingCollection)}
          onOpenChange={(open) => {
            if (!open) {
              setDeletingCollection(null);
            }
          }}
        />
      )}
    </div>
  );
}
