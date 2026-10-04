export interface Project {
  id: string;
  title: string;
  description?: string | null;
  role?: string | null;
  techStack: string[];
  projectUrl?: string | null;
  repoUrl?: string | null;
  thumbnailUrl?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  isOngoing: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectInput {
  title: string;
  description?: string;
  role?: string;
  techStack?: string[];
  projectUrl?: string;
  repoUrl?: string;
  thumbnailUrl?: string;
  startDate?: string;
  endDate?: string;
  isOngoing?: boolean;
}
