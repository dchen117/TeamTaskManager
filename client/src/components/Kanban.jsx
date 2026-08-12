import { useTasks } from '@/hooks/useTasks';
import { useParams } from 'react-router-dom';
import { Column } from './Column';
import { Button } from './ui/button';
import { PlusIcon } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from './ui/tooltip';
import { useStatuses } from "@/hooks/useStatuses"
import { DragDropProvider } from '@dnd-kit/react';
import { useRef, useState, useEffect, useMemo } from 'react';
import { move } from '@dnd-kit/helpers'
import { generateKeyBetween } from 'fractional-indexing';
import { AddStatusDialog } from './add-status-dialog';

function Kanban() {
    const { projectId } = useParams();
    const { data: tasks, updateTask } = useTasks(projectId);
    const { data: statuses, updateStatus } = useStatuses(projectId);
    const sourceParentRef = useRef(null);

    const isDragging = useRef(false);
    const startSource = useRef({});

    const grouped = useMemo(() => {
        const groups = {};
        for (const status of statuses ?? []) {
            groups[status._id] = [];
        }
        for (const task of tasks ?? []) {
            groups[task.statusId]?.push(task);
        }
        return groups;
    }, [tasks, statuses]);

    const [ items, setItems ] = useState(grouped ?? []);
    const [ columnOrder, setColumnOrder ] = useState(statuses ?? []);
    const [ addStatusOpen, setAddStatusOpen ] = useState(false);

    useEffect(() => {
        if (grouped && !isDragging.current) {
            setItems(grouped);
        }
    }, [grouped]);

    useEffect(() => {
        if (statuses && !isDragging.current) {
            setColumnOrder(statuses);
        }
    }, [statuses]);

    function handleDragStart(event) {
        isDragging.current = true;
        sourceParentRef.current = event.operation.source?.element?.parentElement ?? null;
        const { group, index } = event.operation.source;
        startSource.current = { group, index };
    }

    function handleDragOver(event) {
        const { type } = event.operation.source;
        setItems((items) =>move(items, event));
        if (type === 'column') {
            setColumnOrder(columnOrder => move(columnOrder, event));
            return;
        }
    }
    
    function handleDragEnd(event) {
        if (event.canceled) return;
        isDragging.current = false;
        const endGroup = event.operation.source.group;
        const { id: sourceId, index, type } = event.operation.source;
        const { group: initialGroup, index: initialIndex } = startSource.current;
        if (type === 'column' && index !== initialIndex) {
            const newOrder = generateKeyBetween(
                columnOrder[index-1]?.order ?? null,
                columnOrder[index+1]?.order ?? null
            )
            updateStatus({
                projectId: projectId,
                statusId: sourceId,
                data: {
                    order: newOrder
                }
            })
            return;
        }
        if (endGroup !== initialGroup || index !== initialIndex) {
            const newOrder = generateKeyBetween(
                items[endGroup][index-1]?.order ?? null,
                items[endGroup][index+1]?.order ?? null
            )
            updateTask({
                taskId: sourceId,
                data: {
                    statusId: endGroup,
                    order: newOrder
                }
            });
        }
    }

    if (!projectId) return null;

    return (
        <DragDropProvider onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
            <div className="h-full flex overflow-x-auto gap-2 p-4">
                {columnOrder?.map((column, index) => (
                    <Column key={column._id} status={column} index={index} tasks={items[column._id] ?? []}/>
                ))}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button className="bg-accent/60 p-1 rounded hover:bg-accent" onClick={() => setAddStatusOpen(true)}>
                            <PlusIcon className="size-6 text-muted-foreground" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Add Column</p>
                    </TooltipContent>
                </Tooltip>
                <AddStatusDialog
                    open={addStatusOpen}
                    onOpenChange={setAddStatusOpen}
                    order={columnOrder[columnOrder.length-1]?.order}
                />
            </div>
        </DragDropProvider>
    )
}

export { Kanban };