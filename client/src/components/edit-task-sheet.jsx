import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useTasks } from "@/hooks/useTasks"
import { useParams } from "react-router-dom"

export function EditTaskSheet({ open, onOpenChange, task }) {
  const { workspaceId, projectId } = useParams();
  const { updateTask } = useTasks(workspaceId, projectId);
  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    updateTask({ taskId: task._id, data});
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Task</SheetTitle>
          <SheetDescription>
            Make changes to your task here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} id="edit-task-form">
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
              <div className="grid gap-3">
                  <Label htmlFor="task-sheet-title">Title</Label>
                  <Input id="task-sheet-title" name="title" defaultValue={task?.title}/>
              </div>
              <div className="grid gap-3">
                  <Label htmlFor="task-sheet-description">Description</Label>
                  <Textarea id="task-sheet-description" name="description" defaultValue={task?.description}/>
              </div>
            </div>
        </form>
        <SheetFooter>
          <Button type="submit" form="edit-task-form">Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
