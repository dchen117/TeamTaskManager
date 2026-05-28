import {useState, useEffect} from 'react';

function Kanban({ projectId }) {
    const [tasks, setTasks] = useState([]);
    useEffect(() => {
        fetch(`/projects/${projectId}/tasks`)
            .then(response => response.json())
            .then(data => setTasks(data));
    }, [projectId])

    const columns = Object.groupBy(tasks, task => task.status);
    return (
        <div className="board">
            {Object.entries(columns).map(([status, tasks]) => (
                <Column key={status} status={status} tasks={tasks}/>
            ))}
        </div>
    )
}

export default Kanban;