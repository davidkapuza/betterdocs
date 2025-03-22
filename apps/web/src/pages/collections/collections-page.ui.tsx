import { useCollectionsQuery } from '@/shared/gql/__generated__/operations';

export function CollectionsPage() {
  const { loading, error } = useCollectionsQuery();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div>
      <h1>Collections</h1>
    </div>
  );
}
