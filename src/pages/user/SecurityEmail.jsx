import ResendVerification from "../../components/auth/ResendVerification";
import Alert from "../../components/ui/Alert";
import Card from "../../components/ui/Card";
import PageContainer from "../../components/ui/PageContainer";
import PageHeader from "../../components/ui/PageHeader";
import { useAuth } from "../../hooks/useAuth";

function SecurityEmail() {
  const { user } = useAuth();

  return (
    <PageContainer>
      <PageHeader
        title="Email Verification"
        description="Confirm that you own your email address."
      />

      <Card title="Your email address">
        <p className="break-all font-semibold text-slate-900">{user.email}</p>

        <div className="mt-4">
          {user.emailVerified ? (
            <Alert variant="success" title="Verified">
              Your email address has been verified. Nothing more to do.
            </Alert>
          ) : (
            <div className="space-y-4">
              <Alert variant="info" title="Not verified yet">
                Open the link in the email we sent you to verify your address.
              </Alert>
              <ResendVerification email={user.email} />
            </div>
          )}
        </div>
      </Card>
    </PageContainer>
  );
}

export default SecurityEmail;
