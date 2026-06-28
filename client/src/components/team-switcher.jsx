"use client"

import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChevronsUpDownIcon, PlusIcon } from "lucide-react"
import { AddWorkspaceDialog } from "@/components/add-workspace-dialog"
import { useWorkspaces } from "@/hooks/useWorkspaces"
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace"
import { GalleryVerticalEndIcon } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"

export function TeamSwitcher() {
  const { isMobile } = useSidebar()
  const { data: workspaces, isLoading } = useWorkspaces()
  const currentWorkspace = useCurrentWorkspace()
  const navigate = useNavigate()
  const { workspaceId } = useParams()
  
  React.useEffect(() => {
    if (workspaces?.length && !workspaceId) {
      navigate(`/home/${workspaces[0]._id}`)
    }
  }, [workspaces, workspaceId, navigate]);

  if (!workspaces || isLoading) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div
                className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {currentWorkspace?.logo || <GalleryVerticalEndIcon className="size-4" />}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium text-base">{currentWorkspace?.name}</span>
                {/* <span className="truncate text-xs">{activeTeam.plan}</span> */}
              </div>
              <ChevronsUpDownIcon className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-fit"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Workspaces
            </DropdownMenuLabel>
            {workspaces.map((workspace, index) => (
              <DropdownMenuItem key={workspace._id} onClick={() => navigate(`/home/${workspace._id}`)} className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md border">
                  {workspace.logo || <GalleryVerticalEndIcon className="size-4" />}
                </div>
                {workspace.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <AddWorkspaceDialog>
              <DropdownMenuItem className="gap-2 p-2" onSelect={(e) => e.preventDefault()}>
                <div
                  className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <PlusIcon className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">Add workspace</div>
              </DropdownMenuItem>
            </AddWorkspaceDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
