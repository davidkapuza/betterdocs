'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Plate } from '@udecode/plate/react';
import { useCreateEditor } from './hooks/use-create-editor';
import { Editor, EditorContainer } from '@betterdocs/plate-ui/editor';
import { EditorHeader } from '@betterdocs/plate-ui/editor-header';
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
} from '@betterdocs/ui/dropdown-menu';
import { Ellipsis, Trash2 } from 'lucide-react';
import { Button } from '@betterdocs/ui/button';

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
        shouldNormalizeEditor: true,
      });
      setTitle(data.document.title); // <-- update title state when data changes
    }
  }, [data, editor]);

  const [updateDocument] = useUpdateDocumentMutation();

  const onDocumentChange = useDebouncedCallback(
    ({ value, title }: Partial<{ value: Value; title: string }>) => {
      updateDocument({
        variables: {
          updateDocumentInput: {
            collectionId: Number(params.collectionId),
            documentId: Number(params.documentId),
            content: JSON.stringify(value),
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

  if (!data) return null;

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate editor={editor} onValueChange={onDocumentChange}>
        <EditorContainer>
          <div className="flex items-center gap-3 px-16 pt-10 mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuItem variant="destructive" onClick={handleDelete}>
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
