import { useCallback } from "react";
import { Link, useLocation, useSearchParams } from "react-router";
import { CircleCheck, Mail, TriangleAlert } from "lucide-react";
import AuthCard from "../../components/ui/AuthCard";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import StatusIcon from "../../components/ui/StatusIcon";
import ResendVerification from "../../components/auth/ResendVerification";
import DevEmailBox from "../../components/dev/DevEmailBox";
import { ROUTES } from "../../constants/routePaths";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useAuth } from "../../hooks/useAuth";
import { verifyEmail } from "../../services/authService";

function BackToSignIn() {
  return (
    <p className="mt-6 text-center text-sm">
      <Link
        to={ROUTES.LOGIN}
        className="inline-block py-2 font-semibold text-brand-700 hover:underline"
      >
        Back to Sign In
      </Link>
    </p>
  );
}

// STATE 1: no token in the URL. The person has been asked to check their email.
function PendingView({ email, devToken }) {
  return (
    <>
      <div className="text-center">
        <StatusIcon icon={Mail} tone="brand" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Check your inbox
        </h1>
        <p className="mt-2 text-slate-600">
          {email ? (
            <>
              We have sent a verification link to{" "}
              <strong className="break-all text-slate-900">{email}</strong>.
            </>
          ) : (
            "We have sent you a verification link."
          )}{" "}
          Open the email and click the link to verify your account.
        </p>
      </div>

      {devToken && (
        <DevEmailBox
          to={`${ROUTES.VERIFY_EMAIL}?token=${devToken}`}
          label="Open verification link"
        />
      )}

      <div className="mt-6">
        <ResendVerification email={email} />
      </div>
      <BackToSignIn />
    </>
  );
}

// STATES 2 to 4: there is a token. Check it, then show loading, success or failure.
function TokenView({ token, email }) {
  const verify = useCallback(() => verifyEmail(token), [token]);
  const { loading, error } = useAsyncData(verify);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-8 text-slate-600">
        <Spinner /> Verifying your email...
      </div>
    );
  }

  if (error) {
    const expired = error.code === "TOKEN_EXPIRED";

    return (
      <>
        <div className="text-center">
          <StatusIcon icon={TriangleAlert} tone="amber" />
          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            {expired ? "This link has expired" : "This link is not valid"}
          </h1>
          <p className="mt-2 text-slate-600">
            {error.message} Request a new link below.
          </p>
        </div>

        <div className="mt-6">
          <ResendVerification email={email} />
        </div>
        <BackToSignIn />
      </>
    );
  }

  return (
    <div className="text-center">
      <StatusIcon icon={CircleCheck} tone="green" />
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Email verified</h1>
      <p className="mt-2 text-slate-600">
        Your email address has been verified. You can now sign in.
      </p>
      <Button to={ROUTES.LOGIN} className="mt-6 w-full">
        Sign In
      </Button>
    </div>
  );
}

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { user } = useAuth();

  const token = searchParams.get("token");

  // Where can we know the email from? The page that sent them here, or the signed-in user.
  const email = location.state?.email ?? user?.email ?? "";
  const devToken = location.state?.devToken ?? null;

  return (
    <AuthCard>
      {token ? (
        <TokenView key={token} token={token} email={email} />
      ) : (
        <PendingView email={email} devToken={devToken} />
      )}
    </AuthCard>
  );
}

export default VerifyEmail;
