import { create } from "zustand";
import { format, isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth, parseISO, differenceInCalendarDays, subDays } from "date-fns";
import type { AttendanceRecord, Member, Question } from "@/data/mock";

type State = {
  members: Member[];
  attendance: AttendanceRecord[];
  questions: Question[];
  trackingStart: Date;
  markAttendance: (memberId: string) => boolean;
  addQuestion: (q: Omit<Question, "id" | "dateAdded" | "upvotes" | "solved">) => void;
  updateQuestion: (id: string, patch: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  toggleSolved: (id: string) => void;
  upvote: (id: string) => void;
  setMembers: (members: Member[]) => void;
  setAttendance: (attendance: AttendanceRecord[]) => void;
  setQuestions: (questions: Question[]) => void;
};

export const useStore = create<State>((set) => ({
  members: [],
  attendance: [],
  questions: [],
  trackingStart: subDays(new Date(), 90),
  
  markAttendance: (memberId) => {
    const today = format(new Date(), "yyyy-MM-dd");
    let added = false;
    set((s) => {
      const exists = s.attendance.some((a) => a.memberId === memberId && a.date === today);
      if (exists) return s;
      added = true;
      return { attendance: [...s.attendance, { memberId, date: today }] };
    });
    return added;
  },
  
  addQuestion: (q) =>
    set((s) => ({
      questions: [
        {
          ...q,
          id: `q_${Date.now()}`,
          dateAdded: format(new Date(), "yyyy-MM-dd"),
          upvotes: 0,
          solved: false,
        },
        ...s.questions,
      ],
    })),
    
  updateQuestion: (id, patch) =>
    set((s) => ({ questions: s.questions.map((q) => (q.id === id ? { ...q, ...patch } : q)) })),
    
  deleteQuestion: (id) => set((s) => ({ questions: s.questions.filter((q) => q.id !== id) })),
  
  toggleSolved: (id) =>
    set((s) => ({ questions: s.questions.map((q) => (q.id === id ? { ...q, solved: !q.solved } : q)) })),
    
  upvote: (id) => set((s) => ({ questions: s.questions.map((q) => (q.id === id ? { ...q, upvotes: q.upvotes + 1 } : q)) })),
  
  setMembers: (members) => set({ members }),
  setAttendance: (attendance) => set({ attendance }),
  setQuestions: (questions) => set({ questions }),
}));

// Selectors / helpers
export function memberStats(memberId: string, attendance: AttendanceRecord[], trackingStart: Date) {
  const today = new Date();
  const dates = attendance.filter((a) => a.memberId === memberId).map((a) => a.date);
  const dateSet = new Set(dates);

  const totalDays = dates.length;

  // Streak: consecutive days ending today (or yesterday)
  let currentStreak = 0;
  for (let i = 0; ; i++) {
    const d = format(subDays(today, i), "yyyy-MM-dd");
    if (dateSet.has(d)) currentStreak++;
    else if (i === 0) continue; // allow today not yet marked
    else break;
  }

  // Longest streak
  const sorted = [...dates].sort();
  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of sorted) {
    if (prev && differenceInCalendarDays(parseISO(d), parseISO(prev)) === 1) run++;
    else run = 1;
    longest = Math.max(longest, run);
    prev = d;
  }

  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);

  const weekly = dates.filter((d) => isWithinInterval(parseISO(d), { start: weekStart, end: weekEnd })).length;
  const monthly = dates.filter((d) => isWithinInterval(parseISO(d), { start: monthStart, end: monthEnd })).length;

  const totalTrackedDays = Math.max(1, differenceInCalendarDays(today, trackingStart) + 1);
  const percentage = Math.round((totalDays / totalTrackedDays) * 100);

  return { totalDays, currentStreak, longestStreak: longest, weekly, monthly, percentage, dateSet };
}

export function markedToday(memberId: string, attendance: AttendanceRecord[]) {
  const today = format(new Date(), "yyyy-MM-dd");
  return attendance.some((a) => a.memberId === memberId && a.date === today);
}