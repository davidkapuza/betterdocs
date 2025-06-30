import { useSignInMutation } from '@/shared/gql/__generated__/operations';
import { pathKeys } from '@/shared/lib/react-router';
import { useSessionStore } from '@/shared/session';
import { Button } from '@betterdocs/ui';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@betterdocs/ui';
import { Input } from '@betterdocs/ui';
import { cn } from '@betterdocs/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { GalleryVerticalEnd, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type SignInInput = z.infer<typeof signInSchema>;

export function SignInForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const navigate = useNavigate();
  const setSession = useSessionStore.use.setSession();

  const [signIn, { loading }] = useSignInMutation({
    onCompleted: (data) => {
      setSession(data.signIn);
      navigate(pathKeys.collections.root());
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: SignInInput) =>
    signIn({
      variables: {
        signInInput: values,
      },
    });

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <a
                href="#"
                className="flex flex-col items-center gap-2 font-medium"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-md">
                  <GalleryVerticalEnd className="size-6" />
                </div>
                <span className="sr-only">Acme Inc.</span>
              </a>
              <h1 className="text-xl font-bold">Welcome to Acme Inc.</h1>
              <div className="text-sm text-center">
                Don&apos;t have an account?{' '}
                <NavLink
                  to={pathKeys.auth.signUp()}
                  className="underline underline-offset-4"
                >
                  Sign up
                </NavLink>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          autoComplete="email"
                          placeholder="m@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          placeholder="********"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="animate-spin" />}
                Login
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
