import AuthProvider from "./context/AuthProvider";
import AppRoutes from "./routes/AppRoutes";

function App() {
  // AuthProvider wraps everything, so every page and layout
  // can read who is signed in.
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
