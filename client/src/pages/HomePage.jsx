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
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useWorkspaces } from "@/hooks/useWorkspaces"

export default function HomePage() {
  const { workspaceId, projectId } = useParams();
  const { isPending: projectsIsPending, data: projects } = useProjects(workspaceId);
  const { data: workspaces, isPending: workspacesIsPending } = useWorkspaces();
  const navigate = useNavigate();

  useEffect(() => {
    if (workspacesIsPending) return;
    // No workspaces at all
    if (!workspaces?.length) {
        navigate("/workspaces", { replace: true });
        return;
    }
    // Current workspace doesn't exist
    const workspaceExists = workspaces.some(
        (workspace) => workspace._id === workspaceId
    );
    if (!workspaceExists) {
        // navigate(`/home/${workspaces[0]._id}`, { replace: true });
        navigate("/workspaces", { replace: true })
        return;
    }
    // Workspace is valid, so now check projects
    if (projectsIsPending) return;
    if (projectId && !projects?.some((project) => project._id === projectId)) {
        navigate(`/home/${workspaceId}`, { replace: true });
    }
  }, [workspaces, workspacesIsPending, workspaceId, projects, projectsIsPending, projectId, navigate,]);

  if (workspacesIsPending || !workspaces || projectsIsPending || !projects) {
    return (
      <div className="flex h-screen justify-center items-center"><Spinner className="size-8"/></div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar/>
      <SidebarInset className="h-screen overflow-hidden flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        {projects?.length ? <Kanban /> : <EmptyDemo />}
      </SidebarInset>
    </SidebarProvider>
  )
}
