import { useState, type FormEvent } from "react";
import axios from "axios";
import type {
  Interview,
  InterviewInput,
  InterviewType,
  InterviewStatus,
} from "../types/interview.types";
import {
  INTERVIEW_TYPES,
  TYPE_LABELS,
  INTERVIEW_STATUSES,
  INTERVIEW_STATUS_LABELS,
} from "../types/interview.types";
import type { Application } from "../types/application.types";

interface Props {
  applications: Application[];
  initial?: Interview | null;
  onClose: () => void;
  onSubmit: (input: InterviewInput) => Promise<void>;
}

function toLocalDateTimeInput(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 16);
}

export function InterviewFormModal({
  applications,
  initial,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<InterviewInput>({
    applicationId: initial?.applicationId ?? applications[0]?.id ?? "",
    type: initial?.type ?? "phone_screen",
    status: initial?.status ?? "scheduled",
    scheduledAt: toLocalDateTimeInput(initial?.scheduledAt),
    durationMinutes: initial?.durationMinutes ?? undefined,
    location: initial?.location ?? "",
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
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? (err.response?.data?.error?.message ?? "Gagal menyimpan interview.")
          : "Gagal menyimpan interview.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
      >
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {initial ? "Edit Interview" : "Jadwalkan Interview"}
        </h2>
        {error && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Application
            </label>
            <select
              required
              disabled={!!initial}
              value={form.applicationId}
              onChange={(e) =>
                setForm({ ...form, applicationId: e.target.value })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
            >
              {applications.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.company} — {a.position}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Type</label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value as InterviewType })
                }
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                {INTERVIEW_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as InterviewStatus,
                  })
                }
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                {INTERVIEW_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {INTERVIEW_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Tanggal & Waktu
            </label>
            <input
              type="datetime-local"
              required
              value={form.scheduledAt}
              onChange={(e) =>
                setForm({ ...form, scheduledAt: e.target.value })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Durasi (menit)
              </label>
              <input
                type="number"
                min={1}
                value={form.durationMinutes ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    durationMinutes: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Lokasi
              </label>
              <input
                value={form.location ?? ""}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Zoom link / alamat"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
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
