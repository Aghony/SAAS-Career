import type { Project } from "../types/project.types";

interface Props {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProjectCard({ project, onEdit, onDelete }: Props) {
  const period = [
    project.startDate
      ? new Date(project.startDate).toLocaleDateString("id-ID", {
          month: "short",
          year: "numeric",
        })
      : null,
    project.isOngoing
      ? "Sekarang"
      : project.endDate
        ? new Date(project.endDate).toLocaleDateString("id-ID", {
            month: "short",
            year: "numeric",
          })
        : null,
  ]
    .filter(Boolean)
    .join(" — ");

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      {project.thumbnailUrl && (
        <img
          src={project.thumbnailUrl}
          alt={project.title}
          className="mb-3 h-32 w-full rounded-md object-cover"
        />
      )}
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-gray-900">{project.title}</p>
          {project.role && (
            <p className="text-xs text-gray-500">{project.role}</p>
          )}
        </div>
        {project.isOngoing && (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
            Ongoing
          </span>
        )}
      </div>
      {period && <p className="mt-1 text-xs text-gray-400">{period}</p>}
      {project.description && (
        <p className="mt-2 text-sm text-gray-600">{project.description}</p>
      )}
      {project.techStack.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex gap-3">
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noreferrer"
              className="text-gray-600 hover:underline"
            >
              Live
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-gray-600 hover:underline"
            >
              Repo
            </a>
          )}
        </div>
        <div className="flex gap-3">
          <button onClick={onEdit} className="text-gray-600 hover:underline">
            Edit
          </button>
          <button onClick={onDelete} className="text-red-500 hover:underline">
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
