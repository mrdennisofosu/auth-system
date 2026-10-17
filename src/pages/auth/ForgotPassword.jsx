import { useState } from "react";
import { Mail } from "lucide-react";
import Alert from "../../components/ui/Alert";
import AuthCard from "../../components/ui/AuthCard";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";
import StatusIcon from "../../components/ui/StatusIcon";
import DevEmailBox from "../../components/dev/DevEmailBox";
import { ROUTES } from "../../constants/routePaths";
import { useForm } from "../../hooks/useForm";
import { requestPasswordReset } from "../../services/authService";
import { compactErrors, validateEmail } from "../../utils/validators";

const initialValues = { email: "" };

function validate(values) {
  return compactErrors({ email: validateEmail(values.email) });
}

function ForgotPassword() {
  const form = useForm({ initialValues, validate });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [sent, setSent] = useState(null); // { email, devToken } once the request is made

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");

    if (!form.validateAll()) return;

    setSubmitting(true);
    try {
      const email = form.values.email.trim();
      const result = await requestPasswordReset({ email });
      setSent({ email, devToken: result.devResetToken });
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  // Confirmation screen. Same message whether or not the account exists.
  if (sent) {
    return (
      <AuthCard>
        <div className="text-center">
          <StatusIcon icon={Mail} tone="brand" />
          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Check your email
          </h1>
          <p className="mt-2 text-slate-600">
            If an account exists for{" "}
            <strong className="break-all text-slate-900">{sent.email}</strong>,
            we have sent a link to reset your password.
          </p>
        </div>

        {sent.devToken && (
          <DevEmailBox
            to={`${ROUTES.RESET_PASSWORD}?token=${sent.devToken}`}
            label="Open password reset link"
          />
        )}

        <div className="mt-6 flex flex-col gap-3">
          <Button to={ROUTES.LOGIN}>Back to Sign In</Button>
          <Button
            variant="secondary"
            onClick={() => {
              form.reset();
              setSent(null);
            }}
          >
            Use a different email
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <h1 className="text-2xl font-bold text-slate-900">
        Forgot your password?
      </h1>
      <p className="mt-1 text-slate-600">
        Enter your email address and we will send you a link to reset it.
      </p>

      {submitError && (
        <div className="mt-4">
          <Alert variant="error">{submitError}</Alert>
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

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? (
            <>
              <Spinner light /> Sending...
            </>
          ) : (
            "Send reset link"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm">
        <Button to={ROUTES.LOGIN} variant="secondary" className="w-full">
          Back to Sign In
        </Button>
      </p>
    </AuthCard>
  );
}

export default ForgotPassword;
