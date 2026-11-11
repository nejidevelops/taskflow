import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import RegisterPage from "./features/auth/RegisterPage";

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
    <>
      <RegisterPage />
    </>
  )

}

export default App;