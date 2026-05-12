import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Flame, CheckCircle2, ArrowUpRight, Calendar } from "lucide-react";
import { useStore, memberStats, markedToday } from "@/store/useStore";
import { GlassCard } from "./GlassCard";
import { toast } from "sonner";
import type { Member } from "@/data/mock";
import { api } from "@/services/api";

export function MemberCard({ member, index }: { member: Member; index: number }) {
  const { attendance, trackingStart, markAttendance } = useStore();
  const stats = memberStats(member.id, attendance, trackingStart);
  const done = markedToday(member.id, attendance);

  const handleMark = async() => {
    try {
    const today = new Date().toISOString().slice(0, 10);
    await api.postAttendance(member.id, today);

    const updatedAttendance = await api.getAttendance();
    useStore.getState().setAttendance(updatedAttendance as any);

    toast.success("Attendance marked successfully!");
  } catch (error) {
    toast.error("Attendance already marked for today.");
  }
  };

  return (
    <GlassCard delay={index * 0.05} className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={member.avatar}
              alt={member.name}
              className="h-12 w-12 rounded-xl bg-surface object-cover ring-2 ring-white/10"
            />
            {done && (
              <span className="absolute -right-1 -bottom-1 grid h-5 w-5 place-items-center rounded-full bg-success text-background">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
          <div>
            <div className="font-semibold leading-tight">{member.name}</div>
            <div className="text-xs text-muted-foreground">{member.favoriteTopic}</div>
          </div>
        </div>
        <Link
          to="/members/$memberId"
          params={{ memberId: member.id }}
          className="rounded-lg p-1.5 text-muted-foreground hover:text-cyan hover:bg-white/5 transition"
          aria-label="Open profile"
        >
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Stat label="Total" value={stats.totalDays} suffix="d" />
        <Stat label="Streak" value={stats.currentStreak} icon={<Flame className="h-3 w-3 text-warning" />} />
        <Stat label="Rate" value={stats.percentage} suffix="%" />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" /> Week {stats.weekly}/7
        </span>
        <span>Month {stats.monthly}d</span>
      </div>

      {/* Week dots */}
      <WeekDots memberId={member.id} />

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleMark}
        disabled={done}
        className={
          "relative overflow-hidden rounded-xl px-4 py-2.5 text-sm font-medium transition " +
          (done
            ? "bg-success/15 text-success border border-success/30 cursor-default"
            : "bg-gradient-to-r from-cyan to-blue-soft text-primary-foreground shadow-lg shadow-cyan/20 hover:shadow-cyan/40")
        }
      >
        {done ? "✓ Marked for today" : "Mark today complete"}
      </motion.button>
    </GlassCard>
  );
}

function Stat({ label, value, suffix, icon }: { label: string; value: number; suffix?: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white/3 border border-white/5 px-2.5 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
        {icon} {label}
      </div>
      <div className="text-lg font-semibold tabular-nums">
        {value}
        {suffix && <span className="text-xs text-muted-foreground ml-0.5">{suffix}</span>}
      </div>
    </div>
  );
}

function WeekDots({ memberId }: { memberId: string }) {
  const { attendance } = useStore();
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const dateSet = new Set(attendance.filter((a) => a.memberId === memberId).map((a) => a.date));

  return (
    <div className="flex items-center justify-between">
      {days.map((d, i) => {
        const day = new Date(monday);
        day.setDate(monday.getDate() + i);
        const iso = day.toISOString().slice(0, 10);
        const has = dateSet.has(iso);
        const isToday = iso === today.toISOString().slice(0, 10);
        return (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className={
                "h-7 w-7 rounded-md grid place-items-center text-[10px] font-medium border " +
                (has
                  ? "bg-cyan/20 border-cyan/40 text-cyan"
                  : "bg-white/3 border-white/5 text-muted-foreground") +
                (isToday ? " ring-1 ring-cyan/60" : "")
              }
            >
              {d}
            </div>
          </div>
        );
      })}
    </div>
  );
}
