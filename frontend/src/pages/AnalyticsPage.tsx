import { useEffect, useState } from "react";
import { analyticsService } from "../services/analyticsService";
import type { AnalyticsSummary } from "../types/analytics.types";
import { STATUS_LABELS } from "../types/application.types";
import { TYPE_LABELS, INTERVIEW_STATUS_LABELS } from "../types/interview.types";

function monthLabel(key: string) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("id-ID", {
    month: "short",
    year: "2-digit",
  });
}

function BarRow({
  label,
  count,
  max,
}: {
  label: string;
  count: number;
  max: number;
}) {
  const width = max === 0 ? 0 : Math.round((count / max) * 100);
  return (
    <div className="mb-2">
      <div className="mb-1 flex justify-between text-xs text-gray-600">
        <span>{label}</span>
        <span className="font-medium text-gray-900">{count}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100">
        <div
          className="h-2 rounded-full bg-gray-900"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    analyticsService
      .getSummary()
      .then(setData)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <p className="text-gray-500">Memuat analytics...</p>;
  if (!data)
    return <p className="text-red-500">Gagal memuat data analytics.</p>;

  const maxMonthly = Math.max(
    1,
    ...data.applicationsOverTime.map((m) => m.count),
  );
  const maxStatus = Math.max(1, ...Object.values(data.statusDistribution));
  const maxCompany = Math.max(1, ...data.topCompanies.map((c) => c.count));
  const maxInterviewType = Math.max(1, ...Object.values(data.interviewsByType));
  const maxInterviewStatus = Math.max(
    1,
    ...Object.values(data.interviewsByStatus),
  );

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Analytics</h1>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Offer Rate</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">
            {data.offerRate}%
          </p>
          <p className="mt-1 text-xs text-gray-400">
            dari application yang sudah diajukan (bukan wishlist)
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Total Interview</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">
            {data.totalInterviews}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            sepanjang riwayat pencarian kerja Anda
          </p>
        </div>
      </div>

      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-4 font-medium text-gray-900">
          Applications per Bulan (6 bulan terakhir)
        </h2>
        <div className="flex h-40 items-end gap-3">
          {data.applicationsOverTime.map((m) => (
            <div
              key={m.month}
              className="flex flex-1 flex-col items-center gap-1"
            >
              <span className="text-xs text-gray-500">{m.count}</span>
              <div
                className="w-full rounded-t-md bg-gray-900"
                style={{
                  height: `${Math.max(4, (m.count / maxMonthly) * 100)}%`,
                }}
              />
              <span className="text-xs text-gray-400">
                {monthLabel(m.month)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="mb-4 font-medium text-gray-900">
            Status Distribution
          </h2>
          {Object.entries(data.statusDistribution).map(([status, count]) => (
            <BarRow
              key={status}
              label={STATUS_LABELS[status as keyof typeof STATUS_LABELS]}
              count={count}
              max={maxStatus}
            />
          ))}
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="mb-4 font-medium text-gray-900">Top Companies</h2>
          {data.topCompanies.length === 0 ? (
            <p className="text-sm text-gray-400">Belum ada data.</p>
          ) : (
            data.topCompanies.map((c) => (
              <BarRow
                key={c.company}
                label={c.company}
                count={c.count}
                max={maxCompany}
              />
            ))
          )}
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="mb-4 font-medium text-gray-900">Interview by Type</h2>
          {Object.entries(data.interviewsByType).map(([type, count]) => (
            <BarRow
              key={type}
              label={TYPE_LABELS[type as keyof typeof TYPE_LABELS]}
              count={count}
              max={maxInterviewType}
            />
          ))}
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="mb-4 font-medium text-gray-900">
            Interview by Status
          </h2>
          {Object.entries(data.interviewsByStatus).map(([status, count]) => (
            <BarRow
              key={status}
              label={
                INTERVIEW_STATUS_LABELS[
                  status as keyof typeof INTERVIEW_STATUS_LABELS
                ]
              }
              count={count}
              max={maxInterviewStatus}
            />
          ))}
        </section>
      </div>
    </div>
  );
}
