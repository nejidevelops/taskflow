import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";

import { getProjects, type Project } from "../projects/projectService";

import {
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
  type Task,
  type TaskStatus,
} from "./taskService";

function TasksPage() {
  const { user } = useAuth()

  
  return <div>TasksPage</div>;
}

export default TasksPage;
