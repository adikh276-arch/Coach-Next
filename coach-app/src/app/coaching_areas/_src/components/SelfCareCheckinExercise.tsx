import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, History, Clock, ChevronDown, ChevronUp, ChevronRight, ChevronLeft, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import SuccessDialog from "@/components/SuccessDialog";
import { useTranslation } from "react-i18next";
import { useTranslatedContent } from "@/hooks/useTranslatedContent";

export interface CheckinCategory {
  label: string;
  color: string;
}

export interface CheckinTemplate {
  id: string;
  title: string;
  description: string;
  categories: CheckinCategory[];
}

interface HistoryEntry {
  id: string;
  date: string;
  responses: Record<string, { score: number; need: string }>;
}

interface Props {
  template: CheckinTemplate;
  onBack: () => void;
}

const SelfCareCheckinExercise = ({ template, onBack }: Props) => {
  const { t } = useTranslation();
  const { getTranslatedCheckin } = useTranslatedContent();
  const translated = getTranslatedCheckin(template);

  const storageKey = `checkin-history-${template.id}`;
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, { score: number; need: string }>>({});
  const [showHistory, setShowHistory] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const getHistory = (): HistoryEntry[] => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch {
      return [];
    }
  };

  const history = getHistory();
  const category = translated.categories[currentStep];
  const total = translated.categories.length;
  const isFirst = currentStep === 0;
  const isLast = currentStep === total - 1;

  const currentResponse = responses[category.label] || { score: 5, need: "" };

  const handleScoreChange = (score: number) => {
    setResponses((prev) => ({
      ...prev,
      [category.label]: { ...currentResponse, score },
    }));
  };

  const handleNeedChange = (need: string) => {
    setResponses((prev) => ({
      ...prev,
      [category.label]: { ...currentResponse, need },
    }));
  };

  const handleNext = () => {
    if (isLast) {
      handleSubmit();
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) setCurrentStep((s) => s - 1);
  };

  const handleSubmit = () => {
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      responses,
    };
    const prev = getHistory();
    localStorage.setItem(storageKey, JSON.stringify([entry, ...prev].slice(0, 50)));
    setShowResults(true);
    setShowSuccess(true);
  };

  const resetCheckin = () => {
    setResponses({});
    setCurrentStep(0);
    setShowResults(false);
  };

  if (showResults) {
    const avgScore =
      Object.values(responses).length > 0
        ? Math.round(Object.values(responses).reduce((sum, r) => sum + r.score, 0) / Object.values(responses).length * 10) / 10
        : 0;

    return (
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-5 pb-8"
      >
        <div className="flex items-center gap-3">
          
          <h1 className="text-xl font-bold text-foreground">
            {translated.title} — {t("common.results")}
          </h1>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 coaching-card-shadow">
          <div className="text-center mb-6">
            <p className="text-4xl font-bold text-primary mb-1">{avgScore}</p>
            <p className="text-sm text-muted-foreground">{t("common.averageScore", "Average Score out of 10")}</p>
          </div>

          <div className="flex flex-col gap-3">
            {translated.categories.map((cat, idx) => {
              const resp = responses[cat.label];
              return (
                <div key={idx} className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold" style={{ color: cat.color }}>{cat.label}</p>
                    <span className="text-lg font-bold text-foreground">{resp?.score ?? "—"}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${(resp?.score ?? 0) * 10}%`, backgroundColor: cat.color }}
                    />
                  </div>
                  {resp?.need && (
                    <p className="mt-2 text-xs text-muted-foreground italic">"{resp.need}"</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={resetCheckin}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 coaching-card-shadow"
        >
          {t("common.retakeQuiz")}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-5 pb-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          
          <h1 className="text-xl font-bold text-foreground">{translated.title}</h1>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`flex items-center gap-2 rounded-xl bg-card px-4 py-2.5 text-sm font-semibold coaching-card-shadow transition-all hover:coaching-card-shadow-hover ${
            showHistory ? "bg-primary text-primary-foreground" : ""
          }`}
        >
          <History className={`h-4 w-4 ${showHistory ? "text-primary-foreground" : "text-primary"}`} />
          <span className={showHistory ? "text-primary-foreground" : "text-foreground"}>{t("common.history")}</span>
        </button>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{translated.description}</p>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ width: `${((currentStep + 1) / total) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-xs font-semibold text-muted-foreground">{currentStep + 1}/{total}</span>
      </div>

      {showHistory && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="rounded-2xl border border-border bg-card p-4 coaching-card-shadow"
        >
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
            <Clock className="h-4 w-4 text-primary" />
            {t("common.previousResults")}
          </h3>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">{t("common.noHistory")}</p>
          ) : (
            <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
              {history.map((entry) => {
                const avg = Object.values(entry.responses).length > 0
                  ? Math.round(Object.values(entry.responses).reduce((s, r) => s + r.score, 0) / Object.values(entry.responses).length * 10) / 10
                  : 0;
                return (
                  <button
                    key={entry.id}
                    onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                    className="w-full rounded-xl border border-border bg-background p-3 text-left transition-all hover:bg-muted/50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">{entry.date}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary">{t("common.averageScore")}: {avg}</span>
                        {expandedEntry === entry.id ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-border bg-card p-6 coaching-card-shadow"
        >
          <h3 className="text-lg font-bold mb-4" style={{ color: category.color }}>
            {category.label}
          </h3>

          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-foreground">{t("common.rateYourself", "Rate yourself (1-10)")}</p>
              <span className="text-2xl font-bold text-primary">{currentResponse.score}</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={currentResponse.score}
              onChange={(e) => handleScoreChange(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none bg-muted accent-primary cursor-pointer"
            />
          </div>

          <div>
            <p className="text-sm font-bold text-foreground mb-2">{t("common.whatDoINeed", "What do I need?")}</p>
            <Textarea
              value={currentResponse.need}
              onChange={(e) => handleNeedChange(e.target.value)}
              placeholder={t("common.writeThoughts", "Write your thoughts...")}
              className="min-h-[100px] rounded-xl border-border bg-background resize-y text-sm"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-3">
        {!isFirst && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handlePrev}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-muted py-3.5 text-sm font-bold text-foreground transition-all hover:bg-muted/80"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("common.previous")}
          </motion.button>
        )}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 coaching-card-shadow"
        >
          {isLast ? t("common.submit") : t("common.next")}
          {!isLast && <ChevronRight className="h-4 w-4" />}
        </motion.button>
      </div>
    
      <SuccessDialog open={showSuccess} onClose={() => setShowSuccess(false)} />
    </motion.div>
  );
};

export default SelfCareCheckinExercise;
