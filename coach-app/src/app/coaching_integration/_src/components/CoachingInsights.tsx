import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, TrendingUp, BarChart3, Lightbulb, CheckCircle2, Eye } from "lucide-react";
import { CoachingEntry, getSmartInsight } from "../lib/coaching-storage";
import { useTranslation } from "../lib/translation";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

interface Props {
  entries: CoachingEntry[];
}

const getInsightKey = (insight: string) => {
  const map: Record<string, string> = {
    "Keep logging to unlock personalized insights.": "insight.keep_logging",
    "Strong momentum — high accountability is driving consistent implementation.": "insight.strong_momentum",
    "Great implementation rate. Boosting accountability could amplify your results.": "insight.great_impl",
    "High accountability detected. Focus on applying learnings to unlock full potential.": "insight.high_acc",
    "Consistent tracking builds awareness — keep logging to strengthen your coaching integration.": "insight.consistent_tracking",
  };
  return map[insight] || insight;
};

const CoachingInsights = ({ entries }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  if (entries.length < 1) return null;

  // Entries are DESC, take first 7 and reverse for chart
  const recent7 = entries.slice(0, 7).reverse();
  const implRate = recent7.filter((e) => e.implemented).length;
  const implPct = Math.round((implRate / Math.max(recent7.length, 1)) * 100);
  const trendData = recent7.map((e) => ({
    day: e.date.slice(5),
    accountability: e.accountability_score,
    session: e.session_value,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="tracker-card overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left group transition-colors hover:bg-slate-50/50"
      >
        <span className="inline-flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "var(--gradient-primary)" }}
          >
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-foreground block text-sm md:text-base">
              {t("insights.title")}
            </span>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {open ? t("insights.viewing_trends") : t("insights.tap_to_view")}
            </span>
          </div>
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 group-hover:bg-primary/10 transition-all duration-200"
        >
          <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-primary transition-colors" />
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
            <div className="px-5 pb-6 md:px-6 space-y-5">
              {/* Trend Chart */}
              {recent7.length >= 1 && (
                <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-bold text-foreground">{t("insights.trend")}</h3>
                  </div>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData}>
                        <defs>
                          <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                          </linearGradient>
                          <linearGradient id="sesGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} vertical={false} />
                        <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            background: "white",
                            border: "1px solid #e2e8f0",
                            borderRadius: "12px",
                            fontSize: "12px",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
                          }}
                        />
                        <Area type="monotone" dataKey="accountability" stroke="#10b981" strokeWidth={2.5} fill="url(#accGrad)"
                          dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "white" }} name={t("insights.accountability")} />
                        <Area type="monotone" dataKey="session" stroke="#0ea5e9" strokeWidth={2.5} fill="url(#sesGrad)"
                          dot={{ r: 4, fill: "#0ea5e9", strokeWidth: 2, stroke: "white" }} name={t("insights.session_value")} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Implementation Rate */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--gradient-primary)" }}>
                  <span className="text-lg font-bold text-white">{implPct}%</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    {t("insights.impl_rate")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t("insights.applied_coaching_on")} <strong>{implRate} {t("insights.of")} {recent7.length}</strong> {t("insights.days")}
                  </p>
                </div>
              </div>

              {/* Smart Insight */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-yellow-500/10">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                </div>
                <p className="text-sm text-foreground leading-relaxed">{t(getInsightKey(getSmartInsight(entries)))}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CoachingInsights;
