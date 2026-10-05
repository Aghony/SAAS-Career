import { useEffect, useState } from "react";
import { interviewService } from "../services/interviewService";
import { applicationService } from "../services/applicationService";
import type { Interview, InterviewInput } from "../types/interview.types";
import { TYPE_LABELS, INTERVIEW_STATUS_LABELS } from "../types/interview.types";
import type { Application } from "../types/application.types";
import { InterviewFormModal } from "../components/InterviewFormModal";

export function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<Interview | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    const [interviewList, applicationList] = await Promise.all([
      interviewService.list(),
      applicationService.list({ limit: 100 }),
    ]);
    setInterviews(interviewList);
    setApplications(applicationList.items);
    setIsLoading(false);
  }

  async function handleSubmit(input: InterviewInput) {
    if (editing) await interviewService.update(editing.id, input);
    else await interviewService.create(input);
    await loadData();
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus jadwal interview ini?")) return;
    await interviewService.remove(id);
    await loadData();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Interviews</h1>
        {applications.length > 0 && (
          <button
            onClick={() => {
              setEditing(null);
              setIsModalOpen(true);
            }}
            className="rounded-md bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            + Jadwalkan
          </button>
        )}
      </div>

      {isLoading ? (
        <p className="text-gray-500">Memuat...</p>
      ) : applications.length === 0 ? (
        <p className="text-gray-400">
          Tambahkan application terlebih dahulu sebelum menjadwalkan interview.
        </p>
      ) : interviews.length === 0 ? (
        <p className="text-gray-400">Belum ada interview terjadwal.</p>
      ) : (
        <div className="space-y-3">
          {interviews.map((interview) => (
            <div
              key={interview.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">
                    {interview.application.company} —{" "}
                    {interview.application.position}
                  </p>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {TYPE_LABELS[interview.type]}
                  </span>
                  <span className="rounded-full bg-gray-900 px-2 py-0.5 text-xs text-white">
                    {INTERVIEW_STATUS_LABELS[interview.status]}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  {new Date(interview.scheduledAt).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                  {interview.location && ` · ${interview.location}`}
                </p>
              </div>
              <div className="flex gap-3 text-sm">
                <button
                  onClick={() => {
                    setEditing(interview);
                    setIsModalOpen(true);
                  }}
                  className="text-gray-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(interview.id)}
                  className="text-red-500 hover:underline"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <InterviewFormModal
          applications={applications}
          initial={editing}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
