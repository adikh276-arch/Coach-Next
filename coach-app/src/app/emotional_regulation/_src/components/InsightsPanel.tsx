import { useState } from "react";
import { BarChart3, TrendingUp, Zap, ShieldCheck, ChevronDown } from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import type { TrackerEntry } from "@/lib/storage";

interface Props {
  entries: TrackerEntry[];
  showLabel?: string;
  hideLabel?: string;
  lockedMessage?: string;
  lockedBold?: string;
  avgStabilityLabel?: string;
  avgStressLabel?: string;
  challengeRatioLabel?: string;
  stabilityTitle?: string;
  stressTitle?: string;
  insightsDescription?: string;
}

const InsightsPanel = ({
  entries,
  showLabel = "Show Insights",
  hideLabel = "Hide Insights",
  lockedMessage = "Log at least 3 days to unlock emotional insights.",
  lockedBold = "3 days",
  avgStabilityLabel = "Avg Stability",
  avgStressLabel = "Avg Stress",
  challengeRatioLabel = "Challenges",
  stabilityTitle = "Emotional Stability",
  stressTitle = "Stress Intensity",
  insightsDescription = "Based on your logged entries — averages and trends over time.",
}: Props) => {
  const [open, setOpen] = useState(false);

  if (entries.length < 3) {
    return (
      <div className="mt-4 glass-card rounded-2xl border border-border/60 p-8 text-center shadow-card transition-smooth hover:shadow-card-hover">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent mb-3">
          <BarChart3 className="h-5 w-5 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
          {lockedMessage}
        </p>
      </div>
    );
  }

  const sorted = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const chartData = sorted.map((e) => ({
    date: e.date.slice(5),
    Stability: e.stability,
    Stress: e.stress,
  }));

  const avgStability = (
    sorted.reduce((s, e) => s + Number(e.stability), 0) / sorted.length
  ).toFixed(1);
  const avgStress = (
    sorted.reduce((s, e) => s + Number(e.stress), 0) / sorted.length
  ).toFixed(1);
  
  // Show challenge ratio as X/N instead of percentage
  const challengeCount = sorted.filter((e) => e.challengingSituation).length;
  const totalCount = sorted.length;
  const challengeRatio = `${challengeCount}/${totalCount}`;

  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl glass-card border border-border/60 text-sm font-bold text-foreground shadow-card hover:shadow-card-hover transition-all duration-300 group hover:-translate-y-0.5 active:translate-y-0"
      >
        <BarChart3 className="h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-200" />
        {open ? hideLabel : showLabel}
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="mt-5 space-y-5 animate-in fade-in slide-in-from-top-3 duration-400">
          {/* Description */}
          <p className="text-xs text-muted-foreground text-center italic">{insightsDescription}</p>
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3">
            <SummaryCard
              icon={<TrendingUp className="h-4 w-4 text-primary" />}
              label={avgStabilityLabel}
              value={avgStability}
              gradient="from-accent to-violet-light/30"
            />
            <SummaryCard
              icon={<Zap className="h-4 w-4 text-destructive" />}
              label={avgStressLabel}
              value={avgStress}
              gradient="from-destructive/5 to-destructive/10"
            />
            <SummaryCard
              icon={<ShieldCheck className="h-4 w-4 text-warm" />}
              label={challengeRatioLabel}
              value={challengeRatio}
              subtitle="days"
              gradient="from-warm-light to-warm-light/50"
            />
          </div>

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard title={stabilityTitle} data={chartData} dataKey="Stability" color="hsl(252, 62%, 55%)" />
            <ChartCard title={stressTitle} data={chartData} dataKey="Stress" color="hsl(0, 72%, 51%)" />
          </div>
        </div>
      )}
    </div>
  );
};

function SummaryCard({ icon, label, value, gradient, subtitle }: { icon: React.ReactNode; label: string; value: string; gradient: string; subtitle?: string }) {
  return (
    <div className={`rounded-2xl border border-border/60 bg-gradient-to-br ${gradient} p-4 text-center shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5`}>
      <div className="flex justify-center mb-2">{icon}</div>
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-extrabold text-foreground mt-1">{value}</p>
      {subtitle && <p className="text-[10px] text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function ChartCard({
  title,
  data,
  dataKey,
  color,
}: {
  title: string;
  data: { date: string }[];
  dataKey: string;
  color: string;
}) {
  return (
    <div className="glass-card rounded-2xl border border-border/60 p-5 shadow-card transition-all duration-300 hover:shadow-card-hover">
      <h3 className="text-xs font-bold text-muted-foreground mb-4 uppercase tracking-widest">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.15} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(230, 16%, 93%)" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(230, 14%, 70%)" axisLine={false} tickLine={false} />
          <YAxis domain={[1, 10]} tick={{ fontSize: 11 }} stroke="hsl(230, 14%, 70%)" axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: "1rem",
              border: "1px solid hsl(230, 16%, 91%)",
              fontSize: "13px",
              boxShadow: "0 8px 25px -5px rgba(100,60,180,0.08)",
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(8px)",
            }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#gradient-${dataKey})`}
            dot={{ r: 4, fill: "white", stroke: color, strokeWidth: 2 }}
            activeDot={{ r: 6, fill: color, stroke: "white", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default InsightsPanel;
