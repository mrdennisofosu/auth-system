import { useState } from "react";
import { Link } from "react-router";
import { CircleCheck } from "lucide-react";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Checkbox from "../../components/ui/Checkbox";
import Input from "../../components/ui/Input";
import PasswordInput from "../../components/ui/PasswordInput";
import Spinner from "../../components/ui/Spinner";
import DevAccountsHint from "../../components/dev/DevAccountsHint";
import { ROLES } from "../../constants/roles";
import { ROUTES } from "../../constants/routePaths";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "../../hooks/useForm";
import { compactErrors, validateEmail } from "../../utils/validators";

const initialValues = {
  email: "",
  password: "",
  rememberMe: false,
};

// At login we only check the fields are filled in. We do NOT apply the
// password-strength rules here: those are for choosing a new password.
function validate(values) {
  return compactErrors({
    email: validateEmail(values.email),
    password: values.password ? "" : "Enter your password.",
  });
}

// A friendlier heading for each kind of failure the service can report
const errorTitles = {
  INVALID_CREDENTIALS: "Sign in failed",
  ACCOUNT_DEACTIVATED: "Account deactivated",
};

function Login() {
  const { user, login } = useAuth();
  const form = useForm({ initialValues, validate });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError(null);

    if (!form.validateAll()) return;

    setSubmitting(true);
    try {
      // This is what the backend will receive later
      await login({
        email: form.values.email.trim(),
        password: form.values.password,
        rememberMe: form.values.rememberMe,
      });
      form.reset(); // don't keep the password in memory after signing in
    } catch (error) {
      setSubmitError({
        title: errorTitles[error.code] ?? "Sign in failed",
        message: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  }

  // Signed in (just now, or already before opening this page): success card
  if (user) {
    const dashboardPath =
      user.role === ROLES.ADMIN ? ROUTES.ADMIN.OVERVIEW : ROUTES.USER.DASHBOARD;

    return (
      <div className="mx-auto w-full max-w-md px-4 py-8 sm:py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-100 text-green-600">
            <CircleCheck size={28} aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            You are signed in
          </h1>
          <p className="mt-2 text-slate-600">
            Welcome, <strong className="text-slate-900">{user.fullName}</strong>
            .
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Button to={dashboardPath}>Continue to my dashboard</Button>
            <Button to={ROUTES.HOME} variant="secondary">
              Back to homepage
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-8 sm:py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
        <p className="mt-1 text-slate-600">
          Welcome back. Enter your details to continue.
        </p>

        {submitError && (
          <div className="mt-4">
            <Alert variant="error" title={submitError.title}>
              {submitError.message}
            </Alert>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          <Input
            label="Email address"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="you@example.com"
            value={form.values.email}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.getError("email")}
          />

          <PasswordInput
            label="Password"
            name="password"
            autoComplete="current-password"
            value={form.values.password}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.getError("password")}
          />

          {/* Remember me on the left, Forgot password on the right.
              On very narrow screens they wrap onto two lines. */}
          <div className="flex flex-wrap items-center justify-between gap-x-4">
            <Checkbox
              name="rememberMe"
              label="Remember me"
              checked={form.values.rememberMe}
              onChange={form.handleChange}
            />
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-700 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Spinner light /> Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link
            to={ROUTES.REGISTER}
            className="inline-block py-2 font-semibold text-brand-700 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>

      <DevAccountsHint
        onUse={(email, password) =>
          form.setValues((previous) => ({ ...previous, email, password }))
        }
      />
    </div>
  );
}

export default Login;
