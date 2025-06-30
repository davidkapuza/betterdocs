import React from 'react';
import { useNavigate } from 'react-router';
import { useCreateCollectionMutation } from '@/shared/gql/__generated__/operations';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@betterdocs/ui';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
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
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { pathKeys } from '@/shared/lib/react-router';

const createCollectionSchema = z.object({
  name: z
    .string()
    .min(1, 'Collection name is required')
    .max(100, 'Name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
});

type CreateCollectionForm = z.infer<typeof createCollectionSchema>;

interface CreateCollectionDialogProps {
  onCollectionCreated?: () => void;
}

export function CreateCollectionDialog({
  onCollectionCreated,
}: CreateCollectionDialogProps) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [createCollection, { loading }] = useCreateCollectionMutation();
  const isDesktop = !useIsMobile();

  const form = useForm<CreateCollectionForm>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (data: CreateCollectionForm) => {
    try {
      const collection = await createCollection({
        variables: {
          createCollectionInput: {
            name: data.name,
            description: data.description || undefined,
          },
        },
        refetchQueries: ['Collections'],
      });
      setOpen(false);
      form.reset();
      onCollectionCreated?.();
      if (collection.data)
        navigate(
          pathKeys.collections.collection({
            collectionId: collection.data.createCollection.id.toString(),
          })
        );
    } catch (error) {
      console.error('Failed to create collection:', error);
    }
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mb-6">
            <Plus className="w-4 h-4 mr-2" />
            Create Collection
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Collection</DialogTitle>
            <DialogDescription>
              Create a new collection to organize your documents. You can always
              edit this information later.
            </DialogDescription>
          </DialogHeader>
          <CollectionForm form={form} onSubmit={onSubmit} loading={loading} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="mb-6">
          <Plus className="w-4 h-4 mr-2" />
          Create Collection
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Create New Collection</DrawerTitle>
          <DrawerDescription>
            Create a new collection to organize your documents. You can always
            edit this information later.
          </DrawerDescription>
        </DrawerHeader>
        <CollectionForm
          form={form}
          onSubmit={onSubmit}
          loading={loading}
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
  form: ReturnType<typeof useForm<CreateCollectionForm>>;
  onSubmit: (data: CreateCollectionForm) => Promise<void>;
  loading: boolean;
  className?: string;
}

function CollectionForm({
  form,
  onSubmit,
  loading,
  className,
}: CollectionFormProps) {
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
            {loading ? 'Creating...' : 'Create Collection'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
