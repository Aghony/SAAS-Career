import { useEffect, useState } from "react";
import { applicationService } from "../services/applicationService";
import type {
  Application,
  ApplicationInput,
  ApplicationStatus,
} from "../types/application.types";
import { KanbanBoard } from "../components/KanbanBoard";
import { ApplicationTable } from "../components/ApplicationTable";
import { ApplicationFormModal } from "../components/ApplicationFormModal";

type ViewMode = "kanban" | "table";

export function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<ViewMode>("kanban");
  const [editing, setEditing] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function loadApplications() {
    setIsLoading(true);
    const result = await applicationService.list({ limit: 100 });
    setApplications(result.items);
    setIsLoading(false);
  }

  useEffect(() => {
    async function fetchApplications() {
      setIsLoading(true);

      const result = await applicationService.list({ limit: 100 });

      setApplications(result.items);
      setIsLoading(false);
    }

    fetchApplications();
  }, []);

  function openCreateModal() {
    setEditing(null);
    setIsModalOpen(true);
  }

  function openEditModal(application: Application) {
    setEditing(application);
    setIsModalOpen(true);
  }

  async function handleSubmit(input: ApplicationInput) {
    if (editing) await applicationService.update(editing.id, input);
    else await applicationService.create(input);
    await loadApplications();
  }

  async function handleStatusChange(
    application: Application,
    status: ApplicationStatus,
  ) {
    await applicationService.update(application.id, { status });
    await loadApplications();
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus application ini?")) return;
    await applicationService.remove(id);
    await loadApplications();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Applications</h1>
        <div className="flex items-center gap-3">
          <div className="flex rounded-md border border-gray-300 text-sm">
            <button
              onClick={() => setView("kanban")}
              className={`px-3 py-1.5 ${view === "kanban" ? "bg-gray-900 text-white" : "text-gray-600"}`}
            >
              Kanban
            </button>
            <button
              onClick={() => setView("table")}
              className={`px-3 py-1.5 ${view === "table" ? "bg-gray-900 text-white" : "text-gray-600"}`}
            >
              Table
            </button>
          </div>
          <button
            onClick={openCreateModal}
            className="rounded-md bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            + Tambah
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Memuat...</p>
      ) : view === "kanban" ? (
        <KanbanBoard
          applications={applications}
          onCardClick={openEditModal}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <ApplicationTable
          applications={applications}
          onRowClick={openEditModal}
          onDelete={handleDelete}
        />
      )}

      {isModalOpen && (
        <ApplicationFormModal
          initial={editing}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
