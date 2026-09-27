import type { Application } from "../types/application.types";
import { STATUS_LABELS } from "../types/application.types";

interface Props {
  applications: Application[];
  onRowClick: (application: Application) => void;
  onDelete: (id: string) => void;
}

export function ApplicationTable({
  applications,
  onRowClick,
  onDelete,
}: Props) {
  return (
    <table className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white text-sm">
      <thead className="bg-gray-50 text-left text-gray-500">
        <tr>
          <th className="px-4 py-2">Company</th>
          <th className="px-4 py-2">Position</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Deadline</th>
          <th className="px-4 py-2"></th>
        </tr>
      </thead>
      <tbody>
        {applications.map((app) => (
          <tr
            key={app.id}
            className="border-t border-gray-100 hover:bg-gray-50"
          >
            <td
              className="cursor-pointer px-4 py-2"
              onClick={() => onRowClick(app)}
            >
              {app.company}
            </td>
            <td
              className="cursor-pointer px-4 py-2"
              onClick={() => onRowClick(app)}
            >
              {app.position}
            </td>
            <td className="px-4 py-2">{STATUS_LABELS[app.status]}</td>
            <td className="px-4 py-2 text-gray-400">
              {app.deadline
                ? new Date(app.deadline).toLocaleDateString("id-ID")
                : "-"}
            </td>
            <td className="px-4 py-2 text-right">
              <button
                onClick={() => onDelete(app.id)}
                className="text-xs text-red-500 hover:underline"
              >
                Hapus
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
