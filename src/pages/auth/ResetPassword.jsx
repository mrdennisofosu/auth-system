import { useCallback, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { CircleCheck, TriangleAlert } from "lucide-react";
import Alert from "../../components/ui/Alert";
import AuthCard from "../../components/ui/AuthCard";
import Button from "../../components/ui/Button";
import PasswordInput from "../../components/ui/PasswordInput";
import PasswordStrengthMeter from "../../components/ui/PasswordStrengthMeter";
import Spinner from "../../components/ui/Spinner";
import StatusIcon from "../../components/ui/StatusIcon";
import { ROUTES } from "../../constants/routePaths";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useForm } from "../../hooks/useForm";
import { useToast } from "../../hooks/useToast";
import { resetPassword, validateResetToken } from "../../services/authService";
import {
  compactErrors,
  validateConfirmPassword,
  validatePassword,
} from "../../utils/validators";

const initialValues = { password: "", confirmPassword: "" };

function validate(values) {
  return compactErrors({
    password: validatePassword(values.password),
    confirmPassword: validateConfirmPassword(
      values.confirmPassword,
      values.password,
    ),
  });
}

// Shown when the link is missing, expired or fake
function InvalidLink({ title, message }) {
  return (
    <div className="text-center">
      <StatusIcon icon={TriangleAlert} tone="amber" />
      <h1 className="mt-4 text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 text-slate-600">{message}</p>
      <Button to={ROUTES.FORGOT_PASSWORD} className="mt-6 w-full">
        Request a new link
      </Button>
      <Link
        to={ROUTES.LOGIN}
        className="mt-3 inline-block py-2 text-sm font-semibold text-brand-700 hover:underline"
      >
        Back to Sign In
      </Link>
    </div>
  );
}

// The "choose a new password" form
function ResetForm({ token }) {
  const { showToast } = useToast();
  const form = useForm({ initialValues, validate });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");

    if (!form.validateAll()) return;

    setSubmitting(true);
    try {
      await resetPassword({ token, password: form.values.password });
      form.reset();
      setDone(true);
      showToast({
        type: "success",
        message: "Your password has been updated.",
      });
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="text-center">
        <StatusIcon icon={CircleCheck} tone="green" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Password updated
        </h1>
        <p className="mt-2 text-slate-600">
          You can now sign in with your new password.
        </p>
        <Button to={ROUTES.LOGIN} className="mt-6 w-full">
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900">
        Choose a new password
      </h1>
      <p className="mt-1 text-slate-600">
        Pick a strong password you have not used before.
      </p>

      {submitError && (
        <div className="mt-4">
          <Alert variant="error">
            {submitError}{" "}
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="font-semibold underline"
            >
              Request a new link
            </Link>
          </Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <div>
          <PasswordInput
            label="New password"
            name="password"
            autoComplete="new-password"
            value={form.values.password}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.getError("password")}
          />
          <PasswordStrengthMeter password={form.values.password} />
        </div>

        <PasswordInput
          label="Confirm new password"
          name="confirmPassword"
          autoComplete="new-password"
          value={form.values.confirmPassword}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.getError("confirmPassword")}
        />

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? (
            <>
              <Spinner light /> Updating...
            </>
          ) : (
            "Update password"
          )}
        </Button>
      </form>
    </>
  );
}

// Checks the link first, then shows the form (or the problem)
function TokenCheck({ token }) {
  const check = useCallback(() => validateResetToken(token), [token]);
  const { loading, error } = useAsyncData(check);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-8 text-slate-600">
        <Spinner /> Checking your reset link...
      </div>
    );
  }

  if (error) {
    return (
      <InvalidLink
        title={
          error.code === "TOKEN_EXPIRED"
            ? "This link has expired"
            : "This link is not valid"
        }
        message={`${error.message} Request a new one to continue.`}
      />
    );
  }

  return <ResetForm token={token} />;
}

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  return (
    <AuthCard>
      {token ? (
        <TokenCheck key={token} token={token} />
      ) : (
        <InvalidLink
          title="This link is incomplete"
          message="Open the link from your email, or request a new one."
        />
      )}
    </AuthCard>
  );
}

export default ResetPassword;
