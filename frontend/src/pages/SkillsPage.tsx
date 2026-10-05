import { useEffect, useState } from "react";
import { skillService } from "../services/skillService";
import type { Skill, SkillInput } from "../types/skill.types";
import {
  SKILL_CATEGORIES,
  CATEGORY_LABELS,
  PROFICIENCY_LABELS,
} from "../types/skill.types";
import { SkillFormModal } from "../components/SkillFormModal";

export function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadSkills();
  }, []);

  async function loadSkills() {
    setIsLoading(true);
    setSkills(await skillService.list());
    setIsLoading(false);
  }

  async function handleSubmit(input: SkillInput) {
    if (editing) await skillService.update(editing.id, input);
    else await skillService.create(input);
    await loadSkills();
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus skill ini?")) return;
    await skillService.remove(id);
    await loadSkills();
  }

  const grouped = SKILL_CATEGORIES.map((category) => ({
    category,
    items: skills.filter((s) => s.category === category),
  })).filter((g) => g.items.length > 0);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Skills</h1>
        <button
          onClick={() => {
            setEditing(null);
            setIsModalOpen(true);
          }}
          className="rounded-md bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          + Tambah
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Memuat...</p>
      ) : skills.length === 0 ? (
        <p className="text-gray-400">Belum ada skill yang dicatat.</p>
      ) : (
        <div className="space-y-6">
          {grouped.map((group) => (
            <section key={group.category}>
              <h2 className="mb-2 text-sm font-medium text-gray-500">
                {CATEGORY_LABELS[group.category]}
              </h2>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  >
                    <span className="font-medium text-gray-900">
                      {skill.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {PROFICIENCY_LABELS[skill.proficiencyLevel]}
                    </span>
                    {skill.yearsOfExperience != null && (
                      <span className="text-xs text-gray-400">
                        · {skill.yearsOfExperience} thn
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setEditing(skill);
                        setIsModalOpen(true);
                      }}
                      className="text-gray-400 hover:text-gray-700"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {isModalOpen && (
        <SkillFormModal
          initial={editing}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
