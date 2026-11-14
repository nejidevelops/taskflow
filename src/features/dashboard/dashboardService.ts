import { supabase } from "../../lib/supabase";

import type { Project } from "../projects/projectService";
import type { Task } from "../tasks/taskService";

export interface DashboardData {
  projects: Project[]
  tasks: Task[]
  totalProjects: number
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  inProgressTasks: number
  completionPercentage: number
}

export async function getDashboardData(
  userId: string
): Promise<DashboardData> {
  const { data: projects, error: projectError } =  await supabase
  .from('projects')
  .select("*")
  .eq("user_id", userId)
  .order("created_at", { ascending: false })

  if(projectError) {
    throw projectError
  }

  const { data: tasks, error: taskError } = await supabase
  .from('tasks')
  .select('*')
  .eq('user_id', userId)
  .order("created_at", { ascending: false })

  if (taskError) {
    throw taskError
  }

  const projectList = (projects ?? []) as Project[]
  const taskList = (tasks ?? []) as Task[]  

  const totalTasks = taskList.length

  const completedTasks = taskList.filter(
    (task) => task.status === 'completed'
  ).length

  const pendingTasks = taskList.filter(
    (task) => task.status === 'pending'
  ).length

  const inProgressTasks = taskList.filter(
    (task) => task.status === 'in_progress'
  ).length

  const completionPercentage =
    totalTasks === 0
    ? 0
    : Math.round((completedTasks / totalTasks) * 100)

  return {
    projects: projectList,
    tasks: taskList,
    totalProjects: projectList.length,
    totalTasks,
    completedTasks,
    pendingTasks,
    inProgressTasks,
    completionPercentage,
  }
}