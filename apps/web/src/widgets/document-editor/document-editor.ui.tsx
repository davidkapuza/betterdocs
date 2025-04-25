import { compose, withSuspense } from '@/shared/lib/react';
import { ErrorHandler } from '@/shared/ui/error-handler';
import { withErrorBoundary } from 'react-error-boundary';
import { DocumentEditorSkeleton } from './document-editor.skeleton';
import { documentModel } from '@/entities/document';

const enhance = compose(
  (component) =>
    withErrorBoundary(component, { FallbackComponent: ErrorHandler }),
  (component) =>
    withSuspense(component, { FallbackComponent: DocumentEditorSkeleton })
);

export const DocumentEditor = enhance(() => {
  const selectedDocumentId =
    documentModel.useDocumentStore.use.selectedDocumentId();


  return (
   <div>TODO</div>
  );
});
