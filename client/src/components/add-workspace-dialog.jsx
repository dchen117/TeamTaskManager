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
import { useWorkspaces } from "@/hooks/useWorkspaces"

export function AddWorkspaceDialog({children}) {
  const [open, setOpen] = useState(false)
  const { createWorkspace } = useWorkspaces()

  async function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())
    createWorkspace(data)
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
            <DialogTitle>Add Workspace</DialogTitle>
            <DialogDescription>
              Create a new workspace for your projects.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Workspace Name</Label>
              <Input id="name-1" name="name" defaultValue="My Workspace" />
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
