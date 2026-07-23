import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';
import { MoreHorizontalIcon } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSortable } from '@dnd-kit/react/sortable';

function TaskCard({ task, column, index }) {
    const { ref, isDragging } = useSortable({
        id: task._id,
        index: index,
        type: 'task',
        accept: 'task',
        group: column
    });

    return (
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
                            <DropdownMenuItem>Edit Task</DropdownMenuItem>
                            <DropdownMenuItem>Delete Task</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p>{task.description}</p>
            </CardContent>
        </Card>
    );
}

export { TaskCard };