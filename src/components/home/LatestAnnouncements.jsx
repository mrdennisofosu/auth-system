import { Link } from "react-router";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import { useAsyncData } from "../../hooks/useAsyncData";
import { getPublishedAnnouncements } from "../../services/announcementService";
import { formatDate } from "../../utils/formatDate";
import { ROUTES } from "../../constants/routePaths";

// Defined OUTSIDE the component so its identity never changes (see useAsyncData).
const fetchLatest = () => getPublishedAnnouncements({ limit: 3 });

function LatestAnnouncements() {
  const { data, loading, error, reload } = useAsyncData(fetchLatest);

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Latest announcements
          </h2>
          <p className="mt-1 text-slate-600">
            News and updates from the administrators.
          </p>
        </div>
        <Link
          to={ROUTES.ANNOUNCEMENTS}
          className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          View all
        </Link>
      </div>

      <div className="mt-6">
        {/* State 1: loading */}
        {loading && (
          <div className="flex items-center gap-3 text-slate-600">
            <Spinner /> Loading announcements...
          </div>
        )}

        {/* State 2: error */}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4"
          >
            <p className="text-sm font-medium text-red-800">{error.message}</p>
            <Button variant="secondary" className="mt-3" onClick={reload}>
              Try again
            </Button>
          </div>
        )}

        {/* State 3: loaded, but nothing to show */}
        {!loading && !error && data.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600">
            No announcements have been published yet.
          </p>
        )}

        {/* State 4: loaded with data */}
        {!loading && !error && data.length > 0 && (
          <ul className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            {data.map((announcement) => (
              <li
                key={announcement.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <time
                  dateTime={announcement.publishedAt}
                  className="text-xs font-medium text-slate-500"
                >
                  {formatDate(announcement.publishedAt)}
                </time>
                <h3 className="mt-1 font-semibold text-slate-900">
                  <Link
                    to={`${ROUTES.ANNOUNCEMENTS}/${announcement.id}`}
                    className="hover:text-brand-700 hover:underline"
                  >
                    {announcement.title}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                  {announcement.content}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default LatestAnnouncements;
