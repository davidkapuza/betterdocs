import React from 'react';

import {
  PromptInput,
  PromptInputActions,
  PromptInputTextarea,
} from '@betterdocs/ui/prompt-input';
import { Button } from '@betterdocs/ui/button';
import { ArrowUpIcon } from 'lucide-react';

export function DocumentPrompt() {
  const [prompt, setPrompt] = React.useState('');
  const [response, setResponse] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  // Track if we're in generation mode (for animation)
  const [isGenerating, setIsGenerating] = React.useState(false);
  const responseRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to the bottom of the response as it streams
  React.useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [response]);

  // Auto-focus the textarea when the page loads
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) return;

    // Start the animation by setting isGenerating to true
    setIsGenerating(true);
    setIsLoading(true);

    // Small delay to allow the animation to start before clearing the response
    setTimeout(() => {
      setResponse('');
    }, 300);

    try {
      // Reset input after sending
      setPrompt('');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Wait for the stream to complete
    } catch (error) {
      console.error('Error generating response:', error);
      setResponse(
        'Sorry, there was an error generating a response. Please try again.'
      );
    } finally {
      setIsLoading(false);
      // We keep isGenerating true since we now have a response
    }
  };

  // Reset function to go back to centered layout
  const handleReset = () => {
    setResponse('');
    setIsGenerating(false);
  };

  return (
    <main className="flex flex-col h-full">
      {/* Response Area - Always present but conditionally visible */}
      {/* <div
        ref={responseRef}
        className={`flex-1 p-4 overflow-y-auto bg-gray-50 transition-all duration-500 ease-in-out ${
          isGenerating ? 'opacity-100' : 'opacity-0 h-0 p-0'
        }`}
      >
        {response ? (
          <div className="whitespace-pre-wrap">{response}</div>
        ) : isGenerating ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Generating response...</span>
            </div>
          </div>
        ) : null}
      </div> */}

      {/* Input Area - Transitions between center and bottom */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          isGenerating
            ? ''
            : 'flex-1 flex items-center justify-center p-4'
        }`}
      >
        <div
          className={`${
            isGenerating ? 'max-w-3xl mx-auto w-full' : 'w-full max-w-3xl'
          }`}
        >
          {!isGenerating && (
            <h1 className="mb-8 text-3xl font-bold text-center">
              AI Prompt Generator
            </h1>
          )}

          <form onSubmit={handleSubmit}>
            <PromptInput
              className="border shadow-xs border-input bg-background"
              value={prompt}
              onValueChange={setPrompt}
            >
              <PromptInputTextarea placeholder="Type a message..." />
              <PromptInputActions className="justify-end">
                <Button
                  size="sm"
                  className="rounded-full cursor-pointer size-9"
                  disabled={!prompt.trim()}
                  aria-label="Send"
                  type="submit"
                >
                  <ArrowUpIcon className="w-4 h-4 min-h-4 min-w-4" />
                </Button>
              </PromptInputActions>
            </PromptInput>
          </form>
        </div>
      </div>
    </main>
  );
}
