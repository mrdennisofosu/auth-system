import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { mockUsers } from "../mock/mockUsers";

// TEMPORARY developer tool, used only to test the auth state before the real
// login page exists. It is deleted in Phase 2/3. It is the only UI that is
// allowed to read mock accounts directly.
function DevSessionPanel() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Runs an action while showing "Working..." and catching service errors
  async function run(action) {
    setBusy(true);
    setErrorMessage("");
    try {
      await action();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4">
      <h2 className="text-lg font-semibold text-amber-900">
        Developer session panel (temporary)
      </h2>
      <p className="mt-1 text-sm text-amber-800">
        Uses mock accounts only. Removed once the real login page exists.
      </p>

      <p className="mt-3 text-sm">
        Current user:{" "}
        <strong>
          {isAuthenticated
            ? `${user.fullName} (${user.role})`
            : "Not signed in"}
        </strong>
      </p>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {mockUsers.map((account) => (
          <button
            key={account.id}
            type="button"
            disabled={busy}
            onClick={() =>
              run(() =>
                login({ email: account.email, password: account.password }),
              )
            }
            className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-left text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
          >
            Sign in as {account.fullName}
            <span className="block text-xs font-normal text-slate-500">
              {account.role}, {account.status}
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={busy || !isAuthenticated}
        onClick={() => run(logout)}
        className="mt-3 min-h-11 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
      >
        Sign out
      </button>

      {busy && <p className="mt-3 text-sm text-slate-600">Working...</p>}
      {errorMessage && (
        <p role="alert" className="mt-3 text-sm font-medium text-red-700">
          {errorMessage}
        </p>
      )}
    </section>
  );
}

export default DevSessionPanel;
