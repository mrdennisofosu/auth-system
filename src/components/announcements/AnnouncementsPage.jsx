import { Megaphone } from "lucide-react";
import EmptyState from "../ui/EmptyState";
import ErrorState from "../ui/ErrorState";
import LoadingState from "../ui/LoadingState";
import PageContainer from "../ui/PageContainer";
import PageHeader from "../ui/PageHeader";
import AnnouncementCard from "./AnnouncementCard";
import { useAsyncData } from "../../hooks/useAsyncData";
import { getPublishedAnnouncements } from "../../services/announcementService";

// Defined outside the component so its identity is stable (see useAsyncData)
const fetchAll = () => getPublishedAnnouncements();

// basePath decides where each card links: "/announcements" or "/user/announcements"
function AnnouncementsPage({ basePath }) {
  const { data, loading, error, reload } = useAsyncData(fetchAll);

  return (
    <PageContainer>
      <PageHeader
        title="Announcements"
        description="News and updates from the administrators."
      />

      {loading && !data && <LoadingState message="Loading announcements..." />}
      {error && <ErrorState message={error.message} onRetry={reload} />}

      {data && data.length === 0 && (
        <EmptyState
          icon={Megaphone}
          title="No announcements yet"
          description="Announcements will appear here when they are published."
        />
      )}

      {data && data.length > 0 && (
        <ul className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {data.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              to={`${basePath}/${announcement.id}`}
            />
          ))}
        </ul>
      )}
    </PageContainer>
  );
}

export default AnnouncementsPage;
