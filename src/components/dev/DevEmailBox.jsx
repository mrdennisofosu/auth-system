import { Link } from "react-router";

// TEMPORARY: stands in for the email a real system would send.
// Deleted when the real backend is connected.
function DevEmailBox({ to, label }) {
  return (
    <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm">
      <p className="font-semibold text-amber-900">
        Simulated email (temporary)
      </p>
      <p className="mt-1 text-amber-800">
        No real email is sent. In the real system, this link would arrive in the
        person&apos;s inbox.
      </p>
      <Link
        to={to}
        className="mt-1 inline-flex min-h-11 items-center font-semibold text-brand-700 hover:underline"
      >
        {label}
      </Link>
    </div>
  );
}

export default DevEmailBox;
