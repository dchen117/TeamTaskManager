import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';
import { MoreHorizontalIcon, Trash2Icon, Edit2Icon } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSortable } from '@dnd-kit/react/sortable';
import { DeleteDialog } from './delete-dialog';
import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useParams } from 'react-router-dom';
import { EditTaskSheet } from './edit-task-sheet';

function TaskCard({ task, statusId, index }) {
    const { ref, isDragging } = useSortable({
        id: task._id,
        index: index,
        type: 'task',
        accept: 'task',
        group: statusId
    });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editTaskOpen, setEditTaskOpen] = useState(false);
    const { projectId } = useParams();
    const { deleteTask } = useTasks(projectId);

    function handleDelete(e) {
        e.preventDefault()
        deleteTask(task._id)
        setDeleteDialogOpen(false)
    }

    return (
        <>
            <Card className="group w-full text-left" ref={ref} data-dragging={isDragging}>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-2">
                        {task.title}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="p-1 rounded hover:bg-muted/50 opacity-0 group-hover:opacity-100">
                                    <MoreHorizontalIcon className="size-6 text-muted-foreground" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="bottom" align="end" className="w-40">
                                <DropdownMenuItem onSelect={() => setEditTaskOpen(true)}>
                                    <Edit2Icon />
                                    <span>Edit Task</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem variant="destructive" onSelect={() => setDeleteDialogOpen(true)}>
                                    <Trash2Icon />
                                    <span>Delete Task</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{task.description}</p>
                </CardContent>
            </Card>
            <DeleteDialog 
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Task?" 
                description="Are you sure you want to remove this task?" 
                handleSubmit={handleDelete} 
            />
            <EditTaskSheet
                open={editTaskOpen}
                onOpenChange={setEditTaskOpen}
                task={task}
            />
        </>
    );
}

export { TaskCard };