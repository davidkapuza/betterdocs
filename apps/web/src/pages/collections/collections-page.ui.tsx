import { useCollectionsSuspenseQuery } from '@/shared/gql/__generated__/operations';
import { Navbar } from '@/widgets/navbar';
import { NavLink } from 'react-router';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@betterdocs/ui/breadcrumb';
import { Separator } from '@betterdocs/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@betterdocs/ui/sidebar';
import { DocumentsSidebar } from '@/widgets/documents-sidebar';

export function CollectionsPage() {
  const { data } = useCollectionsSuspenseQuery();

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center gap-6 p-6 min-h-svh bg-background md:p-10">
        {data?.collections.map((collection) => (
          <NavLink
            key={collection.id}
            to={collection.id.toString()}
            className="block w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {collection.name}
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {collection.description}
            </p>
          </NavLink>
        ))}
      </div>
    </>
  );
}

export function CollectionPage() {
  return (
    <SidebarProvider>
      <DocumentsSidebar />
      <SidebarInset>
        <header className="flex items-center h-16 gap-2 px-4 border-b shrink-0">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4 mr-2" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">components</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">ui</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>button.tsx</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-col flex-1 gap-4 p-4">
          <div className="grid gap-4 auto-rows-min md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
