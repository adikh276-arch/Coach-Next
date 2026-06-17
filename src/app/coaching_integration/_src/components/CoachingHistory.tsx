import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  ChevronDown,
  Check,
  X,
  Target,
  Star,
  Layers,
  Rocket,
  CalendarDays,
} from "lucide-react";
import type { CoachingEntry } from "../lib/coaching-storage";
import { format, parseISO } from "date-fns";
import { useTranslation } from "../lib/translation";

interface Props {
  entries: CoachingEntry[];
}

const depthColor: Record<string, string> = {
  "Tried It Briefly": "#eab308",
  "Partially Applied": "#0ea5e9",
  "Fully Implemented": "#10b981",
};

const getDepthKey = (depth: string) => {
  const map: Record<string, string> = {
    "Tried It Briefly": "depth.tried_briefly",
    "Partially Applied": "depth.partially_applied",
    "Fully Implemented": "depth.fully_implemented",
  };
  return map[depth] || depth;
};

const CoachingHistory = ({ entries }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  if (sorted.length === 0) return null;

  return (
    <motion.div
      id="coaching-history"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="tracker-card overflow-hidden scroll-mt-20"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 md:p-6 transition-colors hover:bg-slate-50/50"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "var(--gradient-primary)" }}
          >
            <History className="w-4.5 h-4.5 text-white" />
          </div>
          <div className="text-left">
            <span className="font-bold text-foreground text-sm md:text-base">
              {t("history.title")}
            </span>
            <p className="text-[11px] text-muted-foreground">
              {sorted.length} {sorted.length === 1 ? t("history.entry") : t("history.entries")} {t("history.logged")}
            </p>
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown className="w-5 h-5 text-slate-500" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 md:px-6 pb-5 md:pb-6 space-y-3">
              {sorted.map((entry, i) => {
                const isToday =
                  entry.date === new Date().toISOString().split("T")[0];
                return (
                  <motion.div
                    key={entry.date}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.05 }}
                    className="rounded-xl border border-slate-100 bg-white/60 p-4 space-y-3"
                  >
                    {/* Date header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-3.5 h-3.5 text-primary" />
                        <span className="text-sm font-semibold text-foreground">
                          {isToday
                            ? t("history.today")
                            : format(parseISO(entry.date), "EEE, MMM d")}
                        </span>
                        {isToday && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                            {t("history.current")}
                          </span>
                        )}
                      </div>
                      <div
                        className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          entry.implemented
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-50 text-slate-500"
                        }`}
                      >
                        {entry.implemented ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <X className="w-3 h-3" />
                        )}
                        {entry.implemented ? t("history.applied") : t("history.not_applied")}
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="flex flex-wrap gap-3">
                      {/* Depth */}
                      {entry.implemented && entry.implementation_depth && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <Layers
                            className="w-3.5 h-3.5"
                            style={{
                              color:
                                depthColor[entry.implementation_depth] ??
                                "currentColor",
                            }}
                          />
                          <span>{t(getDepthKey(entry.implementation_depth))}</span>
                        </div>
                      )}

                      {/* Accountability */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Target className="w-3.5 h-3.5 text-rose-400" />
                        <span>{t("history.accountability")}{entry.accountability_score}/10</span>
                      </div>

                      {/* Session value */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Star className="w-3.5 h-3.5 text-amber-500" />
                        <span>{t("history.session")}{entry.session_value}/10</span>
                      </div>
                    </div>

                    {/* Next action */}
                    {entry.next_action && (
                      <div className="flex items-start gap-2 pt-1 border-t border-slate-100">
                        <Rocket className="w-3.5 h-3.5 text-purple-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-slate-500 italic">
                          {entry.next_action}
                        </p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CoachingHistory;
