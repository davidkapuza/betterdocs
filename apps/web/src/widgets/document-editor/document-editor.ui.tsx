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
import { documentModel } from '@/entities/document';
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
  const params = useParams() as routerTypes.CollectionPageParams;

  const selectedDocumentId =
    documentModel.useDocumentStore.use.selectedDocumentId();

  const { data } = useGetDocumentSuspenseQuery({
    variables: {
      getDocumentInput: {
        collectionId: Number(params.collectionId),
        documentId: selectedDocumentId,
      },
    },
  });

  // editor.tf.init doesnt set data on first render for some reason, therefore
  // initialValue is being set using intermidiate state
  const [initialValue, setInitialValue] = React.useState<Value>();

  React.useEffect(() => {
    if (data) {
      let content = [];
      try {
        content = JSON.parse(data.document.content);
      } catch (e) {
        console.error('Error parsing document content:', e);
      }
      setInitialValue(content);
    }
  }, [data]);

  React.useEffect(() => {
    if (initialValue) {
      editor.tf.init({
        value: initialValue,
        autoSelect: 'end',
      });
    }
  }, [initialValue, editor]);

  const [updateDocument] = useUpdateDocumentMutation();

  const onDcoumentChange = useDebouncedCallback(
    ({ value, title }: Partial<{ value: Value; title: string }>) => {
      updateDocument({
        variables: {
          updateDocumentInput: {
            collectionId: Number(params.collectionId),
            documentId: selectedDocumentId,
            content: JSON.stringify(value),
            title,
          },
        },
      });
    },
    500
  );

  const titleRef = React.useRef<HTMLTextAreaElement>(null);

  if (!data) return null;

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate editor={editor} onChange={onDcoumentChange}>
        <EditorContainer>
          <EditorHeader
            initialTitle={data.document.title}
            onChange={(title) => onDcoumentChange({ title })}
            titleRef={titleRef}
            isReadOnly={false}
          />
          <Editor />
        </EditorContainer>
      </Plate>
    </DndProvider>
  );
});
