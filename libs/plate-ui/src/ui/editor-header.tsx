import React, { memo, RefObject } from 'react';
import { EditorTitle } from './editor-title';

export interface EditorHeaderProps {
  titleRef: RefObject<HTMLTextAreaElement>;
  initialTitle: string;
  onChange: (title: string) => void;
  isReadOnly: boolean;
}

export const EditorHeader = memo(
  ({ titleRef, initialTitle, onChange, isReadOnly }: EditorHeaderProps) => {
    return (
      <div
        className="px-16 pt-10 cursor-text"
        onClick={() => titleRef.current?.focus()}
      >
        <div className="flex items-center gap-2 lg:narrow">
          <EditorTitle
            ref={titleRef}
            initialTitle={initialTitle}
            onChange={onChange}
            textareaProps={{
              readOnly: isReadOnly,
              // onDoubleClick: temporarilyUnlock,
            }}
          />
        </div>
      </div>
    );
  }
);
