import { TaskCard } from './TaskCard';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MoreHorizontalIcon, PlusIcon } from 'lucide-react';
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
import { CollisionPriority } from '@dnd-kit/abstract'

function Column({ statusId, index, status, tasks }) {
  const { sourceRef, targetRef, isDragging } = useSortable({
    id: statusId,
    index: index,
    type: 'column',
    accept: ['task', 'column'],
    collisionPriority: CollisionPriority.Low,
  });

  const style = isDragging ? { outline: '2px solid #3b82f6' } : {};

  return (
    <Card className="w-80 shrink-0 bg-muted/30 flex flex-col h-full" ref={sourceRef} style={style}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {status} <Badge variant="secondary">{tasks.length}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded hover:bg-muted/50">
                  <MoreHorizontalIcon className="size-6 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end" className="w-40">
                <DropdownMenuItem>Edit Column</DropdownMenuItem>
                <DropdownMenuItem>Delete Column</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <AddTaskDialog statusId={statusId} order={tasks[0]?.order}>
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
            <TaskCard key={task._id} task={task} column={statusId} index={index} />
          ))}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

export { Column };