import { ShieldCheck, ShieldOff } from "lucide-react";

interface ChallengeToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  yesLabel?: string;
  noLabel?: string;
  label?: string;
  description?: string;
}

const ChallengeToggle = ({
  value,
  onChange,
  yesLabel = "Yes, I did",
  noLabel = "Today went well",
  label = "Did you face a challenging situation today?",
  description = "Any conflict, pressure, or emotionally difficult moment you had to navigate.",
}: ChallengeToggleProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-warm-light shadow-sm">
          <ShieldCheck className="h-[18px] w-[18px] text-warm" />
        </div>
        <div>
          <label className="text-sm font-bold text-foreground tracking-tight block">
            {label}
          </label>
          <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{description}</p>
        </div>
      </div>
      <div className="flex gap-3">
        {([true, false] as const).map((opt) => (
          <button
            key={String(opt)}
            type="button"
            onClick={() => onChange(opt)}
            className={`flex-1 py-3.5 px-4 rounded-xl text-sm font-semibold transition-all duration-250 border-2 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 ${
              value === opt
                ? opt
                  ? "bg-gradient-to-br from-warm-light to-warm/10 text-warm border-warm/30 shadow-md"
                  : "bg-gradient-to-br from-accent to-secondary text-foreground border-primary/15 shadow-md"
                : "bg-card text-muted-foreground border-border hover:border-primary/20 hover:bg-accent/30"
            }`}
          >
            {opt ? <ShieldCheck className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />}
            {opt ? yesLabel : noLabel}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChallengeToggle;
