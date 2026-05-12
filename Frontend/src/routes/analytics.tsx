import { createFileRoute } from "@tanstack/react-router";
import { useStore, memberStats } from "@/store/useStore";
import { GlassCard } from "@/components/GlassCard";
import { WeeklyChart, MonthlyChart, TopicPie } from "@/components/Charts";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — DSA Tracker" },
      { name: "description", content: "Group analytics: weekly bars, monthly trends, and topic distribution." },
      { property: "og:title", content: "DSA Tracker Analytics" },
      { property: "og:description", content: "Visualize your group's DSA momentum." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { members, attendance, trackingStart, questions } = useStore();
  const allStats = members.map((m) => ({ m, s: memberStats(m.id, attendance, trackingStart) }));
  const solvedRate = Math.round((questions.filter((q) => q.solved).length / Math.max(1, questions.length)) * 100);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-2">Patterns, rhythms, and topic spread across the group.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 mb-6">
        <GlassCard hover={false} className="lg:col-span-2">
          <h3 className="font-semibold mb-3">Weekly attendance</h3>
          <WeeklyChart />
        </GlassCard>
        <GlassCard hover={false}>
          <h3 className="font-semibold mb-3">Topic distribution</h3>
          <TopicPie />
        </GlassCard>
      </div>

      <GlassCard hover={false} className="mb-6">
        <h3 className="font-semibold mb-3">Last 30 days</h3>
        <MonthlyChart />
      </GlassCard>

      <GlassCard hover={false} className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Per-member breakdown</h3>
          <span className="text-xs text-muted-foreground">Question solved rate · {solvedRate}%</span>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-white/5">
                <th className="text-left py-2.5 pr-4">Member</th>
                <th className="text-right py-2.5 px-4">Total</th>
                <th className="text-right py-2.5 px-4">Streak</th>
                <th className="text-right py-2.5 px-4">Longest</th>
                <th className="text-right py-2.5 px-4">Week</th>
                <th className="text-right py-2.5 px-4">Month</th>
                <th className="text-right py-2.5 pl-4">Rate</th>
              </tr>
            </thead>
            <tbody>
              {allStats.map(({ m, s }) => (
                <tr key={m.id} className="border-b border-white/5 last:border-0">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2.5">
                      <img src={m.avatar} alt="" className="h-7 w-7 rounded-lg bg-surface" />
                      <span className="font-medium">{m.name}</span>
                    </div>
                  </td>
                  <td className="text-right tabular-nums px-4">{s.totalDays}</td>
                  <td className="text-right tabular-nums px-4">{s.currentStreak}d</td>
                  <td className="text-right tabular-nums px-4">{s.longestStreak}d</td>
                  <td className="text-right tabular-nums px-4">{s.weekly}/7</td>
                  <td className="text-right tabular-nums px-4">{s.monthly}d</td>
                  <td className="text-right tabular-nums pl-4">
                    <span className="inline-block w-12 text-right">{s.percentage}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
