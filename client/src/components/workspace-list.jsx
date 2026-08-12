import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowRight, GalleryVerticalEndIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useSwitchWorkspace } from "@/hooks/useSwitchWorkspace"

export function WorkspaceList({workspaces}) {
  const switchWorkspace = useSwitchWorkspace();
  return (
    <div className="border overflow-hidden rounded-2xl">
      <h1 className="flex items-center h-10 px-6 text-left font-semibold bg-muted"> Workspaces </h1>    
      <ScrollArea className="h-80">
        {workspaces?.length === 0 && (  
          <div className="flex h-80 items-center justify-center">
            <p className="text-muted-foreground w-60">
              You haven&apos;t created any workspaces yet. Get started by creating
              your first workspace.
            </p>
          </div>
        )}
        {workspaces?.map((workspace) => (
          <div key={workspace._id}>
            <Separator/>
            <Button
              key={workspace.id}
              variant="ghost"
              onClick={() => {switchWorkspace(workspace._id)}}
              className="h-20 w-full justify-start gap-4 rounded-none px-6 text-left text-xl font-semibold hover:bg-accent"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <GalleryVerticalEndIcon className="size-6" />
              </span>

              <span className="flex-1 truncate">
                {workspace.name}
              </span>

              <ArrowRight className="size-6 shrink-0 text-muted-foreground" />
            </Button>
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}