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
import { useState } from "react"
import { useTasks } from "@/hooks/useTasks"
import { useParams } from "react-router-dom"
import { generateKeyBetween } from "fractional-indexing"

export function AddTaskDialog({children, open, onOpenChange, statusId, order}) {
  const { projectId } = useParams()
  const { createTask } = useTasks(projectId)
  const [ internalOpen, setInternalOpen ] = useState(false)
  const isOpen = open ? open : internalOpen
  const setOpen = (nextOpen) => {
    if (!open) {
      setInternalOpen(nextOpen)
    }
    onOpenChange?.(nextOpen)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())
    data.statusId = statusId
    data.order = generateKeyBetween(null, order ?? null);
    createTask({ projectId, data })
    setOpen(false)
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
        {children}
      <DialogContent className="sm:max-w-sm" onCloseAutoFocus={e => e.preventDefault()}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
            <DialogDescription>
              Create a new task for your project.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="title-1">Title</Label>
              <Input id="title-1" name="title" />
            </Field>
            <Field>
              <Label htmlFor="description-1">
                Task Description
                <span className="text-muted-foreground text-sm">
                  (Optional)
                </span>
              </Label>
              <Textarea id="description-1" name="description" />
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

AddTaskDialog.Trigger = DialogTrigger