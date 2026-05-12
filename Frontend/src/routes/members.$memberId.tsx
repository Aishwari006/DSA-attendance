import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Flame, Trophy, Target, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useStore, memberStats, markedToday } from "@/store/useStore";
import { GlassCard } from "@/components/GlassCard";
import { WeeklyChart, MonthlyChart, AttendanceHeatmap } from "@/components/Charts";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

export const Route = createFileRoute("/members/$memberId")({
  head: ({ params }) => ({
    meta: [
      { title: `Member · ${params.memberId} — DSA Tracker` },
      { name: "description", content: "Detailed member profile with attendance heatmap, streaks, and recent activity." },
    ],
  }),
  component: MemberProfile,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h1 className="text-2xl font-semibold">Member not found</h1>
      <Link to="/" className="mt-4 inline-block text-cyan hover:underline">Back to dashboard</Link>
    </div>
  ),
});

function MemberProfile() {
  const { memberId } = Route.useParams();
  const { members, attendance, trackingStart, markAttendance } = useStore();
  const member = members.find((m) => m.id === memberId);
  if (!member) throw notFound();

  const stats = memberStats(member.id, attendance, trackingStart);
  const done = markedToday(member.id, attendance);

  const recent = attendance
    .filter((a) => a.memberId === member.id)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7);

  const handleMark = () => {
    const ok = markAttendance(member.id);
    if (ok) toast.success("Day logged. Streak extended!");
    else toast.message("Already marked for today");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="glass-strong rounded-3xl p-6 sm:p-8 mb-6 relative overflow-hidden"
      >
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-cyan/20 to-transparent blur-3xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-5 justify-between">
          <div className="flex items-center gap-4">
            <img src={member.avatar} alt={member.name} className="h-20 w-20 rounded-2xl bg-surface ring-2 ring-cyan/30 shadow-lg shadow-cyan/20" />
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-cyan font-medium">Member profile</div>
              <h1 className="text-3xl font-bold mt-0.5">{member.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Loves <span className="text-foreground">{member.favoriteTopic}</span> · {member.solvedCount} problems solved
              </p>
            </div>
          </div>
          <button
            onClick={handleMark}
            disabled={done}
            className={
              "rounded-xl px-5 py-3 text-sm font-medium transition " +
              (done
                ? "bg-success/15 text-success border border-success/30 cursor-default"
                : "bg-gradient-to-r from-cyan to-blue-soft text-primary-foreground shadow-lg shadow-cyan/30 hover:shadow-cyan/50")
            }
          >
            {done ? "✓ Marked today" : "Mark today complete"}
          </button>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Stat icon={<Target className="h-4 w-4" />} label="Total days" value={stats.totalDays} />
        <Stat icon={<Flame className="h-4 w-4 text-warning" />} label="Current streak" value={`${stats.currentStreak}d`} />
        <Stat icon={<Trophy className="h-4 w-4 text-warning" />} label="Longest streak" value={`${stats.longestStreak}d`} />
        <Stat icon={<BookOpen className="h-4 w-4" />} label="Attendance" value={`${stats.percentage}%`} />
      </div>

      <GlassCard hover={false} className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Activity heatmap</h3>
            <p className="text-xs text-muted-foreground">Last 12 weeks of practice</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>less</span>
            <span className="h-3 w-3 rounded-sm bg-white/5" />
            <span className="h-3 w-3 rounded-sm bg-cyan/30" />
            <span className="h-3 w-3 rounded-sm bg-cyan/60" />
            <span className="h-3 w-3 rounded-sm bg-cyan" />
            <span>more</span>
          </div>
        </div>
        <AttendanceHeatmap memberId={member.id} />
      </GlassCard>

      <div className="grid gap-4 lg:grid-cols-2 mb-6">
        <GlassCard hover={false}>
          <h3 className="font-semibold mb-3">This week</h3>
          <WeeklyChart memberId={member.id} />
        </GlassCard>
        <GlassCard hover={false}>
          <h3 className="font-semibold mb-3">Last 30 days</h3>
          <MonthlyChart memberId={member.id} />
        </GlassCard>
      </div>

      <GlassCard hover={false}>
        <h3 className="font-semibold mb-3">Recent activity</h3>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity yet.</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {recent.map((r) => (
              <li key={r.date} className="flex items-center justify-between py-2.5 text-sm">
                <span>{format(parseISO(r.date), "EEEE, MMM d")}</span>
                <span className="text-success inline-flex items-center gap-1.5 text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" /> Practiced
                </span>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <GlassCard className="flex items-center justify-between" delay={0.05}>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5">{icon} {label}</div>
        <div className="text-2xl font-semibold tabular-nums mt-1">{value}</div>
      </div>
    </GlassCard>
  );
}
