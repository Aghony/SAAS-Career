export type InterviewType =
  | "phone_screen"
  | "technical"
  | "behavioral"
  | "onsite"
  | "final"
  | "other";
export type InterviewStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "rescheduled";

export interface InterviewApplicationSummary {
  id: string;
  company: string;
  position: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  application: InterviewApplicationSummary;
  type: InterviewType;
  status: InterviewStatus;
  scheduledAt: string;
  durationMinutes?: number | null;
  location?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewInput {
  applicationId: string;
  type: InterviewType;
  status?: InterviewStatus;
  scheduledAt: string;
  durationMinutes?: number;
  location?: string;
  notes?: string;
}

export const INTERVIEW_TYPES: InterviewType[] = [
  "phone_screen",
  "technical",
  "behavioral",
  "onsite",
  "final",
  "other",
];
export const TYPE_LABELS: Record<InterviewType, string> = {
  phone_screen: "Phone Screen",
  technical: "Technical",
  behavioral: "Behavioral",
  onsite: "Onsite",
  final: "Final",
  other: "Other",
};

export const INTERVIEW_STATUSES: InterviewStatus[] = [
  "scheduled",
  "completed",
  "cancelled",
  "rescheduled",
];
export const INTERVIEW_STATUS_LABELS: Record<InterviewStatus, string> = {
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
  rescheduled: "Rescheduled",
};
