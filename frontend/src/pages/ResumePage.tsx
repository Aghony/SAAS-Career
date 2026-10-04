import { useEffect, useState, type FormEvent } from "react";
import { resumeService } from "../services/resumeService";
import type { Resume } from "../types/resume.types";

function formatFileSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function ResumePage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [label, setLabel] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function loadResumes() {
    setIsLoading(true);
    setResumes(await resumeService.list());
    setIsLoading(false);
  }

  useEffect(() => {
    let cancelled = false;

    async function fetchResumes() {
      try {
        const data = await resumeService.list();

        if (!cancelled) {
          setResumes(data);
        }
      } catch {
        if (!cancelled) {
          setError("Gagal memuat resume.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchResumes();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleUpload(e: FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Pilih file PDF terlebih dahulu");
      return;
    }
    setError(null);
    setIsUploading(true);
    try {
      await resumeService.upload(label, file);
      setLabel("");
      setFile(null);
      (document.getElementById("resume-file-input") as HTMLInputElement).value =
        "";
      await loadResumes();
    } catch {
      setError("Gagal mengunggah resume. Pastikan file PDF dan maksimal 5MB.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSetPrimary(id: string) {
    await resumeService.setPrimary(id);
    await loadResumes();
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus resume ini?")) return;
    await resumeService.remove(id);
    await loadResumes();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Resume</h1>

      <form
        onSubmit={handleUpload}
        className="mb-8 rounded-lg border border-gray-200 bg-white p-5"
      >
        <h2 className="mb-3 font-medium text-gray-900">Upload Resume Baru</h2>
        {error && (
          <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700">Label</label>
            <input
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="misal: Resume - Backend Engineer"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700">
              File PDF (maks 5MB)
            </label>
            <input
              id="resume-file-input"
              type="file"
              accept="application/pdf"
              required
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isUploading}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {isUploading ? "Mengunggah..." : "Upload"}
          </button>
        </div>
      </form>

      {isLoading ? (
        <p className="text-gray-500">Memuat...</p>
      ) : resumes.length === 0 ? (
        <p className="text-gray-400">Belum ada resume yang diunggah.</p>
      ) : (
        <div className="space-y-3">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">{resume.label}</p>
                  {resume.isPrimary && (
                    <span className="rounded-full bg-gray-900 px-2 py-0.5 text-xs text-white">
                      Primary
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  {resume.fileName} · {formatFileSize(resume.fileSize)}
                </p>
              </div>
              <div className="flex gap-3 text-sm">
                {!resume.isPrimary && (
                  <button
                    onClick={() => handleSetPrimary(resume.id)}
                    className="text-gray-600 hover:underline"
                  >
                    Jadikan Primary
                  </button>
                )}
                <button
                  onClick={() =>
                    resumeService.download(resume.id, resume.fileName)
                  }
                  className="text-gray-600 hover:underline"
                >
                  Download
                </button>
                <button
                  onClick={() => handleDelete(resume.id)}
                  className="text-red-500 hover:underline"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
