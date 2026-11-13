import RegisterPage from "./features/auth/RegisterPage";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./features/auth/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import PublicRoute from "./features/auth/PublicRoute";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import DashboardPage from "./features/dashboard/DashboardPage";
import ProjectsPage from "./features/projects/ProjectsPage";

function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/projects"
            element={<ProjectsPage />}
          />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
