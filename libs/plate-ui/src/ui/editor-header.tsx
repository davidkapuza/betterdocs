import React, { memo, RefObject } from 'react';
import { EditorTitle } from './editor-title';

export interface EditorHeaderProps {
  value: string;
  titleRef: RefObject<HTMLTextAreaElement>;
  onChange: (title: string) => void;
  isReadOnly: boolean;
}

export const EditorHeader = memo(
  ({ titleRef, onChange, isReadOnly, value }: EditorHeaderProps) => {
    return (
      <div
        className="px-16 pt-10 cursor-text"
        onClick={() => titleRef.current?.focus()}
      >
        <div className="flex items-center gap-2 lg:narrow">
          <EditorTitle
            ref={titleRef}
            onChange={onChange}
            textareaProps={{
              readOnly: isReadOnly,
              value,
              // onDoubleClick: temporarilyUnlock,
            }}
          />
        </div>
      </div>
    );
  }
);
