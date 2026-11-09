import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

function App() {
  const [status, setStatus] = useState('Checking connection....')

  useEffect(() => {
    async function checkConnection() {
      const { error } = await supabase
      .from('projects')
      .select('id')
      .limit(1)

      if (error) {
        setStatus(`Connection error: ${error.message}`)
        return
      }

      setStatus('Supabase connected successfully!')
    }

    checkConnection()
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">TaskFlow</h1>
        <p className="mt-4">{status}</p>
      </div>
    </main>
  )

}

export default App;