import { useCallback, useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import Alert from "../../components/ui/Alert";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import PageContainer from "../../components/ui/PageContainer";
import PageHeader from "../../components/ui/PageHeader";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import {
  listSessions,
  revokeOtherSessions,
  revokeSession,
} from "../../services/sessionService";
import { getDeviceLabel } from "../../utils/device";
import { formatDateTime } from "../../utils/formatDate";

function SecuritySessions() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const fetchSessions = useCallback(() => listSessions(user.id), [user.id]);
  const { data, loading, error, reload } = useAsyncData(fetchSessions);

  // null | { type: 'one', session } | { type: 'others' }
  const [confirming, setConfirming] = useState(null);
  const [working, setWorking] = useState(false);

  const hasOthers = data ? data.some((session) => !session.current) : false;

  async function runAction(action, successMessage) {
    setWorking(true);
    try {
      await action();
      showToast({ type: "success", message: successMessage });
      reload();
    } catch (actionError) {
      showToast({ type: "error", message: actionError.message });
    } finally {
      setWorking(false);
      setConfirming(null);
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Active Sessions"
        description="The devices where you are currently signed in."
        actions={
          <Button
            variant="secondary"
            disabled={!hasOthers}
            onClick={() => setConfirming({ type: "others" })}
          >
            Sign out of other devices
          </Button>
        }
      />

      <Alert variant="info" title="Simulated">
        The other devices shown here are sample data. The real list will come
        from the backend.
      </Alert>

      {loading && !data && <LoadingState message="Loading sessions..." />}
      {error && <ErrorState message={error.message} onRetry={reload} />}

      {data && (
        <Card>
          <ul className="divide-y divide-slate-100">
            {data.map((session) => {
              const Icon = /iPhone|Android/.test(session.device)
                ? Smartphone
                : Monitor;

              return (
                <li
                  key={session.id}
                  className="flex flex-wrap items-center gap-3 py-3"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900">
                      {session.current ? getDeviceLabel() : session.device}{" "}
                      {session.current && (
                        <Badge tone="green">This device</Badge>
                      )}
                    </p>
                    <p className="text-sm text-slate-500">
                      {session.location} ·{" "}
                      {session.current
                        ? "Active now"
                        : formatDateTime(session.lastActive)}
                    </p>
                  </div>
                  {!session.current && (
                    <Button
                      variant="secondary"
                      onClick={() => setConfirming({ type: "one", session })}
                    >
                      Sign out
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      {confirming?.type === "one" && (
        <ConfirmDialog
          title="Sign out this device"
          message={`Sign out ${confirming.session.device}? It will need to sign in again.`}
          confirmLabel="Sign out"
          variant="danger"
          loading={working}
          onCancel={() => setConfirming(null)}
          onConfirm={() =>
            runAction(
              () => revokeSession(user.id, confirming.session.id),
              "Device signed out.",
            )
          }
        />
      )}

      {confirming?.type === "others" && (
        <ConfirmDialog
          title="Sign out of other devices"
          message="Sign out of every device except this one? They will need to sign in again."
          confirmLabel="Sign out others"
          variant="danger"
          loading={working}
          onCancel={() => setConfirming(null)}
          onConfirm={() =>
            runAction(
              () => revokeOtherSessions(user.id),
              "Signed out of all other devices.",
            )
          }
        />
      )}
    </PageContainer>
  );
}

export default SecuritySessions;
