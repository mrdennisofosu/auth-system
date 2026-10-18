import ChangePasswordForm from "../../components/account/ChangePasswordForm";
import Card from "../../components/ui/Card";
import PageContainer from "../../components/ui/PageContainer";
import PageHeader from "../../components/ui/PageHeader";
import { useAuth } from "../../hooks/useAuth";
import { formatDateTime } from "../../utils/formatDate";

function SecurityPassword() {
  const { user } = useAuth();

  return (
    <PageContainer>
      <PageHeader
        title="Change Password"
        description="Choose a strong password you do not use anywhere else."
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <Card title="New password" className="xl:col-span-2">
          <ChangePasswordForm />
        </Card>

        <Card title="Last sign-in">
          <p className="text-sm text-slate-600">Your last sign-in was on</p>
          <p className="mt-1 font-semibold text-slate-900">
            {formatDateTime(user.lastLogin)}
          </p>
          <p className="mt-3 text-sm text-slate-500">
            If you do not recognise it, change your password now.
          </p>
        </Card>
      </div>
    </PageContainer>
  );
}

export default SecurityPassword;
