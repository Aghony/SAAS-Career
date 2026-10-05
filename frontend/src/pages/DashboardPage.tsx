import { useEffect, useState } from "react";
import {
  dashboardService,
  type DashboardSummary,
} from "../services/dashboardService";
import { STATUS_LABELS } from "../types/application.types";
import { TYPE_LABELS } from "../types/interview.types";

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getSummary()
      .then(setSummary)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <p className="text-gray-500">Memuat dashboard...</p>;
  if (!summary)
    return <p className="text-red-500">Gagal memuat data dashboard.</p>;

  const statCards = [
    { label: "Total Applications", value: summary.totalApplications },
    { label: "Interviews", value: summary.statusBreakdown.interview },
    { label: "Technical Tests", value: summary.statusBreakdown.technical_test },
    { label: "Offers", value: summary.statusBreakdown.offer },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Dashboard</h1>
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-gray-200 bg-white p-5"
          >
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">
              {card.value}
            </p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="mb-3 font-medium text-gray-900">Upcoming Deadlines</h2>
          {summary.upcomingDeadlines.length === 0 && (
            <p className="text-sm text-gray-400">
              Tidak ada deadline mendatang.
            </p>
          )}
          <ul className="space-y-2">
            {summary.upcomingDeadlines.map((app) => (
              <li key={app.id} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {app.company} — {app.position}
                </span>
                <span className="text-gray-400">
                  {new Date(app.deadline!).toLocaleDateString("id-ID")}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="mb-3 font-medium text-gray-900">
            Upcoming Interviews
          </h2>
          {summary.upcomingInterviews.length === 0 && (
            <p className="text-sm text-gray-400">
              Tidak ada interview terjadwal.
            </p>
          )}
          <ul className="space-y-2">
            {summary.upcomingInterviews.map((iv) => (
              <li key={iv.id} className="text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">
                    {iv.application.company}
                  </span>
                  <span className="text-gray-400">{TYPE_LABELS[iv.type]}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(iv.scheduledAt).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="mb-3 font-medium text-gray-900">
            Recent Applications
          </h2>
          <ul className="space-y-2">
            {summary.recentApplications.map((app) => (
              <li key={app.id} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {app.company} — {app.position}
                </span>
                <span className="text-gray-400">
                  {STATUS_LABELS[app.status]}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
