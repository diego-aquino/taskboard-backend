class TasksViews {
  static render(task) {
    const {
      _id: id,
      name,
      priority,
      isCompleted,
      owner,
      createdAt,
      updatedAt,
    } = task;

    const taskView = {
      id,
      name,
      priority,
      isCompleted,
      owner,
      createdAt,
      updatedAt,
    };
    return taskView;
  }

  static renderMany(tasks) {
    return tasks.map(TasksViews.render);
  }
}

export default TasksViews;
