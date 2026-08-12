import { Button } from "./ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { DeleteDialog } from "./delete-dialog";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Input } from "./ui/input";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import { Edit2Icon } from "lucide-react";


export function WorkspaceSettingsSheet({children}) {
  const currentWorkspace = useCurrentWorkspace();
  const { workspaceId } = useParams();
  const { deleteWorkspaceAsync, updateWorkspace } = useWorkspaces();
  const [deleteWorkspaceDialogOpen, setDeleteWorkspaceDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [editName, setEditName] = useState(false);
  const [workspaceName, setWorkspaceName] = useState(currentWorkspace?.name || "");
  const [deletingWorkspace, setDeletingWorkspace] = useState(false);

  useEffect(() => {
    setWorkspaceName(currentWorkspace?.name);
  }, [currentWorkspace]);

  function handleSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.target)
    const button = event.nativeEvent.submitter
    if (button.value === "saveName") {
      updateWorkspace({workspaceId, data: {name: formData.get("workspace-name")}})
      setEditName(false);
    }
  }

  return (
    <>    
        <Sheet open={open} onOpenChange={(open) => {setOpen(open); if (!open) setEditName(false);}}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>

            <SheetContent className="sm:max-w-lg">
                <SheetHeader>
                <SheetTitle>Workspace Settings</SheetTitle>
                <SheetDescription>
                    Manage your workspace settings.
                </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="grid flex-1 auto-rows-min gap-6 px-4">
                    <section>
                        <h3 className="mb-4 text-sm font-medium">
                            General
                        </h3>
                        {/* Input / Select / Switch, etc. */}
                        <div className="flex items-center gap-2">
                            <Input name="workspace-name" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} disabled={!editName} />
                            {!editName &&
                                <Button variant="outline" onClick={() => setEditName(true)}>
                                    <Edit2Icon />
                                </Button>
                            }
                            {editName &&
                                <>
                                    <Button type="submit" name="action" value="saveName">
                                        Save
                                    </Button>
                                    <Button variant="outline" onClick={() => {setWorkspaceName(currentWorkspace?.name || ""); setEditName(false);}}>
                                        Cancel
                                    </Button>
                                </>
                            }
                        </div>
                    </section>
                    <Separator />
                    <section>
                        <h3 className="mb-4 text-sm font-medium">
                            Preferences
                        </h3>

                        {/* More settings */}
                    </section>
                    <Separator />
                    <section>
                        <h3 className="mb-4 text-sm font-medium text-destructive">
                            Danger Zone
                        </h3>
                        <Button variant="destructive" onClick={() => setDeleteWorkspaceDialogOpen(true)}>
                            Delete Workspace
                        </Button>
                    </section>
                </form>
            </SheetContent>
        </Sheet>
        <DeleteDialog
            open={deleteWorkspaceDialogOpen}
            onOpenChange={setDeleteWorkspaceDialogOpen}
            title="Delete Workspace"
            description="Are you sure you want to delete this workspace? This action cannot be undone."
            handleSubmit={async (e) => {
                e.preventDefault();
                setDeletingWorkspace(true)
                await deleteWorkspaceAsync(workspaceId);
            }}
            isLoading={deletingWorkspace}
        />
    </>
  )
}