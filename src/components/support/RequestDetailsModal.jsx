import Button from "../ui/Button";
import Modal from "../ui/Modal";
import SupportBadge from "./SupportBadge";
import SupportThread from "./SupportThread";
import { SUPPORT_STATUS } from "../../constants/statuses";
import { formatDate } from "../../utils/formatDate";

const statusText = {
  [SUPPORT_STATUS.PENDING]:
    "We have received your request and will reply soon.",
  [SUPPORT_STATUS.IN_PROGRESS]: "We are working on your request.",
  [SUPPORT_STATUS.RESOLVED]: "This request has been resolved.",
};

function RequestDetailsModal({ request, onClose }) {
  return (
    <Modal
      title="Support request"
      onClose={onClose}
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-slate-900">{request.subject}</p>
          <p className="text-sm text-slate-500">
            Sent on {formatDate(request.createdAt)}
          </p>
        </div>
        <SupportBadge status={request.status} />
      </div>

      <p className="mb-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
        {statusText[request.status]}
      </p>

      <SupportThread request={request} />
    </Modal>
  );
}

export default RequestDetailsModal;
