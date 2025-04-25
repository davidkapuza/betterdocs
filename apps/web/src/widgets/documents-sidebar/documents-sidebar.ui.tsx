import * as React from 'react';
import { ChevronRight, File, Files } from 'lucide-react';

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
} from '@betterdocs/ui/sidebar';
import { useParams } from 'react-router';
import { routerTypes } from '@/shared/lib/react-router';
import {
  useCollectionDocumentsSuspenseQuery,
  useDocumentTreeQuery,
} from '@/shared/gql/__generated__/operations';
import { documentModel } from '@/entities/document';

export function DocumentsSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const params = useParams() as routerTypes.CollectionPageParams;

  const { data } = useCollectionDocumentsSuspenseQuery({
    variables: {
      collectionId: Number(params.collectionId),
    },
  });

  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Documents</SidebarGroupLabel>
          <SidebarGroupContent>
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

  const selectedDocumentId =
    documentModel.useDocumentStore.use.selectedDocumentId();

  const setSelectedDocumentId =
    documentModel.useDocumentStore.use.setSelectedDocumentId();

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
        isActive={document.id === selectedDocumentId}
        className="data-[active=true]:bg-transparent"
        onClick={() => {
          setSelectedDocumentId(document.id);
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
          isActive={document.id === selectedDocumentId}
          onClick={() => {
            setSelectedDocumentId(document.id);
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
