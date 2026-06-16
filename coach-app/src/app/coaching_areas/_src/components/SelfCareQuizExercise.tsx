import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, History, Clock, ChevronDown, ChevronUp, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import SuccessDialog from "@/components/SuccessDialog";
import { useTranslation } from "react-i18next";
import { useTranslatedContent } from "@/hooks/useTranslatedContent";

export interface QuizQuestion {
  text: string;
  options: string[];
}

export interface QuizTemplate {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

interface HistoryEntry {
  id: string;
  date: string;
  answers: Record<number, string>;
  score?: { yes: number; sometimes: number; no: number };
}

interface Props {
  template: QuizTemplate;
  onBack: () => void;
}

const SelfCareQuizExercise = ({ template, onBack }: Props) => {
  const { t } = useTranslation();
  const { getTranslatedQuiz } = useTranslatedContent();
  const translated = getTranslatedQuiz(template);

  const storageKey = `quiz-history-${template.id}`;
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
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
  const question = translated.questions[currentStep];
  const totalQuestions = translated.questions.length;
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalQuestions - 1;

  const handleSelect = (option: string) => {
    setAnswers((prev) => ({ ...prev, [currentStep]: option }));
  };

  const handleNext = () => {
    if (!answers[currentStep]) {
      toast({ title: t("common.selectAnswer", "Please select an answer"), variant: "destructive" });
      return;
    }
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
    // Note: Option matching for scores should ideally use index or non-translated value
    // but for this simple yes/sometimes/no quiz, we'll try to match the first 3 options
    const yes = Object.values(answers).filter((a, i) => a === translated.questions[i].options[0]).length;
    const sometimes = Object.values(answers).filter((a, i) => a === translated.questions[i].options[1]).length;
    const no = Object.values(answers).filter((a, i) => a === translated.questions[i].options[2]).length;

    const entry: HistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      answers,
      score: { yes, sometimes, no },
    };
    const prev = getHistory();
    localStorage.setItem(storageKey, JSON.stringify([entry, ...prev].slice(0, 50)));
    setShowResults(true);
    setShowSuccess(true);
  };

  const resetQuiz = () => {
    setAnswers({});
    setCurrentStep(0);
    setShowResults(false);
  };

  const answeredCount = Object.keys(answers).length;

  if (showResults) {
    const yes = Object.values(answers).filter((a, i) => a === translated.questions[i].options[0]).length;
    const sometimes = Object.values(answers).filter((a, i) => a === translated.questions[i].options[1]).length;
    const no = Object.values(answers).filter((a, i) => a === translated.questions[i].options[2]).length;
    const percentage = Math.round((yes / totalQuestions) * 100);

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
            <div className="relative mx-auto h-32 w-32 mb-4">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  strokeDasharray={`${percentage * 2.64} 264`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-foreground">{percentage}%</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {percentage >= 75
                ? t("common.quizGreat", "Great! You're taking good care of yourself.")
                : percentage >= 50
                ? t("common.quizOk", "You're doing okay, but there's room for improvement.")
                : t("common.quizPoor", "It's time to prioritize your self-care more.")}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-3 text-center">
              <p className="text-2xl font-bold text-emerald-600">{yes}</p>
              <p className="text-xs font-medium text-emerald-600/70">{translated.questions[0].options[0]}</p>
            </div>
            <div className="rounded-xl bg-amber-500/10 p-3 text-center">
              <p className="text-2xl font-bold text-amber-600">{sometimes}</p>
              <p className="text-xs font-medium text-amber-600/70">{translated.questions[0].options[1]}</p>
            </div>
            <div className="rounded-xl bg-rose-500/10 p-3 text-center">
              <p className="text-2xl font-bold text-rose-600">{no}</p>
              <p className="text-xs font-medium text-rose-600/70">{translated.questions[0].options[2]}</p>
            </div>
          </div>
        </div>

        <button
          onClick={resetQuiz}
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
          className="flex items-center gap-2 rounded-xl bg-card px-4 py-2.5 text-sm font-semibold coaching-card-shadow transition-all hover:coaching-card-shadow-hover"
        >
          <History className="h-4 w-4 text-primary" />
          <span className="text-foreground">{t("common.history")}</span>
        </button>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{translated.description}</p>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((answeredCount) / totalQuestions) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          {currentStep + 1}/{totalQuestions}
        </span>
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
              {history.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                  className="w-full rounded-xl border border-border bg-background p-3 text-left transition-all hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">{entry.date}</span>
                    <div className="flex items-center gap-2">
                      {entry.score && (
                        <span className="text-xs font-bold text-primary">
                          {Math.round((entry.score.yes / totalQuestions) * 100)}%
                        </span>
                      )}
                      {expandedEntry === entry.id ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  {expandedEntry === entry.id && entry.score && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <p className="text-lg font-bold text-emerald-600">{entry.score.yes}</p>
                        <p className="text-[10px] text-muted-foreground">{translated.questions[0].options[0]}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-amber-600">{entry.score.sometimes}</p>
                        <p className="text-[10px] text-muted-foreground">{translated.questions[0].options[1]}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-rose-600">{entry.score.no}</p>
                        <p className="text-[10px] text-muted-foreground">{translated.questions[0].options[2]}</p>
                      </div>
                    </motion.div>
                  )}
                </button>
              ))}
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
          <p className="text-base font-bold text-foreground mb-5">{question.text}</p>

          <div className="flex flex-col gap-3">
            {question.options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left text-sm font-medium transition-all ${
                  answers[currentStep] === option
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-background text-foreground hover:bg-muted/50"
                }`}
              >
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                    answers[currentStep] === option
                      ? "border-primary"
                      : "border-muted-foreground/40"
                  }`}
                >
                  {answers[currentStep] === option && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="h-2.5 w-2.5 rounded-full bg-primary"
                    />
                  )}
                </div>
                {option}
              </button>
            ))}
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
    
      <SuccessDialog 
        open={showSuccess} 
        onClose={() => setShowSuccess(false)} 
        title={t("common.quizCompleted")} 
        message={t("common.quizSuccessMessage")} 
      />
    </motion.div>
  );
};

export default SelfCareQuizExercise;
