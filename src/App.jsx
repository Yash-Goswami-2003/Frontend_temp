import SignUp from "./pages/signup/signUp";
import Login from "./pages/login/login";
import Dashboard from "./pages/dashboard/dashboard";
import VisualBuilder from "./pages/visualBuilder";
import { isAuthenticated } from "./utils/api";

export default function App() {
  const path = window.location.pathname;
  const hasToken = isAuthenticated();

  if (path === "/visual-builder") {
    return <VisualBuilder />;
  }

  if (path === "/dashboard") {
    if (!hasToken) {
      window.location.href = "/login";
      return null;
    }
    return <Dashboard />;
  }

  if (path === "/login") {
    if (hasToken) {
      window.location.href = "/dashboard";
      return null;
    }
    return <Login />;
  }

  if (hasToken) {
    window.location.href = "/dashboard";
    return null;
  }

  return <SignUp />;
}