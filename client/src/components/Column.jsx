import { TaskCard } from './TaskCard';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MoreHorizontalIcon, PlusIcon, Trash2Icon, Edit2Icon, Delete } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './ui/tooltip';
import { AddTaskDialog } from './add-task-dialog';
import { useSortable } from '@dnd-kit/react/sortable';
import { CollisionPriority } from '@dnd-kit/abstract';
import { useState } from 'react';
import { DeleteDialog } from './delete-dialog';
import { useStatuses } from '@/hooks/useStatuses';
import { useParams } from 'react-router-dom'
import { AddStatusDialog } from './add-status-dialog';

function Column({ status, index, tasks }) {
  const { sourceRef, targetRef, isDragging } = useSortable({
    id: status._id,
    index: index,
    type: 'column',
    accept: ['task', 'column'],
    collisionPriority: CollisionPriority.Low,
  });
  const [ deleteStatusDialogOpen, setDeleteStatusDialogOpen ] = useState(false);
  const [ deleteItemsDialogOpen, setDeleteItemsDialogOpen ] = useState(false);
  const [ editStatusDialogOpen, setEditStatusDialogOpen ] = useState(false);
  const { workspaceId, projectId } = useParams();
  const { deleteStatus } = useStatuses(workspaceId, projectId);
  const style = isDragging ? { outline: '2px solid #3b82f6' } : {};

  function handleDeleteStatus(e) {
    e.preventDefault();
    deleteStatus({ statusId: status._id });
    setDeleteStatusDialogOpen(false);
  }

  function handleDeleteItems(e) {
    e.preventDefault();
    deleteStatus({ statusId: status._id, data: { deleteItemsOnly: true } });
    setDeleteItemsDialogOpen(false);
  }

  return (
    <>
      <Card className="w-80 shrink-0 bg-muted/30 flex flex-col h-full" ref={sourceRef} style={style}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {status.name} <Badge variant="secondary">{tasks.length}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 rounded hover:bg-muted/50">
                    <MoreHorizontalIcon className="size-6 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end" className="w-40">
                  <DropdownMenuItem onSelect={() => setEditStatusDialogOpen(true)}>
                      <Edit2Icon />
                      <span>Edit Column</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem variant="destructive" onSelect={() => setDeleteItemsDialogOpen(true)}>
                      <Trash2Icon />
                      <span>Delete All Tasks</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem variant="destructive" onSelect={() => setDeleteStatusDialogOpen(true)}>
                      <Trash2Icon />
                      <span>Delete Column</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <AddTaskDialog statusId={status._id} order={tasks[0]?.order}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AddTaskDialog.Trigger asChild>
                        <button className="p-1 rounded hover:bg-muted/50">
                          <PlusIcon className="size-6 text-muted-foreground" />
                        </button>
                    </AddTaskDialog.Trigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add Task</p>
                  </TooltipContent>
                </Tooltip>
              </AddTaskDialog>
            </div>
          </CardTitle>
        </CardHeader>
        <ScrollArea className="flex-1 min-h-0">
          <CardContent className="flex flex-col gap-2 py-2" ref={targetRef}>
            {tasks.map((task, index) => (
              <TaskCard key={task._id} task={task} statusId={status._id} index={index} />
            ))}
          </CardContent>
        </ScrollArea>
      </Card>
      <DeleteDialog
        open={deleteStatusDialogOpen}
        onOpenChange={setDeleteStatusDialogOpen}
        title='Delete Status?'
        description={`Are you sure you want to delete the status "${status.name}" along with its associated tasks?`}
        handleSubmit={handleDeleteStatus}
      />
      <DeleteDialog
        open={deleteItemsDialogOpen}
        onOpenChange={setDeleteItemsDialogOpen}
        title='Delete Items?'
        description={`Are you sure you want to delete all items under "${status.name}"?`}
        handleSubmit={handleDeleteItems}
      />
      <AddStatusDialog
        open={editStatusDialogOpen}
        onOpenChange={setEditStatusDialogOpen}
        status={status}
      />
    </>
  );
}

export { Column };