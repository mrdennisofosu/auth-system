import AuthProvider from "./context/AuthProvider";
import ToastProvider from "./context/ToastProvider";
import AppRoutes from "./routes/AppRoutes";

function App() {
  // Providers wrap everything, so every page can show toasts and read who is signed in.
  return (
    <ToastProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
