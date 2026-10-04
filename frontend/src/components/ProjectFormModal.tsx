import { useState, type FormEvent } from "react";
import type { Project, ProjectInput } from "../types/project.types";

interface Props {
  initial?: Project | null;
  onClose: () => void;
  onSubmit: (input: ProjectInput) => Promise<void>;
}

export function ProjectFormModal({ initial, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<ProjectInput>({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    role: initial?.role ?? "",
    techStack: initial?.techStack ?? [],
    projectUrl: initial?.projectUrl ?? "",
    repoUrl: initial?.repoUrl ?? "",
    thumbnailUrl: initial?.thumbnailUrl ?? "",
    startDate: initial?.startDate?.slice(0, 10) ?? "",
    endDate: initial?.endDate?.slice(0, 10) ?? "",
    isOngoing: initial?.isOngoing ?? false,
  });
  const [techInput, setTechInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function addTech() {
    const value = techInput.trim();
    if (value && !form.techStack?.includes(value)) {
      setForm({ ...form, techStack: [...(form.techStack ?? []), value] });
    }
    setTechInput("");
  }

  function removeTech(tech: string) {
    setForm({ ...form, techStack: form.techStack?.filter((t) => t !== tech) });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } catch {
      setError("Gagal menyimpan project. Cek kembali data yang diisi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-lg"
      >
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {initial ? "Edit Project" : "Tambah Project"}
        </h2>
        {error && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Role</label>
            <input
              value={form.role ?? ""}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="misal: Lead Developer"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description ?? ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Tech Stack
            </label>
            <div className="mt-1 flex gap-2">
              <input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTech();
                  }
                }}
                placeholder="ketik lalu Enter"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={addTech}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700"
              >
                +
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {form.techStack?.map((tech) => (
                <span
                  key={tech}
                  className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTech(tech)}
                    className="text-gray-400 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Project URL
              </label>
              <input
                value={form.projectUrl ?? ""}
                onChange={(e) =>
                  setForm({ ...form, projectUrl: e.target.value })
                }
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Repo URL
              </label>
              <input
                value={form.repoUrl ?? ""}
                onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                value={form.startDate ?? ""}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                disabled={form.isOngoing}
                value={form.endDate ?? ""}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.isOngoing}
              onChange={(e) =>
                setForm({ ...form, isOngoing: e.target.checked })
              }
            />
            Masih berjalan sampai sekarang
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
