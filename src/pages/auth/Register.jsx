import { useState } from "react";
import { Link } from "react-router";
import { CircleCheck } from "lucide-react";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Checkbox from "../../components/ui/Checkbox";
import Input from "../../components/ui/Input";
import PasswordInput from "../../components/ui/PasswordInput";
import PasswordStrengthMeter from "../../components/ui/PasswordStrengthMeter";
import Spinner from "../../components/ui/Spinner";
import { ROUTES } from "../../constants/routePaths";
import { useForm } from "../../hooks/useForm";
import { register } from "../../services/authService";
import {
  compactErrors,
  validateConfirmPassword,
  validateEmail,
  validateFullName,
  validatePassword,
  validateTerms,
} from "../../utils/validators";

const initialValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

// Runs every rule and returns { field: message } for the fields that fail.
function validate(values) {
  return compactErrors({
    fullName: validateFullName(values.fullName),
    email: validateEmail(values.email),
    password: validatePassword(values.password),
    confirmPassword: validateConfirmPassword(
      values.confirmPassword,
      values.password,
    ),
    acceptTerms: validateTerms(values.acceptTerms),
  });
}

function Register() {
  const form = useForm({ initialValues, validate });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");

    // Stop here (and show every error) if the form is not valid
    if (!form.validateAll()) return;

    setSubmitting(true);
    try {
      // This is exactly what the backend will receive later
      const result = await register({
        fullName: form.values.fullName.trim(),
        email: form.values.email.trim(),
        password: form.values.password,
      });
      setRegisteredEmail(result.email);
      form.reset();
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  // Success screen replaces the form
  if (registeredEmail) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-8 sm:py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-100 text-green-600">
            <CircleCheck size={28} aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Account created
          </h1>
          <p className="mt-2 text-slate-600">
            We have sent a verification link to{" "}
            <strong className="break-all text-slate-900">
              {registeredEmail}
            </strong>
            . Please check your inbox.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            (Simulated: no real email is sent and no account is saved yet.)
          </p>
          <Button to={ROUTES.LOGIN} className="mt-6 w-full">
            Go to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-8 sm:py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Create your account
        </h1>
        <p className="mt-1 text-slate-600">It only takes a minute.</p>

        {submitError && (
          <div className="mt-4">
            <Alert variant="error" title="We could not create your account">
              {submitError}
            </Alert>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          <Input
            label="Full name"
            name="fullName"
            autoComplete="name"
            autoCapitalize="words"
            placeholder="e.g. Ama Mensah"
            value={form.values.fullName}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.getError("fullName")}
          />

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

          <div>
            <PasswordInput
              label="Password"
              name="password"
              autoComplete="new-password"
              value={form.values.password}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.getError("password")}
              hint={
                form.values.password
                  ? undefined
                  : "Use at least 8 characters, with upper and lower case letters and a number."
              }
            />
            <PasswordStrengthMeter password={form.values.password} />
          </div>

          <PasswordInput
            label="Confirm password"
            name="confirmPassword"
            autoComplete="new-password"
            value={form.values.confirmPassword}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.getError("confirmPassword")}
          />

          <Checkbox
            name="acceptTerms"
            label="I agree to the Terms and Conditions"
            checked={form.values.acceptTerms}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.getError("acceptTerms")}
          />

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Spinner light /> Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to={ROUTES.LOGIN}
            className="inline-block py-2 font-semibold text-brand-700 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
