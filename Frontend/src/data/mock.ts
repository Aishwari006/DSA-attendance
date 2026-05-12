// Mock data for the DSA Attendance Tracker
import { subDays, format } from "date-fns";

export type Member = {
  id: string;
  name: string;
  avatar: string;
  favoriteTopic: string;
  solvedCount: number;
};

export type AttendanceRecord = {
  memberId: string;
  date: string; // YYYY-MM-DD
};

export type Question = {
  id: string;
  title: string;
  platform: "LeetCode" | "Geeks for Geeks"| "Codeforces" | "CodeChef" ;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  url: string;
  notes: string;
  addedBy: string; // member id
  dateAdded: string;
  solved: boolean;
  upvotes: number;
};

const palettes = [
  "06B6D4",
  "3B82F6",
  "8B5CF6",
  "10B981",
  "F59E0B",
];

export const initialMembers: Member[] = [
  { id: "m1", name: "Aishwari Baksi", avatar: `https://api.dicebear.com/9.x/glass/svg?seed=Aarav&backgroundColor=${palettes[0]}`, favoriteTopic: "Dynamic Programming", solvedCount: 312 },
  { id: "m2", name: "Saumya Belgi", avatar: `https://api.dicebear.com/9.x/glass/svg?seed=Diya&backgroundColor=${palettes[1]}`, favoriteTopic: "Graphs", solvedCount: 268 },
  { id: "m3", name: "Harshada Pande", avatar: `https://api.dicebear.com/9.x/glass/svg?seed=Kabir&backgroundColor=${palettes[2]}`, favoriteTopic: "Trees", solvedCount: 245 },
  { id: "m4", name: "Harshada Dhas", avatar: `https://api.dicebear.com/9.x/glass/svg?seed=Ishita&backgroundColor=${palettes[3]}`, favoriteTopic: "Greedy", solvedCount: 198 },
  { id: "m5", name: "Dhanshree Gedam", avatar: `https://api.dicebear.com/9.x/glass/svg?seed=Rohan&backgroundColor=${palettes[4]}`, favoriteTopic: "Binary Search", solvedCount: 221 },
];

// Generate random-ish attendance over last 90 days
function genAttendance(): AttendanceRecord[] {
  const out: AttendanceRecord[] = [];
  const today = new Date();
  initialMembers.forEach((m, idx) => {
    // each member has different consistency
    const consistency = 0.55 + idx * 0.07; // 0.55 - 0.83
    for (let i = 0; i < 90; i++) {
      // recent days more likely
      const recencyBoost = i < 7 ? 0.15 : i < 30 ? 0.05 : 0;
      if (Math.random() < consistency + recencyBoost) {
        out.push({
          memberId: m.id,
          date: format(subDays(today, i), "yyyy-MM-dd"),
        });
      }
    }
  });
  return out;
}

export const initialAttendance: AttendanceRecord[] = genAttendance();

export const initialQuestions: Question[] = [
  {
    id: "q1",
    title: "Two Sum",
    platform: "LeetCode",
    difficulty: "Easy",
    topic: "Hash Map",
    url: "https://leetcode.com/problems/two-sum/",
    notes: "Classic intro to hash maps. Great warm-up.",
    addedBy: "m1",
    dateAdded: format(subDays(new Date(), 8), "yyyy-MM-dd"),
    solved: true,
    upvotes: 4,
  },
  {
    id: "q2",
    title: "Longest Substring Without Repeating Characters",
    platform: "LeetCode",
    difficulty: "Medium",
    topic: "Sliding Window",
    url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    notes: "Sliding window with set is the cleanest pattern.",
    addedBy: "m2",
    dateAdded: format(subDays(new Date(), 5), "yyyy-MM-dd"),
    solved: true,
    upvotes: 5,
  },
  {
    id: "q3",
    title: "Word Ladder",
    platform: "LeetCode",
    difficulty: "Hard",
    topic: "Graphs",
    url: "https://leetcode.com/problems/word-ladder/",
    notes: "BFS over implicit graph. Try bidirectional BFS for speed.",
    addedBy: "m3",
    dateAdded: format(subDays(new Date(), 3), "yyyy-MM-dd"),
    solved: false,
    upvotes: 7,
  },
  {
    id: "q4",
    title: "Dijkstra Shortest Path",
    platform: "Codeforces",
    difficulty: "Medium",
    topic: "Graphs",
    url: "https://codeforces.com/problemset/problem/20/C",
    notes: "Use priority_queue. Careful with long long.",
    addedBy: "m4",
    dateAdded: format(subDays(new Date(), 2), "yyyy-MM-dd"),
    solved: true,
    upvotes: 3,
  },
  {
    id: "q5",
    title: "Chef and Subarrays",
    platform: "CodeChef",
    difficulty: "Easy",
    topic: "Prefix Sum",
    url: "https://www.codechef.com/",
    notes: "Prefix sum + simple counting.",
    addedBy: "m5",
    dateAdded: format(subDays(new Date(), 1), "yyyy-MM-dd"),
    solved: false,
    upvotes: 2,
  },
  {
    id: "q6",
    title: "Edit Distance",
    platform: "LeetCode",
    difficulty: "Hard",
    topic: "Dynamic Programming",
    url: "https://leetcode.com/problems/edit-distance/",
    notes: "Bottom-up DP, watch base cases.",
    addedBy: "m1",
    dateAdded: format(subDays(new Date(), 12), "yyyy-MM-dd"),
    solved: true,
    upvotes: 6,
  },
];
