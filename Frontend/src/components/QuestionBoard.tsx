import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ThumbsUp, Check, Trash2, Pencil, X, Plus, Search } from "lucide-react";
import { useStore } from "@/store/useStore";
import { GlassCard } from "./GlassCard";
import type { Question } from "@/data/mock";
import { cn } from "@/lib/utils";
import { api } from "@/services/api";

const PLATFORMS = ["LeetCode",  "GFG","Codeforces", "CodeChef"] as const;
const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

const diffColor: Record<string, string> = {
  Easy: "bg-success/15 text-success border-success/30",
  Medium: "bg-warning/15 text-warning border-warning/30",
  Hard: "bg-destructive/15 text-destructive border-destructive/30",
};

const platColor: Record<string, string> = {
  LeetCode: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Codeforces: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  CodeChef: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  GFG: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

const refreshQuestions = async () => {
  const data = await api.getQuestions();
  useStore.getState().setQuestions(data as any);
};

export function QuestionBoard() {
  const { questions, members } = useStore();
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState<string>("All");
  const [difficulty, setDifficulty] = useState<string>("All");
  const [topic, setTopic] = useState<string>("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Question | null>(null);

  const topics = Array.from(new Set(questions.map((q) => q.topic)));

  const filtered = questions.filter(
    (q) =>
      q.title.toLowerCase().includes(search.toLowerCase()) &&
      (platform === "All" || q.platform === platform) &&
      (difficulty === "All" || q.difficulty === difficulty) &&
      (topic === "All" || q.topic === topic),
  );

  const memberName = (id: string) => members.find((m) => m.id === id)?.name ?? "Unknown";

  const handleUpvote = async (q: Question) => {
    await api.updateQuestion(q.id, { upvotes: q.upvotes + 1 });
    refreshQuestions();
  };

  const handleToggleSolved = async (q: Question) => {
    await api.updateQuestion(q.id, { solved: !q.solved });
    refreshQuestions();
  };

  const handleDelete = async (id: string) => {
    await api.deleteQuestion(id);
    refreshQuestions();
  };

  return (
    <div className="space-y-5">
      {/* Filters */}
      <GlassCard hover={false} className="flex flex-col lg:flex-row gap-3 lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems by title…"
            className="w-full rounded-xl bg-white/5 border border-white/10 pl-9 pr-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan/40"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={platform} onChange={setPlatform} options={["All", ...PLATFORMS]} />
          <Select value={difficulty} onChange={setDifficulty} options={["All", ...DIFFICULTIES]} />
          <Select value={topic} onChange={setTopic} options={["All", ...topics]} />
          <button
            onClick={() => { setEditing(null); setModalOpen(true); }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan to-blue-soft text-primary-foreground px-3.5 py-2 text-sm font-medium shadow-lg shadow-cyan/20 hover:shadow-cyan/40 transition"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </GlassCard>

      {/* List */}
      <div className="grid gap-3 md:grid-cols-2">
        <AnimatePresence>
          {filtered.map((q, i) => (
            <motion.div
              key={q.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
              className="glass rounded-2xl p-4 hover:border-cyan/20 hover:shadow-xl hover:shadow-cyan/10 transition group"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <a href={q.url} target="_blank" rel="noreferrer" className="font-semibold hover:text-cyan transition inline-flex items-center gap-1.5">
                    {q.title}
                    <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                  </a>
                  <div className="text-xs text-muted-foreground mt-1">
                    Added by {memberName(q.addedBy)} · {q.dateAdded}
                  </div>
                </div>
                {q.solved && (
                  <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-success/15 text-success border border-success/30 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider">
                    <Check className="h-3 w-3" /> Solved
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 mb-2.5">
                <Badge className={platColor[q.platform]}>{q.platform}</Badge>
                <Badge className={diffColor[q.difficulty]}>{q.difficulty}</Badge>
                <Badge className="bg-white/5 text-muted-foreground border-white/10">{q.topic}</Badge>
              </div>

              {q.notes && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{q.notes}</p>}

              <div className="flex items-center justify-between border-t border-white/5 pt-2.5">
                <button
                  onClick={() => handleUpvote(q)}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-cyan transition"
                >
                  <ThumbsUp className="h-3.5 w-3.5" /> {q.upvotes}
                </button>
                <div className="flex items-center gap-1">
                  <IconBtn onClick={() => handleToggleSolved(q)} title={q.solved ? "Mark unsolved" : "Mark solved"}>
                    <Check className={cn("h-4 w-4", q.solved && "text-success")} />
                  </IconBtn>
                  <IconBtn onClick={() => { setEditing(q); setModalOpen(true); }} title="Edit">
                    <Pencil className="h-4 w-4" />
                  </IconBtn>
                  <IconBtn onClick={() => handleDelete(q.id)} title="Delete">
                    <Trash2 className="h-4 w-4 hover:text-destructive" />
                  </IconBtn>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <GlassCard hover={false} className="text-center py-12 text-muted-foreground">
          No questions match your filters.
        </GlassCard>
      )}

      <AnimatePresence>
        {modalOpen && <QuestionModal initial={editing} onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: readonly string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan/40"
    >
      {options.map((o) => (
        <option key={o} value={o} className="bg-surface">{o}</option>
      ))}
    </select>
  );
}

function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider", className)}>{children}</span>;
}

function IconBtn({ children, onClick, title }: { children: React.ReactNode; onClick: () => void; title?: string }) {
  return (
    <button onClick={onClick} title={title} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition">
      {children}
    </button>
  );
}

function QuestionModal({ initial, onClose }: { initial: Question | null; onClose: () => void }) {
  const { members } = useStore();
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    platform: initial?.platform ?? "LeetCode",
    difficulty: initial?.difficulty ?? "Medium",
    topic: initial?.topic ?? "",
    url: initial?.url ?? "",
    notes: initial?.notes ?? "",
    addedBy: initial?.addedBy ?? members[0]?.id ?? "",
  });

  const submit = async () => {
    if (!form.title.trim()) return;
    try {
      if (initial) {
        await api.updateQuestion(initial.id, form as Partial<Question>);
      } else {
        await api.addQuestion({
          ...form,
          dateAdded: new Date().toISOString().split("T")[0],
          upvotes: 0,
          solved: false,
        } as Omit<Question, "id">);
      }
      refreshQuestions();
      onClose();
    } catch (error) {
      console.error("Failed to save question:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong rounded-2xl w-full max-w-lg p-6 shadow-2xl shadow-cyan/10"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold">{initial ? "Edit question" : "Add a question"}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5"><X className="h-4 w-4" /></button>
        </div>

        <div className="grid gap-3">
          <Field label="Title">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Platform">
              <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value as Question["platform"] })} className={inputCls}>
                {PLATFORMS.map((p) => <option key={p} value={p} className="bg-surface">{p}</option>)}
              </select>
            </Field>
            <Field label="Difficulty">
              <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as Question["difficulty"] })} className={inputCls}>
                {DIFFICULTIES.map((d) => <option key={d} value={d} className="bg-surface">{d}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Topic">
              <input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Added by">
              <select value={form.addedBy} onChange={(e) => setForm({ ...form, addedBy: e.target.value })} className={inputCls}>
                {members.map((m) => <option key={m.id} value={m.id} className="bg-surface">{m.name}</option>)}
              </select>
            </Field>
          </div>
          <Field label="URL">
            <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className={inputCls} placeholder="https://" />
          </Field>
          <Field label="Notes">
            <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={inputCls} />
          </Field>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="rounded-xl px-4 py-2 text-sm border border-white/10 hover:bg-white/5">Cancel</button>
          <button onClick={submit} className="rounded-xl bg-gradient-to-r from-cyan to-blue-soft text-primary-foreground px-4 py-2 text-sm font-medium shadow-lg shadow-cyan/20">
            {initial ? "Save changes" : "Add question"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

const inputCls =
  "w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan/40";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">{label}</div>
      {children}
    </label>
  );
}