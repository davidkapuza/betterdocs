import * as React from 'react';
import {
  ChevronRight,
  File,
  Files,
  List,
  LogOut,
  Plus,
  User,
} from 'lucide-react';

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
import { NavLink, useMatch, useNavigate, useParams } from 'react-router';
import { pathKeys, routerTypes } from '@/shared/lib/react-router';
import {
  useCollectionDocumentsSuspenseQuery,
  useDocumentTreeQuery,
  useCreateDocumentMutation,
  useUserSuspenseQuery,
} from '@/shared/gql/__generated__/operations';
import { compose, withSuspense } from '@/shared/lib/react';
import { withErrorBoundary } from 'react-error-boundary';
import { ErrorHandler } from '@/shared/ui/error-handler';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@betterdocs/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@betterdocs/ui/avatar';

// [ ] Decomoposition into widgets
// [ ] "Recent" feature for collections page

export function DocumentsSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const params = useParams() as routerTypes.DocumentPageParams;

  const match = useMatch(pathKeys.documents.root());

  const { data } = useUserSuspenseQuery();

  if (!data) return null;

  const initials =
    `${data.user.firstName[0]}${data.user.lastName[0]}`.toUpperCase();

  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup className="h-full gap-2 py-4">
          <SidebarTrigger className="z-10" />

          <SidebarMenuButton isActive={Boolean(match)} className="z-10" asChild>
            <NavLink to={pathKeys.documents.root()}>
              <List />
              <span className="truncate">Collections</span>
            </NavLink>
          </SidebarMenuButton>
          {params.collectionId && (
            <>
              <SidebarGroupLabel>Collection documents</SidebarGroupLabel>
              <SidebarGroupContent className="group-data-[collapsible=icon]:opacity-0">
                <CollectionDocuments
                  collectionId={Number(params.collectionId)}
                />
              </SidebarGroupContent>
            </>
          )}
          <DropdownMenu>
            <SidebarMenuButton asChild className="mt-auto">
              <DropdownMenuTrigger>
                <User />
                <span className="truncate">
                  {data.user.firstName} {data.user.lastName}
                </span>
              </DropdownMenuTrigger>
            </SidebarMenuButton>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="w-8 h-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-sm leading-tight text-left">
                    <span className="font-semibold truncate">
                      {data.user.firstName} {data.user.lastName}
                    </span>
                    <span className="text-xs truncate text-muted-foreground">
                      {data.user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

type CollectionDocumentsProps = {
  collectionId: number;
};

const enhance = compose<CollectionDocumentsProps>(
  (component) =>
    withErrorBoundary(component, { FallbackComponent: ErrorHandler }),
  (component) => withSuspense(component, { fallback: 'Loading...' })
);

const CollectionDocuments = enhance((props) => {
  const { collectionId } = props;
  // TODO Move document creation into feature
  const [createDocument, { loading }] = useCreateDocumentMutation();

  const { data } = useCollectionDocumentsSuspenseQuery({
    variables: {
      collectionId,
    },
  });

  // Handler to create a new document
  const handleCreateDocument = async () => {
    await createDocument({
      variables: {
        createDocumentInput: {
          collectionId,
          title: 'Untitled Document',
          content: JSON.stringify([{ type: 'p', children: [{ text: '' }] }]),
        },
      },
      refetchQueries: ['CollectionDocuments'],
    });
  };

  return (
    <>
      <Button
        size="sm"
        className="w-full mb-3"
        variant="outline"
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
      <SidebarMenu>
        {data?.collection.documents.map((document, index) => (
          <Tree key={index} document={document} />
        ))}
      </SidebarMenu>
    </>
  );
});

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
  const navigate = useNavigate();
  const match = useMatch(
    pathKeys.documents.document({
      collectionId: document.collectionId.toString(),
      documentId: document.id.toString(),
    })
  );
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
        <span className="truncate">{document.title}</span>
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
          <span className="truncate">{document.title}</span>
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
