import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import { useStore } from "@/store/useStore";
import { Info, Github, Heart } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — DSA Tracker" },
      { name: "description", content: "Group settings and member roster." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { members } = useStore();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Group preferences and roster.</p>
      </div>

      <GlassCard hover={false} className="mb-5">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-cyan/15 border border-cyan/30 grid place-items-center text-cyan shrink-0">
            <Info className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold">Open by design</h3>
            <p className="text-sm text-muted-foreground mt-1">
              No accounts, no logins. Anyone in your group can mark attendance, add questions, and view progress.
              Built for trust, not gates.
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard hover={false} className="mb-5">
        <h3 className="font-semibold mb-4">Roster ({members.length} members)</h3>
        <ul className="divide-y divide-white/5">
          {members.map((m) => (
            <li key={m.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <img src={m.avatar} alt="" className="h-10 w-10 rounded-xl bg-surface" />
                <div>
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.favoriteTopic} · {m.solvedCount} solved</div>
                </div>
              </div>
              <span className="text-xs rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-muted-foreground">Active</span>
            </li>
          ))}
        </ul>
      </GlassCard>

      <GlassCard hover={false}>
        <h3 className="font-semibold mb-2">About</h3>
        <p className="text-sm text-muted-foreground">
          DSA Tracker is a small, motivating space for friends to keep their daily DSA habit alive.
          The app uses mock data and is wired to swap in a real backend at <code className="text-cyan">src/services/api.ts</code>.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1">
            <Github className="h-3.5 w-3.5" /> React · TanStack · Tailwind v4
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1">
            <Heart className="h-3.5 w-3.5 text-cyan" /> Built for the squad
          </span>
        </div>
      </GlassCard>
    </div>
  );
}
