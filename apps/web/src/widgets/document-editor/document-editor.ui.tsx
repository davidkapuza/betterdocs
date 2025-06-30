'use client';

import { useSearchParams } from 'react-router';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Plate } from '@udecode/plate/react';
import { useCreateEditor } from './hooks/use-create-editor';
import { Editor, EditorContainer } from '@betterdocs/ui';
import { EditorHeader } from '@betterdocs/ui';
import { compose, withSuspense } from '@/shared/lib/react';
import { ErrorHandler } from '@/shared/ui/error-handler';
import { withErrorBoundary } from 'react-error-boundary';
import { DocumentEditorSkeleton } from './document-editor.skeleton';
import {
  useDeleteDocumentMutation,
  useGetDocumentSuspenseQuery,
  useUpdateDocumentMutation,
  useCreateDocumentMutation,
} from '@/shared/gql/__generated__/operations';
import { useParams } from 'react-router';
import { routerTypes } from '@/shared/lib/react-router';
import React from 'react';
import { useDebouncedCallback } from '@/shared/hooks/use-debounced-callback';
import { Value } from '@udecode/plate';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
  SidebarTrigger,
} from '@betterdocs/ui';
import { Ellipsis, Trash2, Plus, FileText } from 'lucide-react';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { skipToken } from '@apollo/client';

const enhance = compose(
  (component) =>
    withErrorBoundary(component, { FallbackComponent: ErrorHandler }),
  (component) =>
    withSuspense(component, { FallbackComponent: DocumentEditorSkeleton })
);

export const DocumentEditor = enhance(() => {
  const editor = useCreateEditor({
    skipInitialization: true,
  });
  const params = useParams() as routerTypes.DocumentsPageParams;
  const [searchParams, setSearchParams] = useSearchParams();

  const documentId = searchParams.get('documentId');

  const { data } = useGetDocumentSuspenseQuery(
    documentId
      ? {
          variables: {
            getDocumentInput: {
              collectionId: Number(params.collectionId),
              documentId: Number(documentId),
            },
          },
        }
      : skipToken
  );

  const [title, setTitle] = React.useState('');

  React.useEffect(() => {
    if (data) {
      let content = [];
      try {
        content = JSON.parse(data.document.content);
      } catch (e) {
        console.error('Error parsing document content:', e);
      }
      editor.tf.init({
        value: content,
        autoSelect: 'end',
      });

      setTitle(data.document.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, editor]);

  const [updateDocument] = useUpdateDocumentMutation();

  const onDocumentChange = useDebouncedCallback(
    ({ value, title }: Partial<{ value: Value; title: string }>) => {
      if (!documentId) return;
      updateDocument({
        variables: {
          updateDocumentInput: {
            collectionId: Number(params.collectionId),
            documentId: Number(documentId),
            content: JSON.stringify(value ?? '[]'),
            title,
          },
        },
      });
    },
    500
  );

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    onDocumentChange({ title: newTitle });
  };

  const titleRef = React.useRef<HTMLTextAreaElement>(null);

  const [deleteDocument, { loading: deleting }] = useDeleteDocumentMutation();
  const [createDocument, { loading: creating }] = useCreateDocumentMutation();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!documentId) return;
    await deleteDocument({
      variables: {
        deleteDocumentInput: {
          collectionId: Number(params.collectionId),
          documentId: Number(documentId),
        },
      },
    });
    setSearchParams({});
  };

  const handleCreateDocument = async () => {
    const result = await createDocument({
      variables: {
        createDocumentInput: {
          collectionId: Number(params.collectionId),
          title: 'Untitled Document',
          content: JSON.stringify([
            {
              children: [
                {
                  text: '',
                },
              ],
              type: 'p',
            },
          ]),
        },
      },
    });

    if (result.data?.createDocument) {
      setSearchParams({ documentId: result.data.createDocument.id.toString() });
    }
  };

  const isMobile = useIsMobile();

  if (!data)
    return (
      <div className="flex flex-col min-h-screen">
        {isMobile && (
          <div className="fixed top-0 flex items-center px-16 py-8">
            <SidebarTrigger />
          </div>
        )}
        <div className="flex flex-col items-center justify-center flex-1 px-14">
          <div className="flex flex-col items-center max-w-md space-y-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 rounded-full bg-muted">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">No document selected</h3>
                <p className="text-sm text-muted-foreground">
                  Select a document from the sidebar or create a new one to get
                  started.
                </p>
              </div>

              <Button
                onClick={handleCreateDocument}
                disabled={creating}
                className="mt-4"
              >
                {creating ? (
                  'Creating...'
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Document
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate editor={editor} onValueChange={onDocumentChange}>
        <EditorContainer>
          {isMobile && (
            <div className="flex items-center justify-between py-8 px-14">
              <SidebarTrigger />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon-sm" variant="ghost">
                    <Ellipsis />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={handleDelete}
                  >
                    {deleting ? (
                      'Deleting...'
                    ) : (
                      <>
                        Delete <Trash2 className="ms-auto" />
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <div className="flex flex-col gap-4 px-16 py-8">
            {!isMobile && (
              <div className="flex items-center w-full max-w-3xl gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon-sm" variant="ghost">
                      <Ellipsis />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={handleDelete}
                    >
                      {deleting ? (
                        'Deleting...'
                      ) : (
                        <>
                          Delete <Trash2 className="ms-auto" />
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            <EditorHeader
              value={title}
              onChange={handleTitleChange}
              titleRef={titleRef}
              isReadOnly={false}
            />
          </div>
          <Editor />
        </EditorContainer>
      </Plate>
    </DndProvider>
  );
});
