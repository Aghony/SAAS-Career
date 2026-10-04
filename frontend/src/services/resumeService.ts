import { api } from "./api";
import type { Resume } from "../types/resume.types";

export const resumeService = {
  async list() {
    const res = await api.get<{ data: { resumes: Resume[] } }>("/resumes");
    return res.data.data.resumes;
  },

  async upload(label: string, file: File) {
    const formData = new FormData();
    formData.append("label", label);
    formData.append("file", file);
    const res = await api.post<{ data: { resume: Resume } }>(
      "/resumes",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return res.data.data.resume;
  },

  async setPrimary(id: string) {
    const res = await api.patch<{ data: { resume: Resume } }>(
      `/resumes/${id}`,
      { isPrimary: true },
    );
    return res.data.data.resume;
  },

  async remove(id: string) {
    await api.delete(`/resumes/${id}`);
  },

  async download(id: string, fileName: string) {
    const res = await api.get(`/resumes/${id}/download`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
