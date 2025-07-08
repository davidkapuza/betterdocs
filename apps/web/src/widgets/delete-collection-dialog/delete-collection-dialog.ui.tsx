import React from 'react';
import { useDeleteCollectionMutation } from '@/shared/gql/__generated__/operations';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@betterdocs/ui';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Button,
} from '@betterdocs/ui';
import { useIsMobile } from '@/shared/hooks/use-mobile';

interface DeleteCollectionDialogProps {
  collection: {
    id: number;
    name: string;
    documents: Array<{ id: number }>;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCollectionDialog({
  collection,
  open,
  onOpenChange,
}: DeleteCollectionDialogProps) {
  const isDesktop = !useIsMobile();

  const content = (
    <DeleteCollectionContent
      collection={collection}
      onSuccess={() => onOpenChange(false)}
    />
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Collection</DialogTitle>
            <DialogDescription>
              This action cannot be undone. All documents in this collection
              will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Delete Collection</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. All documents in this collection will
            be permanently deleted.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4">{content}</div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

interface DeleteCollectionContentProps {
  collection: {
    id: number;
    name: string;
    documents: Array<{ id: number }>;
  };
  onSuccess?: () => void;
}

function DeleteCollectionContent({
  collection,
  onSuccess,
}: DeleteCollectionContentProps) {
  const [deleteCollection, { loading }] = useDeleteCollectionMutation();

  const handleDelete = async () => {
    try {
      await deleteCollection({
        variables: {
          deleteCollectionInput: {
            collectionId: collection.id,
          },
        },
        refetchQueries: ['Collections'],
      });
      onSuccess?.();
    } catch (error) {
      console.error('Failed to delete collection:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete the collection "{collection.name}"?
        </p>
        {collection.documents.length > 0 && (
          <div className="p-3 rounded-md bg-destructive/10">
            <p className="text-sm font-medium text-destructive">
              Warning: This action cannot be undone
            </p>
            <p className="text-sm text-destructive/80">
              This will permanently delete {collection.documents.length}{' '}
              document
              {collection.documents.length !== 1 ? 's' : ''} in this collection.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse space-y-2 space-y-reverse sm:flex-row sm:justify-end sm:space-x-2 sm:space-y-0">
        <Button
          variant="outline"
          onClick={() => onSuccess?.()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? 'Deleting...' : 'Delete Collection'}
        </Button>
      </div>
    </div>
  );
}
