import { useAuth } from "../auth/AuthContext"

function DashboardPage() {
  const { user, signOut } = useAuth();

  async function handleLogout() {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed', error)
    }
  }
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            TaskFlow Dashboard
          </h1>

          <button onClick={handleLogout} className="rounded-md bg-black text-white px-4 py-2">
            Sign Out
          </button>
        </header>

        <section className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold">
            Welcome back!
          </h2>

          <p className="text-gray-600 mt-2">
            Logged in as: {user?.email}
          </p>
        </section>
      </div>
    </main>
  )
}

export default DashboardPage