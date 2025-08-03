import React from 'react';
import {
  useInviteUserToCollectionMutation,
  useGenerateCollectionShareLinkMutation,
  useCollectionMembersQuery,
  CollectionsQuery,
} from '@/shared/gql/__generated__/operations';
import { UserCollectionRole } from '@/shared/gql/__generated__/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@betterdocs/ui';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@betterdocs/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { useState } from 'react';
import { Copy, Link, Mail, Users, Check } from 'lucide-react';

const inviteUserSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  role: z.nativeEnum(UserCollectionRole),
});

const shareLinkSchema = z.object({
  role: z.nativeEnum(UserCollectionRole),
  expiresInDays: z.number().min(1).max(365).optional(),
});

type InviteUserForm = z.infer<typeof inviteUserSchema>;
type ShareLinkForm = z.infer<typeof shareLinkSchema>;

interface InviteUsersDialogProps {
  collection: CollectionsQuery['collections'][number];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteUsersDialog({
  collection,
  open,
  onOpenChange,
}: InviteUsersDialogProps) {
  const isDesktop = !useIsMobile();

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Invite users to "{collection.name}"</DialogTitle>
            <DialogDescription>
              Add collaborators to your collection by sending email invitations or sharing a link.
            </DialogDescription>
          </DialogHeader>
          <InviteContent
            collection={collection}
            onSuccess={() => onOpenChange(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Invite users to "{collection.name}"</DrawerTitle>
          <DrawerDescription>
            Add collaborators to your collection by sending email invitations or sharing a link.
          </DrawerDescription>
        </DrawerHeader>
        <InviteContent
          collection={collection}
          onSuccess={() => onOpenChange(false)}
          className="px-4"
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

interface InviteContentProps {
  collection: CollectionsQuery['collections'][number];
  onSuccess?: () => void;
  className?: string;
}

function InviteContent({
  collection,
  onSuccess,
  className,
}: InviteContentProps) {
  const [activeTab, setActiveTab] = useState('email');
  const [inviteUser, { loading: inviteLoading }] = useInviteUserToCollectionMutation();
  const [generateShareLink, { loading: linkLoading }] = useGenerateCollectionShareLinkMutation();
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: membersData } = useCollectionMembersQuery({
    variables: { collectionId: collection.id },
  });

  const inviteForm = useForm<InviteUserForm>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      role: UserCollectionRole.Viewer,
    },
  });

  const shareLinkForm = useForm<ShareLinkForm>({
    resolver: zodResolver(shareLinkSchema),
    defaultValues: {
      role: UserCollectionRole.Viewer,
      expiresInDays: 7,
    },
  });

  const onInviteSubmit = async (data: InviteUserForm) => {
    try {
      await inviteUser({
        variables: {
          inviteUserToCollectionInput: {
            collectionId: collection.id,
            email: data.email,
            role: data.role,
          },
        },
        refetchQueries: ['CollectionMembers'],
      });
      inviteForm.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to invite user:', error);
    }
  };

  const onGenerateLink = async (data: ShareLinkForm) => {
    try {
      const result = await generateShareLink({
        variables: {
          generateCollectionShareLinkInput: {
            collectionId: collection.id,
            role: data.role,
            expiresInDays: data.expiresInDays,
          },
        },
      });
      
      if (result.data?.generateCollectionShareLink) {
        setGeneratedLink(result.data.generateCollectionShareLink.url);
      }
    } catch (error) {
      console.error('Failed to generate share link:', error);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const getRoleLabel = (role: UserCollectionRole) => {
    switch (role) {
      case UserCollectionRole.Owner:
        return 'Owner';
      case UserCollectionRole.Editor:
        return 'Editor';
      case UserCollectionRole.Viewer:
        return 'Viewer';
      default:
        return role;
    }
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Invitation
          </TabsTrigger>
          <TabsTrigger value="link" className="flex items-center gap-2">
            <Link className="w-4 h-4" />
            Share Link
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4">
          <Form {...inviteForm}>
            <form onSubmit={inviteForm.handleSubmit(onInviteSubmit)} className="space-y-4">
              <FormField
                control={inviteForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="colleague@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={inviteForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UserCollectionRole.Viewer}>
                          <div>
                            <div className="font-medium">Viewer</div>
                            <div className="text-sm text-muted-foreground">Can only view documents</div>
                          </div>
                        </SelectItem>
                        <SelectItem value={UserCollectionRole.Editor}>
                          <div>
                            <div className="font-medium">Editor</div>
                            <div className="text-sm text-muted-foreground">Can edit and create documents</div>
                          </div>
                        </SelectItem>
                        <SelectItem value={UserCollectionRole.Owner}>
                          <div>
                            <div className="font-medium">Owner</div>
                            <div className="text-sm text-muted-foreground">Can edit, delete, and manage members</div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={inviteLoading} className="w-full">
                {inviteLoading ? 'Sending invitation...' : 'Send invitation'}
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="link" className="space-y-4">
          <Form {...shareLinkForm}>
            <form onSubmit={shareLinkForm.handleSubmit(onGenerateLink)} className="space-y-4">
              <FormField
                control={shareLinkForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role for users joining via link</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UserCollectionRole.Viewer}>
                          <div>
                            <div className="font-medium">Viewer</div>
                            <div className="text-sm text-muted-foreground">Can only view documents</div>
                          </div>
                        </SelectItem>
                        <SelectItem value={UserCollectionRole.Editor}>
                          <div>
                            <div className="font-medium">Editor</div>
                            <div className="text-sm text-muted-foreground">Can edit and create documents</div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={shareLinkForm.control}
                name="expiresInDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link expires in (days)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="7"
                        min="1"
                        max="365"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={linkLoading} className="w-full">
                {linkLoading ? 'Generating link...' : 'Generate share link'}
              </Button>
            </form>
          </Form>

          {generatedLink && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Share Link Generated</CardTitle>
                <CardDescription>
                  Anyone with this link can join as a {getRoleLabel(shareLinkForm.watch('role')).toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Input
                    value={generatedLink}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => copyToClipboard(generatedLink)}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Current Members */}
      {membersData?.collectionMembers && membersData.collectionMembers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Current Members ({membersData.collectionMembers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {membersData.collectionMembers.map((member) => (
                <div key={member.user.id} className="flex items-center justify-between p-2 rounded border">
                  <div>
                    <div className="font-medium">
                      {member.user.firstName} {member.user.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {member.user.email}
                    </div>
                  </div>
                  <Badge variant={member.role === UserCollectionRole.Owner ? 'default' : 'secondary'}>
                    {getRoleLabel(member.role)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
