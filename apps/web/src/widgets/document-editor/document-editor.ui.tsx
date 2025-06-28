'use client';

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
} from '@/shared/gql/__generated__/operations';
import { useNavigate, useParams } from 'react-router';
import { pathKeys, routerTypes } from '@/shared/lib/react-router';
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
import { Check, Ellipsis, Trash2 } from 'lucide-react';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { Loader2 } from 'lucide-react';
import { cn } from '@betterdocs/utils';

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
  const params = useParams() as routerTypes.DocumentPageParams;
  const navigate = useNavigate();

  const { data } = useGetDocumentSuspenseQuery({
    variables: {
      getDocumentInput: {
        collectionId: Number(params.collectionId),
        documentId: Number(params.documentId),
      },
    },
  });

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

  const [updateDocument, { loading: saving }] = useUpdateDocumentMutation();

  const onDocumentChange = useDebouncedCallback(
    ({ value, title }: Partial<{ value: Value; title: string }>) => {
      updateDocument({
        variables: {
          updateDocumentInput: {
            collectionId: Number(params.collectionId),
            documentId: Number(params.documentId),
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

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteDocument({
      variables: {
        deleteDocumentInput: {
          collectionId: Number(params.collectionId),
          documentId: Number(params.documentId),
        },
      },
      refetchQueries: ['CollectionDocuments'],
    });
    // TODO redirect to the last document in the collection
    navigate(pathKeys.documents.root());
  };

  const isMobile = useIsMobile();

  const [showUpToDate, setShowUpToDate] = React.useState(false);
  const prevSavingRef = React.useRef(saving);
  React.useEffect(() => {
    if (prevSavingRef.current && !saving) {
      setShowUpToDate(true);
      const timeout = setTimeout(() => setShowUpToDate(false), 5000);
      return () => clearTimeout(timeout);
    }
    prevSavingRef.current = saving;
  }, [saving]);

  if (!data) return null;

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate editor={editor} onValueChange={onDocumentChange}>
        <EditorContainer>
          <div className="flex flex-col gap-4 px-16 py-8">
            <div className="flex items-center w-full max-w-3xl gap-2">
              {isMobile && <SidebarTrigger />}
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
              <div className="ms-auto text-sm min-w-[80px] h-6 flex items-center relative">
                {saving ? (
                  <span className="flex items-center gap-2 text-muted-foreground animate-fade-in">
                    <Loader2 className="animate-spin size-4" /> Saving...
                  </span>
                ) : (
                  <span
                    className={cn(
                      `flex items-center gap-2 text-sm text-green-600 transition-opacity duration-700`,
                      showUpToDate
                        ? 'opacity-100 animate-fade-in'
                        : 'opacity-0 pointer-events-none'
                    )}
                  >
                    <Check className="size-4" />
                    Saved
                  </span>
                )}
              </div>
            </div>
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
