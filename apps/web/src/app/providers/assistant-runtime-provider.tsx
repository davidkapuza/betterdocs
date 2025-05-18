import { ReactNode } from 'react';
import {
  AssistantRuntimeProvider as RuntimeProvder,
  ChatModelAdapter,
  useLocalRuntime,
} from '@assistant-ui/react';
import { client } from '@/shared/lib/apollo';
import {
  QueryCollectionDocument,
  QueryCollectionSubscription,
  QueryCollectionSubscriptionVariables,
} from '@/shared/gql/__generated__/operations';

type AssistantRuntimeProviderProps = {
  children: ReactNode;
};

const MyModelAdapter: ChatModelAdapter = {
  async *run({ messages, abortSignal, context }) {
    let queryMessage;
    const userMessage = messages.at(-1);
    if (userMessage && userMessage.content[0].type === 'text') {
      queryMessage = userMessage.content[0].text;
    }

    const observable = client.subscribe<
      QueryCollectionSubscription,
      QueryCollectionSubscriptionVariables
    >({
      query: QueryCollectionDocument,
      variables: {
        queryCollectionInput: {
          query: queryMessage,
          collectionId: 1, // TODO use actual collectionId
        },
      },
    });

    let resolver: ((value: string | undefined) => void) | null = null;
    const contentQueue: string[] = [];
    let isDone = false;

    // Function to resolve the promise when new content arrives
    const resolveNext = (value?: string) => {
      if (resolver) {
        const r = resolver;
        resolver = null;
        r(value);
      }
    };

    const subscription = observable.subscribe({
      next: (result) => {
        const content = result.data?.queryCollection;

        if (content) {
          contentQueue.push(content);
          resolveNext(content);
        }
      },
      error: (_error: unknown) => {
        isDone = true;
        resolveNext(undefined);
      },
      complete: () => {
        isDone = true;
        resolveNext(undefined);
      },
    });

    abortSignal.addEventListener('abort', () => {
      subscription.unsubscribe();
      isDone = true;
      resolveNext(undefined);
    });

    try {
      let fullText = '';

      while (!isDone && !abortSignal.aborted) {
        // If we have queued content, yield it immediately
        if (contentQueue.length > 0) {
          const text = contentQueue.shift();
          fullText += text;

          yield {
            content: [{ type: 'text', text: fullText }],
          };
          continue;
        }

        // Wait for new content
        await new Promise<string | undefined>((resolve) => {
          resolver = resolve;

          // Add a timeout to periodically check the abort signal
          setTimeout(() => {
            if (abortSignal.aborted) {
              isDone = true;
              resolveNext(undefined);
            }
          }, 100);
        });
      }
    } finally {
      subscription.unsubscribe();
    }
  },
};

export function AssistantRuntimeProvider({
  children,
}: AssistantRuntimeProviderProps) {
  const runtime = useLocalRuntime(MyModelAdapter);

  return <RuntimeProvder runtime={runtime}>{children}</RuntimeProvder>;
}
