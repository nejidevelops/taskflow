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
  const { user } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    async function loadProjects() {
      try {
        const data = await getProjects(user!.id);

        setProjects(data);

        if (data.length > 0) {
          setSelectedProjectId(data[0].id);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load projects",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, [user]);

  useEffect(() => {
    if (!selectedProjectId) {
      setTasks([]);
      return;
    }

    async function loadTasks() {
      try {
        setLoading(true);
        setError("");

        const data = await getTasks(selectedProjectId);

        setTasks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, [selectedProjectId]);

  async function handleCreateTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user || !selectedProjectId || !title.trim()) return;

    try {
      setSaving(true);
      setError("");

      const newTask = await createTask(
        user.id,
        selectedProjectId,
        {
          title: title.trim(),
          description: description.trim(),
          due_date: dueDate,
        }
      );

      setTasks((current) => [newTask, ...current])

      setTitle('')
      setDescription('')
      setDueDate('')
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateTask(
    taskId: string,
    status: TaskStatus
  ) {
    try {
      setError('')

      const updated = await updateTaskStatus(taskId, status)

      setTasks((current) => 
        current.map((task) =>
          task.id === updated.id ? updated : task
        )
      )
    } catch (err) {
      setError(
        err instanceof Error
        ? err.message
        : "Failed to update task"
      )
    }
  }

  async function handleStatusChange(
    taskId: string,
    status: TaskStatus
  ) {
    try {
      setError('')

      const updated = await updateTaskStatus(taskId, status)

      setTasks((current) =>
        current.map((task) =>
          task.id === updated.id ? updated : task
        )
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update task.'
      )
    }
  }

  async function handleDeleteTask(taskId: string) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this task?'
    )

    if(!confirmed) return

    
    try {
      setError('')
      await deleteTask(taskId)
  
    setTasks((current) => 
      current.filter((task) => task.id !== taskId)
    )
    } catch(err) {
      setError(
        err instanceof Error
        ? err.message
        : 'Failed to delete task  '
      )
    }
  }

  return (
     <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">

        <header>
          <h1 className="text-3xl font-bold">
            Task Management
          </h1>

          <p className="text-gray-500 mt-2">
            Organize and track your project tasks.
          </p>
        </header>

        {error && (
          <p role="alert" className="text-red-600">
            {error}
          </p>
        )}

        {loading && projects.length === 0 ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p>
            You don't have any projects yet.
            Create a project before adding tasks.
          </p>
        ) : (
          <>
            {/* Project selector */}
            <section className="space-y-2">
              <label
                htmlFor="project"
                className="font-medium"
              >
                Select project
              </label>

              <select
                id="project"
                value={selectedProjectId}
                onChange={(event) =>
                  setSelectedProjectId(event.target.value)
                }
                className="w-full border rounded-md p-3"
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </section>

            {/* Create task form */}
            <form
              onSubmit={handleCreateTask}
              className="border rounded-lg p-6 space-y-4"
            >
              <h2 className="text-xl font-semibold">
                Create a task
              </h2>

              <input
                type="text"
                placeholder="Task title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                className="w-full border rounded-md p-3"
              />

              <textarea
                placeholder="Task description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                className="w-full border rounded-md p-3"
              />

              <input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="w-full border rounded-md p-3"
              />

              <button
                type="submit"
                disabled={saving || !selectedProjectId}
                className="bg-black text-white rounded-md px-5 py-3 disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Create task'}
              </button>
            </form>

            {/* Task list */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                Project tasks
              </h2>

              {loading ? (
                <p>Loading tasks...</p>
              ) : tasks.length === 0 ? (
                <p className="text-gray-500">
                  No tasks in this project yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <article
                      key={task.id}
                      className="border rounded-lg p-5 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold">
                            {task.title}
                          </h3>

                          <p className="text-gray-500 text-sm mt-1">
                            {task.description || 'No description'}
                          </p>

                          {task.due_date && (
                            <p className="text-sm mt-2">
                              Due: {task.due_date}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-600 text-sm"
                        >
                          Delete
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <label
                          htmlFor={`status-${task.id}`}
                          className="text-sm font-medium"
                        >
                          Status
                        </label>

                        <select
                          id={`status-${task.id}`}
                          value={task.status}
                          onChange={(event) =>
                            handleStatusChange(
                              task.id,
                              event.target.value as TaskStatus
                            )
                          }
                          className="border rounded-md p-2 text-sm"
                        >
                          <option value="pending">
                            Pending
                          </option>

                          <option value="in_progress">
                            In progress
                          </option>

                          <option value="completed">
                            Completed
                          </option>
                        </select>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  )
}

export default TasksPage;
