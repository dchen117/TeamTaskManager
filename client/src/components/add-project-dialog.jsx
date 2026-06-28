import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useProjects } from "@/hooks/useProjects"
import { useParams } from "react-router-dom"

export function AddProjectDialog({children}) {
  const [open, setOpen] = useState(false)
  const { workspaceId } = useParams()
  const { createProject } = useProjects(workspaceId)

  async function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())
    createProject({ workspaceId, data })
    setOpen(false)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Add Project</DialogTitle>
            <DialogDescription>
              Create a new project for your workspace.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Project Name</Label>
              <Input id="name-1" name="name" defaultValue="My Project" />
            </Field>
            <Field>
              <Label htmlFor="description-1">
                Project Description
                <span className="text-muted-foreground text-sm">
                  (Optional)
                </span>
              </Label>
              <Input id="description-1" name="description" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
