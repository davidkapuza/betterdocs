import { Thread } from '@betterdocs/ui';

export function DocumentPrompt() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <Thread />
      </div>
    </div>
  );
}
