import { Link } from "react-router";
import { formatDate } from "../../utils/formatDate";

function AnnouncementCard({ announcement, to }) {
  return (
    <li className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <time
        dateTime={announcement.publishedAt}
        className="text-xs font-medium text-slate-500"
      >
        {formatDate(announcement.publishedAt)}
      </time>
      <h2 className="mt-1 font-semibold text-slate-900">
        <Link to={to} className="hover:text-brand-700 hover:underline">
          {announcement.title}
        </Link>
      </h2>
      <p className="mt-2 line-clamp-3 text-sm text-slate-600">
        {announcement.content}
      </p>
      <Link
        to={to}
        className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-brand-700 hover:underline"
      >
        Read more
      </Link>
    </li>
  );
}

export default AnnouncementCard;
