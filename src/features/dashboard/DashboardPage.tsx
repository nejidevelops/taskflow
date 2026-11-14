import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../auth/AuthContext"
import {
  getDashboardData,
  type DashboardData
} from "./dashboardService";

function DashboardPage() {
  const { user, signOut } = useAuth();

  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if(!user) return

    let active = true

    async function loadDashboard() {
      try {
        setLoading(true)
        setError('')

        const result = await getDashboardData(user!.id)

        if(active) {
          setData(result)
        }
      } catch(err) {
        if (active) {
          setError(
            err instanceof Error
            ? err.message
            : 'Failed to load dashboard'
          )
        }

      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [user])

  async function handleLogout() {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading your dashboard...</p>
      </main>
    )
  }

  if (error || !data) {
    return (
      <main className="min-h-screen p-8">
        <p role='alert' className="text-red-600">
          {error || 'Unable to load dashboard.'}
        </p>

        <button
          onClick={() => window.location.reload()}
          className="mt-4 border rouunded-md px-4 py-2"
        >
          Try again
        </button>
      </main>
    )
  }

  const statistics = [
    {
      title: 'Total Projects',
      value: data.totalProjects,
    },
    {
      title: 'Total Tasks',
      value: data.totalTasks,
    },
    {
      title: 'Completed Tasks',
      value: data.completedTasks,
    },
    {
      title: 'Pending Tasks',
      value: data.pendingTasks,
    },
    {
      title: 'In Progress',
      value: data.inProgressTasks,
    },
  ]

  const recentProjects = data.projects.slice(0, 5)
  const recentTasks = data.tasks.slice(0,5)

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold">
            TaskFlow Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Welcome back, {user?.email}
          </p>

          <button onClick={handleLogout} className="rounded-md bg-black text-white px-4 py-2">
            Sign Out
          </button>
        </header>

        <nav className="flex flex-wrap gap-3">
          <Link
            to="/projects"
            className="bg-black text-white rounded-md px-4 py-2"
          >
            Manage projects
          </Link>

          <Link
            to="/tasks"
            className="bg-black text-white rounded-md px-4 py-2"
          >
            Manage tasks
          </Link>
        </nav>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statistics.map((item) => (
            <article
              key={item.title}
              className="bg-white border rounded-lg p-5"
            >
              <p className="text-sm text-gray-500">
                {item.title}
              </p>

              <h2 className='text-3xl font-bold mt-2'>
                {item.value}
              </h2>

            </article>
          ))}
        </section>

        <section className="bg-white rounded-lg border p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              Overall progress
            </h2>

            <span className="font-semibold">
              {data.completionPercentage}%
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-green-600 h-3 rounded-full transition-all"
              style={{
                width: `${data.completionPercentage}%`,
              }}
            />
          </div>

          <p className="text-sm text-gray-500">
            {data.completedTasks} of {data.totalTasks} tasks completed.
          </p>
        </section>

        <section className="bg-white border rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              Recent projects
            </h2>

            <Link
              to="/projects"
              className="text-sm underline"
            >
              View all
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <p className="text-gray-500">
              You haven't created any projects yet.
            </p>
          ) : (
            <div className="divide-y">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="py-4"
                >
                  <h3 className="font-medium">
                    {project.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {project.description || 'No description'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white border rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className='text-lg font-semibold'>
              Recent tasks
            </h2>

            <Link
              to="/tasks"
              className="text-sm underline"
            >
              View all
            </Link>
          </div>

          {recentTasks.length === 0 ? (
            <p className="text-gray-500">
              No tasks available yet
            </p>
          ) : (
            <div className="divide-y">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className='py-4 flex flex-col sm:flex-row sm:justify-between gap-2'
                >
                  <div>
                    <h3 className="font-medium">
                      {task.title}
                    </h3>

                    <p className='text-sm text-gray-500'>
                      {task.description || 'No description'}
                    </p>
                  </div>

                  <span className="text-sm text-gray-600">
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default DashboardPage