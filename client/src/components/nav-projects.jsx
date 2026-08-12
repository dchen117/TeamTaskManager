"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { MoreHorizontalIcon, ArrowRightIcon, Trash2Icon, Edit2Icon } from "lucide-react"
import { IconCirclePlusFilled, IconMail } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { useProjects } from "@/hooks/useProjects"
import { useParams, NavLink } from "react-router-dom"
import { IconFolder } from "@tabler/icons-react"
import { AddProjectDialog } from "./add-project-dialog"
import { useState } from "react"
import { DeleteDialog } from "./delete-dialog"

export function NavProjects() {
  const { isMobile } = useSidebar()
  const { workspaceId, projectId } = useParams()
  const { data: projects, deleteProject } = useProjects(workspaceId)
  const [ deleteProjectDialogOpen, setDeleteProjectDialogOpen ] = useState(false);
  const [ addProjectDialogOpen, setAddProjectDialogOpen ] = useState(false);  
  const [ editProjectDialogOpen, setEditProjectDialogOpen ] = useState(false);
  const [ selectedProject, setSelectedProject ] = useState(null);

  async function handleDelete(e) {
    e.preventDefault();
    deleteProject(selectedProject._id);
    setDeleteProjectDialogOpen(false);
    setSelectedProject(null);
  }

  return (
    <>
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Create Project"
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
              onClick={() => setAddProjectDialogOpen(true)}
            >
              <IconCirclePlusFilled />
              <span>Create Project</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>{(projects && projects.length !== 0) ? 'Projects' : 'No Projects'}</SidebarGroupLabel>
        <SidebarMenu className="group-data-[collapsible=icon]:hidden">
          {projects && projects.map((project) => (
            <SidebarMenuItem key={project._id}>
              <SidebarMenuButton asChild isActive={project._id === projectId} className="data-[active=true]:border-l-4 data-[active=true]:border-primary rounded-none">
                <NavLink to={`/home/${workspaceId}/${project._id}`}>
                  <IconFolder/>
                  <span>{project.name}</span>
                </NavLink>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover className="aria-expanded:bg-muted">
                    <MoreHorizontalIcon />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-fit"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}>
                  <DropdownMenuItem onSelect={() => {
                    setSelectedProject(project); 
                    setEditProjectDialogOpen(true);
                  }}>
                    <Edit2Icon />
                    <span>Edit Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ArrowRightIcon />
                    <span>Share Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" 
                    onSelect={() => {
                      setDeleteProjectDialogOpen(true); 
                      setSelectedProject(project);
                    }}
                  >
                    <Trash2Icon />
                    <span>Delete Project</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      <DeleteDialog
        open={deleteProjectDialogOpen}
        onOpenChange={setDeleteProjectDialogOpen}
        title='Delete Project?'
        description={`Are you sure you want to delete "${selectedProject?.name}"?`}
        handleSubmit={handleDelete}
      />
      <AddProjectDialog
        open={addProjectDialogOpen}
        onOpenChange={setAddProjectDialogOpen}
      />
      <AddProjectDialog
        open={editProjectDialogOpen}
        onOpenChange={setEditProjectDialogOpen}
        project={selectedProject}
      />
    </>
  );
}
