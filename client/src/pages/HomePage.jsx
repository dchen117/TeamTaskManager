import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { EmptyDemo } from "@/components/no-projects"
import { Kanban } from "@/components/Kanban"
import { useParams } from "react-router-dom"
import { useProjects } from "@/hooks/useProjects"
import { Spinner } from "@/components/ui/spinner"

export default function HomePage() {
  const { workspaceId } = useParams();
  const { isPending, data } = useProjects(workspaceId);
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-screen overflow-hidden flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        {isPending ? <div className="flex h-screen justify-center items-center"><Spinner className="size-8"/></div> : (data ? <Kanban /> : <EmptyDemo />)}
      </SidebarInset>
    </SidebarProvider>
  )
}
