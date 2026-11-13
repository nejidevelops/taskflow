import { supabase } from "../../lib/supabase";

export type TaskStatus = "pending" | "in_progress" | "completed";

export interface Task {
  id: string
  project_id: string
  user_id: string
  title: string
  description: string | null
  status: TaskStatus
  due_date: string | null
  created_at: string
}

export interface CreateTaskInput {
  title: string
  description?: string
  due_date?: string
}

export async function getTasks(projectId:string) {
  const { data, error} = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

    if (error) throw error;

    return data as Task[];
}

export async function createTask(
  userId: string,
  projectId: string,
  task: CreateTaskInput
) {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: userId,
      project_id: projectId,
      title: task.title,
      description: task.description || null,
      due_date: task.due_date || null,
      status: 'pending',
    })
    .select()
    .single()

    if (error) throw error

    return data as Task
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus
) {
  const { data, error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', taskId)
    .select()
    .single()

    if (error) throw error

    return data as Task
}

export async function deleteTask(taskId: string) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)

  if (error) throw error
}
