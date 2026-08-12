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
import { generateKeyBetween } from "fractional-indexing"
import { useStatuses } from "@/hooks/useStatuses"
import { useParams } from "react-router-dom"
import { useState } from "react"

export function AddStatusDialog({children, open, onOpenChange, order, status}) {
  const { projectId } = useParams()
  const { createStatus, updateStatus } = useStatuses(projectId)
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
    data.order = generateKeyBetween(order ?? null, null);
    createStatus({ projectId, data })
    setOpen(false)
  }

  async function handleEdit(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())
    updateStatus({ statusId: status._id, data })
    setOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm" onCloseAutoFocus={e => e.preventDefault()}>
        <form onSubmit={status ? handleEdit : handleAdd} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{status ? 'Edit Status' : 'Add Status'}</DialogTitle>
            <DialogDescription>
              {status ? 'Make changes to your status here. ' : 'Create a new status for your project.'}
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue={status?.name} required />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">{status ? 'Save Changes' : 'Create'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}