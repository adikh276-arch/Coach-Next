import { useState } from "react";
import { Clock, ChevronDown, Gauge, Flame, ShieldCheck, Target, MessageSquareText } from "lucide-react";
import type { TrackerEntry } from "@/lib/storage";

interface Props {
  entries: TrackerEntry[];
  showLabel?: string;
  hideLabel?: string;
  emptyLabel?: string;
  stabilityLabel?: string;
  stressLabel?: string;
  challengeLabel?: string;
  responseLabel?: string;
}

const HistoryPanel = ({
  entries,
  showLabel = "Show History",
  hideLabel = "Hide History",
  emptyLabel = "No entries yet. Start tracking today!",
  stabilityLabel = "Stability",
  stressLabel = "Stress",
  challengeLabel = "Challenge",
  responseLabel = "Response",
}: Props) => {
  const [open, setOpen] = useState(false);

  const sorted = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl glass-card border border-border/60 text-sm font-bold text-foreground shadow-card hover:shadow-card-hover transition-all duration-300 group hover:-translate-y-0.5 active:translate-y-0"
      >
        <Clock className="h-4 w-4 text-warm group-hover:scale-110 transition-transform duration-200" />
        {open ? hideLabel : showLabel}
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-3 duration-400">
          {sorted.length === 0 ? (
            <div className="glass-card rounded-2xl border border-border/60 p-8 text-center shadow-card">
              <Clock className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{emptyLabel}</p>
            </div>
          ) : (
            sorted.map((entry) => (
              <div
                key={entry.date}
                className="glass-card rounded-2xl border border-border/60 p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-primary bg-accent px-3 py-1 rounded-full">
                    {formatDate(entry.date)}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <MetricPill
                    icon={<Gauge className="h-3.5 w-3.5 text-primary" />}
                    label={stabilityLabel}
                    value={entry.stability}
                    colorClass="text-primary"
                  />
                  <MetricPill
                    icon={<Flame className="h-3.5 w-3.5 text-destructive" />}
                    label={stressLabel}
                    value={entry.stress}
                    colorClass="text-destructive"
                  />
                </div>

                {entry.challengingSituation && (
                  <div className="mt-3 flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-warm font-semibold">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {challengeLabel}: Yes
                    </div>
                    {entry.responseQuality && (
                      <div className="flex items-center gap-1.5 text-violet-dark font-semibold">
                        <Target className="h-3.5 w-3.5" />
                        {responseLabel}: {entry.responseQuality}
                      </div>
                    )}
                  </div>
                )}

                {entry.context && (
                  <p className="mt-2 text-xs text-muted-foreground italic leading-relaxed border-l-2 border-primary/20 pl-3">
                    "{entry.context}"
                  </p>
                )}

                {entry.thoughts && (
                  <div className="mt-3 flex items-start gap-2 text-xs text-muted-foreground bg-accent/30 rounded-lg px-3 py-2">
                    <MessageSquareText className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{entry.thoughts}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

function MetricPill({ icon, label, value, colorClass }: { icon: React.ReactNode; label: string; value: number; colorClass: string }) {
  return (
    <div className="flex items-center gap-2 bg-accent/40 rounded-xl px-3 py-2">
      {icon}
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
      <span className={`text-sm font-extrabold ${colorClass} ml-auto`}>{value}/10</span>
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export default HistoryPanel;
