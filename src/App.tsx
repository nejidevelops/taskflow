import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import RegisterPage from "./features/auth/RegisterPage";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./features/auth/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const [status, setStatus] = useState("Checking connection....");

  useEffect(() => {
    async function checkConnection() {
      const { error } = await supabase.from("projects").select("id").limit(1);

      if (error) {
        setStatus(`Connection error: ${error.message}`);
        return;
      }

      setStatus("Supabase connected successfully!");
    }

    checkConnection();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
