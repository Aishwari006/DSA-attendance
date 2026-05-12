import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Users, Flame, TrendingUp, CalendarCheck } from "lucide-react";
import { useStore, memberStats } from "@/store/useStore";
import { MemberCard } from "@/components/MemberCard";
import { GlassCard } from "@/components/GlassCard";
import { WeeklyChart, MonthlyChart } from "@/components/Charts";
import { format } from "date-fns";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — DSA Tracker" },
      { name: "description", content: "Group dashboard with daily DSA attendance, streaks, and weekly progress." },
      { property: "og:title", content: "DSA Tracker Dashboard" },
      { property: "og:description", content: "See everyone's daily DSA progress in one place." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { members, attendance, trackingStart } = useStore();
  const allStats = members.map((m) => memberStats(m.id, attendance, trackingStart));

  const totalDays = allStats.reduce((s, x) => s + x.totalDays, 0);
  const avgPercentage = Math.round(allStats.reduce((s, x) => s + x.percentage, 0) / allStats.length);
  const monthSum = allStats.reduce((s, x) => s + x.monthly, 0);
  const today = format(new Date(), "yyyy-MM-dd");
  const todayCount = attendance.filter((a) => a.date === today).length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          {todayCount}/{members.length} marked today · {format(new Date(), "EEEE, MMM d")}
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Building <span className="text-gradient-cyan">DSA habits</span>,
          <br className="hidden sm:block" /> together every day.
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          A shared streak hub for the squad. Mark your day, watch the team's momentum grow, and save the problems worth talking about.
        </p>
      </motion.div>

      {/* Top stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Kpi icon={<Users className="h-4 w-4" />} label="Active members" value={members.length} />
        <Kpi icon={<CalendarCheck className="h-4 w-4" />} label="Days logged (90d)" value={totalDays} />
        <Kpi icon={<TrendingUp className="h-4 w-4" />} label="Avg attendance" value={`${avgPercentage}%`} />
        <Kpi icon={<Flame className="h-4 w-4 text-warning" />} label="This month" value={`${monthSum}d`} />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-5 mb-10">
        <GlassCard className="lg:col-span-2" hover={false}>
          <SectionTitle title="This week" subtitle="Group attendance per day" />
          <WeeklyChart />
        </GlassCard>
        <GlassCard className="lg:col-span-3" hover={false}>
          <SectionTitle title="Last 30 days" subtitle="Daily attendance trend" />
          <MonthlyChart />
        </GlassCard>
      </div>

      {/* Members */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">The squad</h2>
          <p className="text-sm text-muted-foreground">Everyone's progress, side by side. No rankings, just rhythm.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {members.map((m, i) => (
          <MemberCard key={m.id} member={m} index={i} />
        ))}
      </div>
    </div>
  );
}

function Kpi({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <GlassCard className="flex items-center justify-between" delay={0.05}>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5">
          {icon} {label}
        </div>
        <div className="text-2xl font-semibold tabular-nums mt-1">{value}</div>
      </div>
      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan/20 to-blue-soft/10 border border-cyan/20 grid place-items-center text-cyan">
        {icon}
      </div>
    </GlassCard>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-3">
      <h3 className="font-semibold">{title}</h3>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
