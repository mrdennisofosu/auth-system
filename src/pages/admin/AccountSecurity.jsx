import ChangePasswordForm from "../../components/account/ChangePasswordForm";
import RecentActivityList from "../../components/account/RecentActivityList";
import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import PageContainer from "../../components/ui/PageContainer";
import PageHeader from "../../components/ui/PageHeader";
import { useAuth } from "../../hooks/useAuth";
import { formatDate, formatDateTime } from "../../utils/formatDate";

function AccountSecurity() {
  const { user } = useAuth();

  const details = [
    ["Last sign-in", formatDateTime(user.lastLogin)],
    [
      "Email verification",
      <Badge key="email" tone={user.emailVerified ? "green" : "amber"}>
        {user.emailVerified ? "Verified" : "Not verified"}
      </Badge>,
    ],
    ["Account created", formatDate(user.createdAt)],
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Security"
        description="Manage your password and review your account security."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <Card title="Change password">
          <ChangePasswordForm />
        </Card>

        <div className="space-y-4">
          <Card title="Account security">
            <dl className="divide-y divide-slate-100 text-sm">
              {details.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 py-2.5"
                >
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="text-right font-medium text-slate-900">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card title="Recent activity">
            <RecentActivityList email={user.email} />
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

export default AccountSecurity;
