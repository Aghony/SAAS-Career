import { useEffect, useState } from "react";
import { projectService } from "../services/projectService";
import type { Project, ProjectInput } from "../types/project.types";
import { ProjectCard } from "../components/ProjectCard";
import { ProjectFormModal } from "../components/ProjectFormModal";

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchProjects() {
      try {
        const data = await projectService.list();
        if (!cancelled) {
          setProjects(data);
          setIsLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Gagal memuat project:", error);
          setIsLoading(false);
        }
      }
    }

    fetchProjects();
    return () => {
      cancelled = true;
    };
  }, []);

  async function loadProjects() {
    setIsLoading(true);
    try {
      const data = await projectService.list();
      setProjects(data);
    } catch (error) {
      console.error("Gagal memuat project:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(input: ProjectInput) {
    if (editing) await projectService.update(editing.id, input);
    else await projectService.create(input);
    await loadProjects();
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus project ini?")) return;
    await projectService.remove(id);
    await loadProjects();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
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
      ) : projects.length === 0 ? (
        <p className="text-gray-400">
          Belum ada project. Tambahkan portofolio pertama Anda.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => {
                setEditing(project);
                setIsModalOpen(true);
              }}
              onDelete={() => handleDelete(project.id)}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <ProjectFormModal
          initial={editing}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
