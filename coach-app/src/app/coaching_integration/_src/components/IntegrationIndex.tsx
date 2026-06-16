import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Zap, TrendingUp, Award } from "lucide-react";
import { useTranslation } from "../lib/translation";

interface Props {
  score: number;
  hasEntries: boolean;
}

const IntegrationIndex = ({ score, hasEntries }: Props) => {
  const { t } = useTranslation();
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    if (!hasEntries) return;
    let start = 0;
    const end = score;
    const duration = 1200;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = end / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedScore(end);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(start));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [score, hasEntries]);

  const getScoreLabel = () => {
    if (animatedScore >= 80) return { label: t("Excellent"), icon: Award };
    if (animatedScore >= 60) return { label: t("Strong"), icon: TrendingUp };
    if (animatedScore >= 40) return { label: t("Building"), icon: Activity };
    if (animatedScore >= 20) return { label: t("Starting"), icon: Zap };
    return { label: t("Begin"), icon: Zap };
  };

  const { label, icon: StatusIcon } = getScoreLabel();

  return (
    <div className="p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6">
      {/* Ring */}
      <div className="relative w-32 h-32 md:w-36 md:h-36 shrink-0">
        <div
          className="absolute inset-[-6px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, hsla(160, 84%, 39%, 0.15), transparent 70%)" }}
        />
        <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="7" opacity="0.4" />
          {[0, 25, 50, 75, 100].map((pct) => {
            const angle = (pct / 100) * 360 - 90;
            const rad = (angle * Math.PI) / 180;
            return (
              <circle key={pct} cx={70 + radius * Math.cos(rad)} cy={70 + radius * Math.sin(rad)} r="1.5" fill="hsl(var(--muted-foreground))" opacity="0.25" />
            );
          })}
          <motion.circle
            cx="70" cy="70" r={radius} fill="none" stroke="url(#ringGradient)" strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: hasEntries ? strokeDashoffset : circumference }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
            style={{ filter: "drop-shadow(0 0 8px hsla(160, 84%, 39%, 0.4))" }}
          />
          <defs>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(160, 84%, 44%)" />
              <stop offset="50%" stopColor="hsl(168, 80%, 38%)" />
              <stop offset="100%" stopColor="hsl(174, 72%, 36%)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {hasEntries ? (
            <>
              <motion.span className="text-3xl md:text-4xl font-display font-extrabold"
                style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}>
                {animatedScore}
              </motion.span>
              <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground mt-0.5">{t("/ 100")}</span>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1 px-3">
              <Zap className="w-5 h-5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground text-center leading-tight">{t("Log 3+ days")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Text side */}
      <div className="text-center sm:text-left flex-1">
        <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
          <Activity className="w-4 h-4 text-primary" />
          <h2 className="font-display text-base md:text-lg font-bold text-foreground">{t("Integration Index")}</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-3">{t("How consistently you apply coaching into action")}</p>

        {hasEntries && (
          <motion.div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10"
            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
            <StatusIcon className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">{label}</span>
            <span className="text-[10px] text-muted-foreground">• {t("Score")} {score}/100</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default IntegrationIndex;
