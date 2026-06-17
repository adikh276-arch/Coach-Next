import { Zap, RefreshCw, Flower2, Target } from "lucide-react";

const QUALITIES = ["Reactive", "Managed", "Composed", "Strategic"] as const;
export type ResponseQuality = (typeof QUALITIES)[number];

interface Props {
  value?: ResponseQuality;
  onChange: (value: ResponseQuality) => void;
  label?: string;
  description?: string;
  qualityLabels?: Record<ResponseQuality, string>;
}

const qualityConfig: Record<ResponseQuality, { icon: React.ReactNode; activeClass: string; desc: string }> = {
  Reactive: {
    icon: <Zap className="h-4 w-4" />,
    activeClass: "border-destructive/40 text-destructive bg-destructive/5",
    desc: "Impulsive, emotional",
  },
  Managed: {
    icon: <RefreshCw className="h-4 w-4" />,
    activeClass: "border-warm/60 text-warm bg-warm-light",
    desc: "Kept it together",
  },
  Composed: {
    icon: <Flower2 className="h-4 w-4" />,
    activeClass: "border-primary/40 text-primary bg-accent",
    desc: "Calm & thoughtful",
  },
  Strategic: {
    icon: <Target className="h-4 w-4" />,
    activeClass: "border-violet-dark/40 text-violet-dark bg-violet-light/50",
    desc: "Intentional & planned",
  },
};

const ResponseQualitySelect = ({
  value,
  onChange,
  label = "How did you handle it?",
  description = "Reflect on how you responded to the challenge.",
  qualityLabels,
}: Props) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-violet-light shadow-sm">
          <Target className="h-[18px] w-[18px] text-primary" />
        </div>
        <div>
          <label className="text-sm font-bold text-foreground tracking-tight block">
            {label}
          </label>
          <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{description}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {QUALITIES.map((q) => {
          const config = qualityConfig[q];
          const isActive = value === q;
          const displayLabel = qualityLabels?.[q] || q;
          return (
            <button
              key={q}
              type="button"
              onClick={() => onChange(q)}
              className={`py-3 px-3 rounded-xl text-left transition-all duration-250 border-2 hover:-translate-y-0.5 active:translate-y-0 ${
                isActive
                  ? `${config.activeClass} shadow-sm`
                  : "bg-card text-muted-foreground border-border hover:border-primary/20 hover:bg-accent/30"
              }`}
            >
              <div className="flex items-center gap-2 mb-0.5">
                {config.icon}
                <span className="text-sm font-semibold">{displayLabel}</span>
              </div>
              <p className="text-[10px] opacity-70 leading-snug pl-6">{config.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ResponseQualitySelect;
