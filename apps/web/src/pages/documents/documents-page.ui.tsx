import { useIsMobile } from '@/shared/hooks/use-mobile';
import { DocumentEditor } from '@/widgets/document-editor';
import { DocumentPrompt } from '@/widgets/document-prompt';
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@betterdocs/ui';
import { MessageCircle } from 'lucide-react';

export function DocumentPage() {
  const isMobile = useIsMobile();

  if (isMobile)
    return (
      <div className="relative min-h-screen">
        <DocumentEditor />
        <Drawer>
          <DrawerTrigger className="fixed z-50 bottom-5 right-5" asChild>
            <Button size="icon-lg" className="rounded-full shadow-lg">
              <MessageCircle />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[85vh] flex flex-col">
            <DrawerHeader className="flex-shrink-0">
              <DrawerTitle>AI Assistant</DrawerTitle>
              <DrawerDescription>
                Ask questions about your documents or get help with content
              </DrawerDescription>
            </DrawerHeader>
            <div className="flex-1 overflow-hidden">
              <DocumentPrompt />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    );

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel minSize={30}>
        <DocumentEditor />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel minSize={30}>
        <DocumentPrompt />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
