import { useState } from "react";
import Alert from "../ui/Alert";
import Button from "../ui/Button";
import PasswordInput from "../ui/PasswordInput";
import PasswordStrengthMeter from "../ui/PasswordStrengthMeter";
import Spinner from "../ui/Spinner";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "../../hooks/useForm";
import { useToast } from "../../hooks/useToast";
import { changePassword } from "../../services/authService";
import {
  compactErrors,
  validateConfirmPassword,
  validatePassword,
} from "../../utils/validators";

const initialValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function validate(values) {
  return compactErrors({
    currentPassword: values.currentPassword
      ? ""
      : "Enter your current password.",
    newPassword:
      validatePassword(values.newPassword) ||
      (values.newPassword === values.currentPassword
        ? "Choose a password that is different from your current one."
        : ""),
    confirmPassword: validateConfirmPassword(
      values.confirmPassword,
      values.newPassword,
    ),
  });
}

// Change your own password. Used by the admin AND the user dashboards.
function ChangePasswordForm() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const form = useForm({ initialValues, validate });
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");

    if (!form.validateAll()) return;

    setSaving(true);
    try {
      await changePassword({
        userId: user.id,
        currentPassword: form.values.currentPassword,
        newPassword: form.values.newPassword,
      });
      form.reset();
      showToast({
        type: "success",
        message: "Your password has been changed.",
      });
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {submitError && <Alert variant="error">{submitError}</Alert>}

      <PasswordInput
        label="Current password"
        name="currentPassword"
        autoComplete="current-password"
        value={form.values.currentPassword}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        error={form.getError("currentPassword")}
      />

      <div>
        <PasswordInput
          label="New password"
          name="newPassword"
          autoComplete="new-password"
          value={form.values.newPassword}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.getError("newPassword")}
        />
        <PasswordStrengthMeter password={form.values.newPassword} />
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

      <Button type="submit" disabled={saving}>
        {saving ? (
          <>
            <Spinner light /> Changing...
          </>
        ) : (
          "Change password"
        )}
      </Button>
    </form>
  );
}

export default ChangePasswordForm;
