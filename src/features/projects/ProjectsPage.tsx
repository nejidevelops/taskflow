import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

import {
  createProject,
  updateProject,
  getProjects,
  deleteProject,
  type Project
} from './projectService'
import { useAuth } from '../auth/AuthContext';

function ProjectsPage() {
  const { user } = useAuth();

  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return;

    async function loadProjects() {
      try {
        setLoading(true)
        const data = await getProjects(user!.id)
        setProjects(data)
      } catch (error) {
        setError(
          error instanceof Error
          ? error.message
          : 'Failed to load projects.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [user])

  async function handleCreate(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (!user || !name.trim()) return

    try {
      setSaving(true)
      setError('')

      const newProject = await createProject(user.id, {
        name: name.trim(),
        description: description.trim()
      })

      setProjects((current) => [
        newProject,
        ...current,
      ])

      setName('')
      setDescription('')
    } catch (err) {
      setError(
        err instanceof Error
        ? err.message
        : 'Failed to create project'
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleEdit(project: Project) {
    const newName = window.prompt(
      'Enter the new project name:',
      project.name
    )

    if(!newName?.trim() || newName.trim() === project.name) {
      return
    }

    try {
      setError('')

      const updated = await updateProject(project.id, {
        name: newName.trim(),
      })

      setProjects((current) =>
        current.map((item) =>
          item.id === updated.id ? updated : item
        )
      )
    } catch(err) {
      setError(
        err instanceof Error
        ? err.message
        : 'Failed to update project'
      )
    }
  }

  async function handleDelete(projectId: string) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this project?'
    )

    if(!confirmed) return

    try {
      setError('')

      await deleteProject(projectId)

      setProjects((current) =>
        current.filter((project) => project.id !== projectId)
      )
    } catch(err) {
      setError(
        err instanceof Error
        ? err.message
        : 'Failed to delete project.'
      )
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold">
            My Projects
          </h1>

          <p className="text-gray-500 mt-2">
            Manage all your projects in one place.
          </p>
        </header>

        <form
          onSubmit={handleCreate}
          className="border rounded-lg p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold">
            Create a project
          </h2>

          <input
            type="text"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded-md p-3"
          />

          <textarea
            placeholder="Project description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-md p-3"
          />

          <button
            type="submit"
            disabled={saving}
            className="bg-black text-white rounded-md px-5 py-3 disabled:opacity-50"
          >
            {saving ? 'Creating' : 'Create project'}
          </button>
        </form>

        {error && (
          <p role="alert" className="text-red-500">
            {error}
          </p>
        )}

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            Your projects
          </h2>

          {loading ? (
            <p>Loading projects...</p>
          ) : projects.length === 0 ? (
            <p className="text-gray-500">
              You haven't created any projects yet.
            </p>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="border rounded-lg p-5 flex items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="font-semibold">
                      {project.name}
                    </h3>

                    <p className="text-gray-500 text-sm">
                      {project.description || 'No description'}
                    </p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEdit(project)}
                      className="border rounded-md px-3 py-2"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(project.id)}
                      className="border border-red-300 text-red-600 rounded-md px-3 py-2"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}


export default ProjectsPage;