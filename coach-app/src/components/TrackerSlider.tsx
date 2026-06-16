import { useId } from "react";
import { Gauge, Flame } from "lucide-react";

interface TrackerSliderProps {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  lowLabel?: string;
  highLabel?: string;
  variant?: "stability" | "stress";
}

const TrackerSlider = ({
  label,
  description,
  value,
  onChange,
  min = 1,
  max = 10,
  lowLabel = "Low",
  highLabel = "High",
  variant = "stability",
}: TrackerSliderProps) => {
  const id = useId();
  const percentage = ((value - min) / (max - min)) * 100;
  const isStability = variant === "stability";
  const Icon = isStability ? Gauge : Flame;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${
              isStability ? "bg-primary/10" : "bg-destructive/8"
            }`}
          >
            <Icon
              className={`h-4 w-4 ${
                isStability ? "text-primary" : "text-destructive"
              }`}
            />
          </div>
          <div>
            <label
              htmlFor={id}
              className="text-[15px] font-bold text-foreground tracking-tight block leading-snug"
            >
              {label}
            </label>
            <p className="text-[11.5px] text-muted-foreground leading-relaxed mt-0.5">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 pt-1 pb-1">
          {/* Track background */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2.5 rounded-full bg-muted/80" />

          {/* Filled track */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 left-0 h-2.5 rounded-full transition-all duration-200 ease-out ${
              isStability
                ? "bg-primary"
                : "bg-destructive"
            }`}
            style={{ width: `${percentage}%` }}
          />

          <input
            id={id}
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className={`tracker-slider tracker-slider--${variant} w-full relative z-10`}
          />
        </div>

        {/* Value badge */}
        <div
          className={`flex items-center justify-center w-11 h-11 rounded-xl text-lg font-extrabold tabular-nums shrink-0 ${
            isStability
              ? "bg-primary text-primary-foreground"
              : "bg-destructive text-destructive-foreground"
          }`}
        >
          {value}
        </div>
      </div>

      <div className="flex justify-between text-[11px] text-muted-foreground font-medium px-0.5 -mt-1">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
};

export default TrackerSlider;
