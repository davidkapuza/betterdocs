import {
  ChangeEvent,
  KeyboardEvent,
  Ref,
  TextareaHTMLAttributes,
  useRef,
} from 'react';
import { TextareaAutosize } from './textarea-autosize';

export interface EditorTitleProps {
  initialTitle: string;
  textareaProps?: Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'style'>;
  onChange: (title: string) => void;
  onEnter?: () => void;
  ref: Ref<HTMLTextAreaElement>;
}

export const EditorTitle = ({
  initialTitle,
  textareaProps = {},
  onChange,
  onEnter,
  ref,
}: EditorTitleProps) => {
  const isComposingRef = useRef(false);

  const setIsComposing = (isComposing: boolean) => {
    isComposingRef.current = isComposing;
  };

  return (
    <div className="contents cursor-text">
      <TextareaAutosize
        ref={ref}
        className="min-w-0 text-3xl text-black outline-none grow h1 em:text-2xl sm:em:text-3xl dark:text-white placeholder:truncate"
        style={{
          lineHeight: '1.2em',
        }}
        defaultValue={initialTitle}
        placeholder="Untitled"
        aria-label="Document title"
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
          onChange(event.target.value);
        }}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        onKeyDown={(event: KeyboardEvent) => {
          if (event.key === 'Enter' && !isComposingRef.current) {
            event.preventDefault();
            onEnter?.();
          }
        }}
        {...textareaProps}
      />
    </div>
  );
};
