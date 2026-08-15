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
import { Textarea } from "@/components/ui/textarea"
import { useProjects } from "@/hooks/useProjects"
import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"

export function AddProjectDialog({children, open, onOpenChange, project}) {
  const { workspaceId } = useParams()
  const { createProject, updateProject } = useProjects(workspaceId)
  const navigate = useNavigate();
  const [ internalOpen, setInternalOpen ] = useState(false)
  const isOpen = open ? open : internalOpen
  const setOpen = (nextOpen) => {
    if (!open) {
      setInternalOpen(nextOpen)
    }
    onOpenChange?.(nextOpen)
  }

  async function handleAdd(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())
    createProject(data, {
      onSuccess: data => {
        navigate(`/home/${workspaceId}/${data.project._id}`)
      }
    })
    setOpen(false)
  }

  async function handleEdit(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())
    updateProject({ projectId: project._id, data })
    setOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={project ? handleEdit : handleAdd} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{project ? 'Edit Project' : 'Add Project'}</DialogTitle>
            <DialogDescription>
              {project ? 'Make changes to your project here.' : 'Create a new project for your workspace.'}
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Project Name</Label>
              <Input id="name-1" name="name" defaultValue={project ? project.name : "My Project"} required/>
            </Field>
            <Field>
              <Label htmlFor="description-1">
                Project Description
                <span className="text-muted-foreground text-sm">
                  (Optional)
                </span>
              </Label>
              <Textarea id="description-1" name="description" defaultValue={project?.description}/>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">{project ? "Save Changes" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
