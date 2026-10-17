import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Alert from "../../components/ui/Alert";
import AuthCard from "../../components/ui/AuthCard";
import Button from "../../components/ui/Button";
import Checkbox from "../../components/ui/Checkbox";
import Input from "../../components/ui/Input";
import PasswordInput from "../../components/ui/PasswordInput";
import PasswordStrengthMeter from "../../components/ui/PasswordStrengthMeter";
import Spinner from "../../components/ui/Spinner";
import { ROUTES } from "../../constants/routePaths";
import { useForm } from "../../hooks/useForm";
import { useToast } from "../../hooks/useToast";
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
  const navigate = useNavigate();
  const { showToast } = useToast();
  const form = useForm({ initialValues, validate });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");

    if (!form.validateAll()) return;

    setSubmitting(true);
    try {
      const result = await register({
        fullName: form.values.fullName.trim(),
        email: form.values.email.trim(),
        password: form.values.password,
      });
      form.reset();
      showToast({
        type: "success",
        message: "Account created. Please verify your email.",
      });

      // Send them to the "check your inbox" page, passing the email along
      navigate(ROUTES.VERIFY_EMAIL, {
        state: { email: result.email, devToken: result.devVerificationToken },
      });
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthCard>
      <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
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
    </AuthCard>
  );
}

export default Register;
