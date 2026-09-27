import { useState, type FormEvent } from "react";
import type {
  Application,
  ApplicationInput,
  ApplicationStatus,
  EmploymentType,
} from "../types/application.types";
import {
  APPLICATION_STATUSES,
  STATUS_LABELS,
} from "../types/application.types";

interface Props {
  initial?: Application | null;
  onClose: () => void;
  onSubmit: (input: ApplicationInput) => Promise<void>;
}

const EMPLOYMENT_TYPES: EmploymentType[] = [
  "full_time",
  "part_time",
  "contract",
  "internship",
  "freelance",
];

export function ApplicationFormModal({ initial, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<ApplicationInput>({
    company: initial?.company ?? "",
    position: initial?.position ?? "",
    jobUrl: initial?.jobUrl ?? "",
    location: initial?.location ?? "",
    employmentType: initial?.employmentType ?? undefined,
    salaryMin: initial?.salaryMin ?? undefined,
    salaryMax: initial?.salaryMax ?? undefined,
    deadline: initial?.deadline?.slice(0, 10) ?? "",
    status: initial?.status ?? "wishlist",
    notes: initial?.notes ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } catch {
      setError("Gagal menyimpan application. Cek kembali data yang diisi.");
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
          {initial ? "Edit Application" : "Tambah Application"}
        </h2>
        {error && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-700">Company</label>
            <input
              required
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Position
            </label>
            <input
              required
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as ApplicationStatus,
                })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              {APPLICATION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Employment Type
            </label>
            <select
              value={form.employmentType ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  employmentType: (e.target.value || undefined) as
                    | EmploymentType
                    | undefined,
                })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">-</option>
              {EMPLOYMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              value={form.location ?? ""}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Deadline
            </label>
            <input
              type="date"
              value={form.deadline ?? ""}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Salary Min
            </label>
            <input
              type="number"
              value={form.salaryMin ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  salaryMin: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Salary Max
            </label>
            <input
              type="number"
              value={form.salaryMax ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  salaryMax: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-700">Job URL</label>
            <input
              value={form.jobUrl ?? ""}
              onChange={(e) => setForm({ ...form, jobUrl: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <textarea
              rows={3}
              value={form.notes ?? ""}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
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
