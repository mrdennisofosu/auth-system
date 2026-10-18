import ProfileForm from "../../components/account/ProfileForm";
import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import PageContainer from "../../components/ui/PageContainer";
import PageHeader from "../../components/ui/PageHeader";
import { RoleBadge, StatusBadge } from "../../components/admin/UserBadges";
import { useAuth } from "../../hooks/useAuth";
import { formatDate } from "../../utils/formatDate";

function AccountProfile() {
  const { user } = useAuth();

  const details = [
    ["Role", <RoleBadge key="role" role={user.role} />],
    ["Status", <StatusBadge key="status" status={user.status} />],
    [
      "Email",
      <Badge key="email" tone={user.emailVerified ? "green" : "amber"}>
        {user.emailVerified ? "Verified" : "Not verified"}
      </Badge>,
    ],
    ["Member since", formatDate(user.createdAt)],
  ];

  return (
    <PageContainer>
      <PageHeader title="My Profile" description="Your personal information." />

      <div className="grid gap-4 xl:grid-cols-3">
        <Card title="Personal information" className="xl:col-span-2">
          <ProfileForm />
        </Card>

        <Card title="Account">
          <dl className="divide-y divide-slate-100 text-sm">
            {details.map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 py-2.5"
              >
                <dt className="text-slate-500">{label}</dt>
                <dd className="font-medium text-slate-900">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </PageContainer>
  );
}

export default AccountProfile;
