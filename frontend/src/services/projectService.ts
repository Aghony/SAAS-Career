import { api } from "./api";
import type { Project, ProjectInput } from "../types/project.types";

function cleanInput<T extends object>(input: T): T {
  const cleaned = { ...input } as Record<string, unknown>;
  for (const key of Object.keys(cleaned)) {
    if (cleaned[key] === "") cleaned[key] = undefined;
  }
  return cleaned as T;
}

export const projectService = {
  async list() {
    const res = await api.get<{ data: { projects: Project[] } }>("/projects");
    return res.data.data.projects;
  },
  async create(input: ProjectInput) {
    const res = await api.post<{ data: { project: Project } }>(
      "/projects",
      cleanInput(input),
    );
    return res.data.data.project;
  },
  async update(id: string, input: Partial<ProjectInput>) {
    const res = await api.patch<{ data: { project: Project } }>(
      `/projects/${id}`,
      cleanInput(input),
    );
    return res.data.data.project;
  },
  async remove(id: string) {
    await api.delete(`/projects/${id}`);
  },
};
