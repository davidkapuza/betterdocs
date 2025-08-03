import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { useJoinCollectionByShareLinkMutation } from '@/shared/gql/__generated__/operations';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@betterdocs/ui';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { pathKeys } from '@/shared/lib/react-router';

export function JoinCollectionPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [joinCollection, { loading, error }] = useJoinCollectionByShareLinkMutation();
  const [joined, setJoined] = React.useState(false);
  const [attempted, setAttempted] = React.useState(false);
  const [collection, setCollection] = React.useState<{ id: number; name: string } | null>(null);

  React.useEffect(() => {
    const handleJoin = async () => {
      if (!token || attempted || joined) return;
      
      console.log('Attempting to join collection with token:', token);
      setAttempted(true);
      
      try {
        const result = await joinCollection({
          variables: { token },
          refetchQueries: ['Collections'],
        });
        
        if (result.data?.joinCollectionByShareLink) {
          setCollection(result.data.joinCollectionByShareLink);
          setJoined(true);
        }
      } catch (err) {
        console.error('Failed to join collection:', err);
        console.error('Token used:', token);
        // Error is already handled by the Apollo Client and available in the `error` variable
      }
    };

    handleJoin();
  }, [token, attempted, joined, joinCollection]);

  const goToCollection = () => {
    if (collection) {
      navigate(pathKeys.collections.collection({ collectionId: collection.id.toString() }));
    }
  };

  const goToCollections = () => {
    navigate(pathKeys.collections.root());
  };

  const retryJoin = () => {
    setAttempted(false);
    setJoined(false);
    setCollection(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
            <CardTitle>Joining Collection</CardTitle>
            <CardDescription>
              Please wait while we add you to the collection...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle>Unable to Join Collection</CardTitle>
            <CardDescription>
              {error.message || 'The invitation link may be invalid or expired.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button variant="outline" onClick={goToCollections} className="flex-1">
                View Collections
              </Button>
              <Button onClick={retryJoin} className="flex-1">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (joined && collection) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <CardTitle>Successfully Joined!</CardTitle>
            <CardDescription>
              You've been added to "{collection.name}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button variant="outline" onClick={goToCollections} className="flex-1">
                View All Collections
              </Button>
              <Button onClick={goToCollection} className="flex-1">
                Open Collection
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Invalid Link</CardTitle>
          <CardDescription>
            The collection link appears to be invalid.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={goToCollections} className="w-full">
            View Collections
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
