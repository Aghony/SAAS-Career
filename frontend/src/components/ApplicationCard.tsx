import type { Application } from "../types/application.types";

interface Props {
  application: Application;
  onClick: () => void;
}

export function ApplicationCard({ application, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-md border border-gray-200 bg-white p-3 text-left shadow-sm hover:border-gray-400"
    >
      <p className="text-sm font-medium text-gray-900">
        {application.position}
      </p>
      <p className="text-xs text-gray-500">{application.company}</p>
      {application.deadline && (
        <p className="mt-2 text-xs text-gray-400">
          Deadline: {new Date(application.deadline).toLocaleDateString("id-ID")}
        </p>
      )}
    </button>
  );
}
