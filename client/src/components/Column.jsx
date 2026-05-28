function Column({ status, tasks }) {
  return (
    <div className="column">
      <h2>{status}</h2>

      {tasks.map(task => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
}

export default Column;