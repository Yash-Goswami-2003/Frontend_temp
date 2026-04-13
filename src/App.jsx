import SignUp from "./pages/signup/signUp";
import VisualBuilder from "./pages/visualBuilder";

export default function App() {
  // Check URL for visual-builder route
  const path = window.location.pathname;
  
  if (path === "/visual-builder") {
    return <VisualBuilder />;
  }
  
  return <SignUp />;
}