import { useState, type FormEvent } from "react";
import axios from "axios";
import type {
  Skill,
  SkillInput,
  SkillCategory,
  ProficiencyLevel,
} from "../types/skill.types";
import {
  SKILL_CATEGORIES,
  CATEGORY_LABELS,
  PROFICIENCY_LEVELS,
  PROFICIENCY_LABELS,
} from "../types/skill.types";

interface Props {
  initial?: Skill | null;
  onClose: () => void;
  onSubmit: (input: SkillInput) => Promise<void>;
}

export function SkillFormModal({ initial, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<SkillInput>({
    name: initial?.name ?? "",
    category: initial?.category ?? "language",
    proficiencyLevel: initial?.proficiencyLevel ?? "intermediate",
    yearsOfExperience: initial?.yearsOfExperience ?? undefined,
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
          ? (err.response?.data?.error?.message ?? "Gagal menyimpan skill.")
          : "Gagal menyimpan skill.",
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
          {initial ? "Edit Skill" : "Tambah Skill"}
        </h2>
        {error && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Nama Skill
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="misal: React, Public Speaking"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Kategori
            </label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value as SkillCategory })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              {SKILL_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Level</label>
            <select
              value={form.proficiencyLevel}
              onChange={(e) =>
                setForm({
                  ...form,
                  proficiencyLevel: e.target.value as ProficiencyLevel,
                })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              {PROFICIENCY_LEVELS.map((p) => (
                <option key={p} value={p}>
                  {PROFICIENCY_LABELS[p]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Lama Pengalaman (tahun, opsional)
            </label>
            <input
              type="number"
              min={0}
              value={form.yearsOfExperience ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  yearsOfExperience: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
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
