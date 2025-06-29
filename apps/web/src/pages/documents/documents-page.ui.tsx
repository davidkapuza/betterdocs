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
      <>
        <DocumentEditor />
        <Drawer>
          <DrawerTrigger className="absolute bottom-6 right-6" asChild>
            <Button size="icon-lg" className="rounded-full shadow-lg">
              <MessageCircle />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[90vh]">
            <DrawerHeader className="invisible">
              <DrawerTitle>Use AI to search in your documents</DrawerTitle>
              <DrawerDescription>TODO</DrawerDescription>
            </DrawerHeader>
            <DocumentPrompt />
          </DrawerContent>
        </Drawer>
      </>
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
