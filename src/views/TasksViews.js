class TasksViews {
  static render(task) {
    const { _id: id, name, priority, owner, createdAt, updatedAt } = task;

    const taskView = { id, name, priority, owner, createdAt, updatedAt };
    return taskView;
  }
}

export default TasksViews;
