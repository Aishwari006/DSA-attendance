import { useStore } from "@/store/useStore";
import { format, startOfWeek, addDays, parseISO, isWithinInterval, endOfWeek, subDays } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";

const tooltipStyle = {
  background: "oklch(0.18 0.025 265 / 0.95)",
  border: "1px solid oklch(1 0 0 / 0.1)",
  borderRadius: 12,
  fontSize: 12,
  color: "oklch(0.98 0.005 240)",
  backdropFilter: "blur(8px)",
};

export function WeeklyChart({ memberId }: { memberId?: string }) {
  const { attendance, members } = useStore();
  const records = memberId ? attendance.filter((a) => a.memberId === memberId) : attendance;
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });

  const data = Array.from({ length: 7 }).map((_, i) => {
    const d = addDays(start, i);
    const iso = format(d, "yyyy-MM-dd");
    const count = records.filter((r) => r.date === iso).length;
    return {
      day: format(d, "EEE"),
      count,
      max: memberId ? 1 : members.length,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <defs>
          <linearGradient id="barCyan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.85 0.18 215)" stopOpacity={0.95} />
            <stop offset="100%" stopColor="oklch(0.65 0.18 250)" stopOpacity={0.7} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" vertical={false} />
        <XAxis dataKey="day" stroke="oklch(0.7 0.03 250)" fontSize={11} axisLine={false} tickLine={false} />
        
        {/* FIX: Added domain to strictly cap the Y-Axis at the number of members */}
        <YAxis 
          stroke="oklch(0.7 0.03 250)" 
          fontSize={11} 
          axisLine={false} 
          tickLine={false} 
          allowDecimals={false} 
          domain={[0, memberId ? 1 : members.length]} 
        />
        
        <Tooltip cursor={{ fill: "oklch(1 0 0 / 0.04)" }} contentStyle={tooltipStyle} />
        <Bar dataKey="count" fill="url(#barCyan)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MonthlyChart({ memberId }: { memberId?: string }) {
  const { attendance, members } = useStore();
  const records = memberId ? attendance.filter((a) => a.memberId === memberId) : attendance;
  const today = new Date();

  const data = Array.from({ length: 30 }).map((_, i) => {
    const d = subDays(today, 29 - i);
    const iso = format(d, "yyyy-MM-dd");
    const count = records.filter((r) => r.date === iso).length;
    return { day: format(d, "d"), count };
  });

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="lineCyan" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.78 0.16 210)" />
            <stop offset="100%" stopColor="oklch(0.65 0.18 250)" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" vertical={false} />
        <XAxis dataKey="day" stroke="oklch(0.7 0.03 250)" fontSize={11} axisLine={false} tickLine={false} interval={3} />
        
        {/* FIX: Also capped the monthly chart to match the number of members */}
        <YAxis 
          stroke="oklch(0.7 0.03 250)" 
          fontSize={11} 
          axisLine={false} 
          tickLine={false} 
          allowDecimals={false} 
          domain={[0, memberId ? 1 : members.length]} 
        />
        
        <Tooltip contentStyle={tooltipStyle} />
        <Line
          type="monotone"
          dataKey="count"
          stroke="url(#lineCyan)"
          strokeWidth={2.5}
          dot={{ r: 0 }}
          activeDot={{ r: 5, fill: "oklch(0.85 0.18 215)", strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function TopicPie() {
  const { questions } = useStore();
  const map: Record<string, number> = {};
  questions.forEach((q) => (map[q.topic] = (map[q.topic] || 0) + 1));
  const data = Object.entries(map).map(([name, value]) => ({ name, value }));
  const colors = ["oklch(0.78 0.16 210)", "oklch(0.65 0.18 250)", "oklch(0.85 0.18 215)", "oklch(0.72 0.18 160)", "oklch(0.78 0.18 70)", "oklch(0.7 0.2 320)"];

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={3}>
          {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} stroke="transparent" />)}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 11, color: "oklch(0.7 0.03 250)" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function AttendanceHeatmap({ memberId }: { memberId: string }) {
  const { attendance } = useStore();
  const dateSet = new Set(attendance.filter((a) => a.memberId === memberId).map((a) => a.date));
  const today = new Date();
  const days = 84; // 12 weeks
  const start = subDays(today, days - 1);
  // Align to Monday
  const startDay = (start.getDay() + 6) % 7;
  const cells: { date: Date | null; iso: string | null }[] = [];
  for (let i = 0; i < startDay; i++) cells.push({ date: null, iso: null });
  for (let i = 0; i < days; i++) {
    const d = addDays(start, i);
    cells.push({ date: d, iso: format(d, "yyyy-MM-dd") });
  }

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <div className="inline-grid grid-flow-col grid-rows-7 gap-1.5">
        {cells.map((c, i) => {
          if (!c.iso) return <div key={i} className="h-3.5 w-3.5" />;
          const has = dateSet.has(c.iso);
          const isToday = c.iso === format(today, "yyyy-MM-dd");
          return (
            <div
              key={i}
              title={`${c.iso}${has ? " · attended" : ""}`}
              className={
                "h-3.5 w-3.5 rounded-[3px] " +
                (has ? "bg-cyan/70" : "bg-white/5") +
                (isToday ? " ring-1 ring-cyan" : "")
              }
            />
          );
        })}
      </div>
    </div>
  );
}