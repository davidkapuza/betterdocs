import { useCollectionsSuspenseQuery } from '@/shared/gql/__generated__/operations';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { pathKeys } from '@/shared/lib/react-router';
import { CreateCollectionDialog } from '@/widgets/create-collection-dialog';
import { SidebarTrigger } from '@betterdocs/ui';
import { FolderOpen } from 'lucide-react';
import { NavLink } from 'react-router';

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
              <NavLink
                key={collection.id}
                to={pathKeys.collections.collection({
                  collectionId: collection.id.toString(),
                })}
                className="block w-full p-6 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {collection.name}
                </h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {collection.description || 'No description'}
                </p>
                <div className="text-sm text-muted-foreground">
                  {collection.documents.length} document
                  {collection.documents.length !== 1 ? 's' : ''}
                </div>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
