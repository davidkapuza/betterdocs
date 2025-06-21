import * as React from 'react';
import { ChevronRight, File, Files, Plus } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@betterdocs/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
  SidebarTrigger,
} from '@betterdocs/ui/sidebar';
import { Button } from '@betterdocs/ui/button';
import { useMatch, useNavigate, useParams } from 'react-router';
import { pathKeys, routerTypes } from '@/shared/lib/react-router';
import {
  useCollectionDocumentsSuspenseQuery,
  useDocumentTreeQuery,
  useCreateDocumentMutation,
} from '@/shared/gql/__generated__/operations';

export function DocumentsSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const params = useParams() as routerTypes.DocumentPageParams;
  const [createDocument, { loading }] = useCreateDocumentMutation();

  const { data } = useCollectionDocumentsSuspenseQuery({
    variables: {
      collectionId: Number(params.collectionId),
    },
  });

  // Handler to create a new document
  const handleCreateDocument = async () => {
    if (!params.collectionId) return;
    await createDocument({
      variables: {
        createDocumentInput: {
          collectionId: Number(params.collectionId),
          title: 'Untitled Document',
          content: JSON.stringify([{ type: 'p', children: [{ text: '' }] }]),
        },
      },
      refetchQueries: ['CollectionDocuments'],
    });
  };

  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarTrigger className="z-10" />
          <SidebarGroupLabel>Documents</SidebarGroupLabel>
          <Button
            size="sm"
            className="my-2"
            onClick={handleCreateDocument}
            disabled={loading}
          >
            {loading ? (
              'Creating...'
            ) : (
              <>
                <Plus /> New Document
              </>
            )}
          </Button>
          <SidebarGroupContent className="group-data-[collapsible=icon]:opacity-0">
            <SidebarMenu>
              {data?.collection.documents.map((document, index) => (
                <Tree key={index} document={document} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

type TreeProps = {
  document: {
    id: number;
    collectionId: number;
    title: string;
    children?: TreeProps['document'][];
  };
};

function Tree(props: TreeProps) {
  const { document } = props;

  // const params = useParams() as routerTypes.DocumentPageParams;

  const navigate = useNavigate();

  const match = useMatch(
    pathKeys.documents.document({
      collectionId: document.collectionId.toString(),
      documentId: document.id.toString(),
    })
  );

  // const selectedDocumentId =
  //   documentModel.useDocumentStore.use.selectedDocumentId();

  // const setSelectedDocumentId =
  //   documentModel.useDocumentStore.use.setSelectedDocumentId();

  const { data, loading } = useDocumentTreeQuery({
    variables: {
      getDocumentInput: {
        documentId: document.id,
        collectionId: document.collectionId,
      },
    },
    skip: !document.children || !document.children.length,
  });

  if (loading) return 'Loading...';

  if (!document.children || !document.children.length) {
    return (
      <SidebarMenuButton
        isActive={Boolean(match)}
        className="data-[active=true]:bg-transparent"
        onClick={() => {
          navigate(
            pathKeys.documents.document({
              collectionId: document.collectionId.toString(),
              documentId: document.id.toString(),
            })
          );
        }}
      >
        <File />
        {document.title}
      </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenuItem>
      <Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90">
        <SidebarMenuButton
          isActive={Boolean(match)}
          onClick={() => {
            navigate(
              pathKeys.documents.document({
                collectionId: document.collectionId.toString(),
                documentId: document.id.toString(),
              })
            );
          }}
        >
          <CollapsibleTrigger asChild onClick={(e) => e.stopPropagation()}>
            <ChevronRight className="transition-transform" />
          </CollapsibleTrigger>
          <Files />
          {document.title}
        </SidebarMenuButton>
        <CollapsibleContent>
          <SidebarMenuSub>
            {data?.document.children.map((subDocument, index) => (
              <Tree key={index} document={subDocument} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}
