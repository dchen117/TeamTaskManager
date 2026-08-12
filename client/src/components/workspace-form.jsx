import { useWorkspaces } from "@/hooks/useWorkspaces";
import { AddWorkspaceDialog } from "@/components/add-workspace-dialog";
import { Button } from "./ui/button";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import { WorkspaceList } from "./workspace-list";

export function WorkspaceForm() {
  const { data: workspaces } = useWorkspaces();

  return (
    <div className="flex flex-col gap-6">    
      <AddWorkspaceDialog closeOnSubmit={false}>
          <Button variant="secondary" className="h-16 w-full rounded-xl px-8 text-2xl shadow-md transition hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]">
              <IconCirclePlusFilled className="size-8" />
              Create New Workspace
          </Button>
      </AddWorkspaceDialog>
      <WorkspaceList workspaces={workspaces}/>
    </div>
  )
}