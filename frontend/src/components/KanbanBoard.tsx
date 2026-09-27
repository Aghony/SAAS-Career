import type {
  Application,
  ApplicationStatus,
} from "../types/application.types";
import { APPLICATION_STATUSES, STATUS_LABELS } from "../types/application.types";
import { ApplicationCard } from "./ApplicationCard";

interface Props {
  applications: Application[];
  onCardClick: (application: Application) => void;
  onStatusChange: (application: Application, status: ApplicationStatus) => void;
}

export function KanbanBoard({
  applications,
  onCardClick,
  onStatusChange,
}: Props) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {APPLICATION_STATUSES.map((status) => {
        const items = applications.filter((a) => a.status === status);
        return (
          <div key={status} className="w-64 shrink-0">
            <div className="mb-2 flex items-center justify-between px-1">
              <h3 className="text-sm font-medium text-gray-700">
                {STATUS_LABELS[status]}
              </h3>
              <span className="text-xs text-gray-400">{items.length}</span>
            </div>
            <div className="min-h-30 space-y-2 rounded-md bg-gray-100 p-2">
              {items.map((app) => (
                <div key={app.id}>
                  <ApplicationCard
                    application={app}
                    onClick={() => onCardClick(app)}
                  />
                  <select
                    value={app.status}
                    onChange={(e) =>
                      onStatusChange(app, e.target.value as ApplicationStatus)
                    }
                    className="mt-1 w-full rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600"
                  >
                    {APPLICATION_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
