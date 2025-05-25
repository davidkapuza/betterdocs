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
  useGetDocumentSuspenseQuery,
  useUpdateDocumentMutation,
} from '@/shared/gql/__generated__/operations';
import { useParams } from 'react-router';
import { routerTypes } from '@/shared/lib/react-router';
import React from 'react';
import { useDebouncedCallback } from '@/shared/hooks/use-debounced-callback';
import { Value } from '@udecode/plate';

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

  if (!data) return null;

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate editor={editor} onValueChange={onDocumentChange}>
        <EditorContainer>
          <EditorHeader
            value={title}
            onChange={handleTitleChange}
            titleRef={titleRef}
            isReadOnly={false}
          />
          <Editor />
        </EditorContainer>
      </Plate>
    </DndProvider>
  );
});
