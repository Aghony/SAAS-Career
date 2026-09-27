export type ApplicationStatus =
  | "wishlist"
  | "applied"
  | "assessment"
  | "interview"
  | "technical_test"
  | "offer"
  | "rejected"
  | "withdrawn";

export type EmploymentType =
  | "full_time"
  | "part_time"
  | "contract"
  | "internship"
  | "freelance";

export interface Application {
  id: string;
  company: string;
  position: string;
  jobUrl?: string | null;
  location?: string | null;
  employmentType?: EmploymentType | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  AppliedAt?: string | null;
  deadline?: string | null;
  status: ApplicationStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationListResult {
  items: Application[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface ApplicationInput {
  company: string;
  position: string;
  jobUrl?: string;
  location?: string;
  employmentType?: EmploymentType;
  salaryMin?: number;
  salaryMax?: number;
  appliedAt?: string;
  deadline?: string;
  status?: ApplicationStatus;
  notes?: string;
}

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "wishlist",
  "applied",
  "assessment",
  "interview",
  "technical_test",
  "offer",
  "rejected",
  "withdrawn",
];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  wishlist: "Wishlist",
  applied: "Applied",
  assessment: "Assessment",
  interview: "Interview",
  technical_test: "Technical Test",
  offer: "Offer",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};
