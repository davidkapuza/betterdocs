import { forwardRef, memo } from 'react';
import TextareaAutosize, {
  type TextareaAutosizeProps,
} from 'react-textarea-autosize';

import { cn } from '@betterdocs/utils';

type DocumentTitleProps = TextareaAutosizeProps;
// TODO Move into plate-ui as EditorTitle compoenent
export const DocumentTitle = memo(
  forwardRef<HTMLTextAreaElement, DocumentTitleProps>(
    ({ className, ...props }, ref) => {
      return (
        <TextareaAutosize
          ref={ref}
          className={cn(
            'w-full resize-none border-0 bg-transparent text-4xl font-bold outline-none placeholder:text-muted-foreground focus:outline-none focus:ring-0',
            className
          )}
          placeholder="Untitled"
          maxRows={3}
          {...props}
        />
      );
    }
  )
);

DocumentTitle.displayName = 'DocumentTitle';
