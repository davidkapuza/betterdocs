import React from 'react';
import { useUpdateCollectionMutation } from '@/shared/gql/__generated__/operations';
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Input,
  Textarea,
} from '@betterdocs/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useIsMobile } from '@/shared/hooks/use-mobile';

const editCollectionSchema = z.object({
  name: z
    .string()
    .min(1, 'Collection name is required')
    .max(100, 'Name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
});

type EditCollectionForm = z.infer<typeof editCollectionSchema>;

interface EditCollectionDialogProps {
  collection: {
    id: number;
    name: string;
    description?: string | null;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCollectionDialog({
  collection,
  open,
  onOpenChange,
}: EditCollectionDialogProps) {
  const isDesktop = !useIsMobile();

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
            <DialogDescription>
              Update the collection information. Changes will be saved
              automatically.
            </DialogDescription>
          </DialogHeader>
          <CollectionForm
            collection={collection}
            onSuccess={() => onOpenChange(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit Collection</DrawerTitle>
          <DrawerDescription>
            Update the collection information. Changes will be saved
            automatically.
          </DrawerDescription>
        </DrawerHeader>
        <CollectionForm
          collection={collection}
          onSuccess={() => onOpenChange(false)}
          className="px-4"
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

interface CollectionFormProps {
  collection: {
    id: number;
    name: string;
    description?: string | null;
  };
  onSuccess?: () => void;
  className?: string;
}

function CollectionForm({
  collection,
  onSuccess,
  className,
}: CollectionFormProps) {
  const [updateCollection, { loading }] = useUpdateCollectionMutation();

  const form = useForm<EditCollectionForm>({
    resolver: zodResolver(editCollectionSchema),
    defaultValues: {
      name: collection.name,
      description: collection.description || '',
    },
  });

  const onSubmit = async (data: EditCollectionForm) => {
    try {
      await updateCollection({
        variables: {
          updateCollectionInput: {
            collectionId: collection.id,
            name: data.name,
            description: data.description || undefined,
          },
        },
        refetchQueries: ['Collections'],
      });
      onSuccess?.();
    } catch (error) {
      console.error('Failed to update collection:', error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`space-y-6 ${className || ''}`}
      >
        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter collection name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe what this collection is for"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? 'Updating...' : 'Update Collection'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
