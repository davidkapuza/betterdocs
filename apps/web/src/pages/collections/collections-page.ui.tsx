import { useCollectionsSuspenseQuery } from '@/shared/gql/__generated__/operations';

export function CollectionsPage() {
  useCollectionsSuspenseQuery();

  return (
    <div>
      <h1>Collections</h1>
    </div>
  );
}
