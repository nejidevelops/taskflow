import { supabase } from "../../lib/supabase";

export interface Project{
  id: string
  user_id: string
  name: string
  description: string | null
  created_at: string
}

export interface CreateProjectInput {
  name: string
  description?: string
}

export async function getProjects(userId: string) {
  const { data, error } = await supabase
  .from('projects')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false})

  if (error) {
    throw error
  }

  return data as Project[]
}

export async function createProject(
  userId: string,
  project: CreateProjectInput
) {
  const { data, error } = await supabase
  .from('projects')
  .insert({
    user_id: userId,
    name: project.name,
    description: project.description ?? null,
  })
  .select()
  .single()

  if (error) {
    throw error
  }

  return data as Project
}

export async function updateProject(
  projectId: string,
  updates: Partial<CreateProjectInput>
) {
  const { data, error } = await supabase
  .from('projects')
  .update(updates)
  .eq('id', projectId)
  .select()
  .single()

  if(error) {
    throw error
  }

  return data as Project
}

export async function deleteProject(
  projectId: string
) {
  const { error } = await supabase
  .from('projects')
  .delete()
  .eq('id', projectId)

  if (error) {
    throw error
  }
}