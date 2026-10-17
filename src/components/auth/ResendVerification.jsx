import { useState } from "react";
import Alert from "../ui/Alert";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Spinner from "../ui/Spinner";
import { useCountdown } from "../../hooks/useCountdown";
import { resendVerificationEmail } from "../../services/authService";
import { validateEmail } from "../../utils/validators";

const RESEND_COOLDOWN_SECONDS = 30;

// "Resend verification email" with feedback.
//   email given  -> just a button (we already know where to send it)
//   no email     -> a small email field first
function ResendVerification({ email: knownEmail = "" }) {
  const [email, setEmail] = useState(knownEmail);
  const [emailError, setEmailError] = useState("");
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null); // { variant, message }
  const { secondsLeft, start } = useCountdown();

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback(null);

    const problem = validateEmail(email);
    if (problem) {
      setEmailError(problem);
      return;
    }
    setEmailError("");

    setSending(true);
    try {
      const result = await resendVerificationEmail({ email });
      setFeedback({
        variant: "success",
        message: `${result.message} (Simulated: no real email is sent.)`,
      });
      start(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      setFeedback({
        variant: error.code === "ALREADY_VERIFIED" ? "info" : "error",
        message: error.message,
      });
    } finally {
      setSending(false);
    }
  }

  const waiting = secondsLeft > 0;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {knownEmail ? (
        <p className="text-sm text-slate-600">
          Didn&apos;t get the email? We can send it again to{" "}
          <strong className="break-all text-slate-900">{knownEmail}</strong>.
        </p>
      ) : (
        <Input
          label="Email address"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={emailError}
        />
      )}

      {feedback && <Alert variant={feedback.variant}>{feedback.message}</Alert>}

      <Button
        type="submit"
        variant="secondary"
        className="w-full"
        disabled={sending || waiting}
      >
        {sending ? (
          <>
            <Spinner /> Sending...
          </>
        ) : waiting ? (
          `Resend available in ${secondsLeft}s`
        ) : (
          "Resend verification email"
        )}
      </Button>
    </form>
  );
}

export default ResendVerification;
