import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, History, Clock, ChevronDown, ChevronUp, Send, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import SuccessDialog from "@/components/SuccessDialog";

interface HistoryEntry {
  id: string;
  date: string;
  data: Record<string, string>;
}

interface Props {
  onBack: () => void;
}

const MOTIVATIONAL_PHRASES = [
  "I MUST...",
  "I HAVE TO...",
  "I SHOULD...",
  "I OUGHT TO...",
  "I'VE GOT TO...",
  "I NEED TO...",
  "IT'S NECESSARY TO...",
  "IT'S TIME TO...",
  "I'M ALLOWED TO...",
  "I'M ALLOWED TO...",
  "I MIGHT...",
  "I COULD...",
  "I'M ABLE TO...",
  "I CAN...",
  "I INTEND TO...",
  "IT'S POSSIBLE THAT...",
  "I'LL TRY TO...",
  "I MAY...",
  "I DESERVE TO...",
  "I WANT TO...",
  "I'VE DECIDED TO...",
  "I GET TO...",
  "I'M READY TO...",
];

const PHRASE_COLORS = [
  "#dc2626", "#e11d48", "#9333ea", "#7c3aed",
  "#2563eb", "#0891b2", "#0d9488", "#059669",
  "#16a34a", "#65a30d", "#ca8a04", "#ea580c",
  "#dc2626", "#e11d48", "#9333ea", "#7c3aed",
  "#2563eb", "#0891b2", "#0d9488", "#059669",
  "#16a34a", "#65a30d", "#ca8a04",
];

const STORAGE_KEY = "exercise-history-get-motivated";

const GetMotivatedExercise = ({ onBack }: Props) => {
  const [page, setPage] = useState(0); // 0=intro+phrases page1, 1=phrases page2, 2=wrap-up
  const [values, setValues] = useState<Record<string, string>>({});
  const [showHistory, setShowHistory] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const getHistory = (): HistoryEntry[] => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  };
  const history = getHistory();

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const hasContent = Object.values(values).some((v) => v.trim());
    if (!hasContent) {
      toast({ title: "Please fill in at least one field", variant: "destructive" });
      return;
    }
    const entry: HistoryEntry = { id: Date.now().toString(), date: new Date().toLocaleString(), data: values };
    const prev = getHistory();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...prev].slice(0, 50)));
    setValues({});
    setPage(0);
    setShowSuccess(true);
  };

  const phrasesPage1 = MOTIVATIONAL_PHRASES.slice(0, 12);
  const phrasesPage2 = MOTIVATIONAL_PHRASES.slice(12);

  const renderPhraseSection = (phrase: string, index: number, globalIndex: number) => (
    <motion.div
      key={`${phrase}-${globalIndex}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      className="flex flex-col gap-2 pb-4 mb-4 border-b border-border/50 last:border-b-0"
    >
      <h3 className="text-base font-bold" style={{ color: PHRASE_COLORS[globalIndex % PHRASE_COLORS.length] }}>
        {phrase}
      </h3>
      {["Short-term Goal", "Long-term Goal", "Activity"].map((label) => {
        const key = `${globalIndex}-${label}`;
        return (
          <div key={key} className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-foreground">{label}</label>
            <Input
              value={values[key] || ""}
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder={`Enter ${label.toLowerCase()}...`}
              className="rounded-xl border-border bg-background text-sm transition-all focus:ring-2 focus:ring-primary/30"
            />
          </div>
        );
      })}
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-5 pb-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          
          <h1 className="text-xl font-bold text-foreground">Get Motivated!</h1>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 rounded-xl bg-card px-4 py-2.5 text-sm font-semibold coaching-card-shadow transition-all hover:coaching-card-shadow-hover"
        >
          <History className="h-4 w-4 text-primary" />
          <span className="text-foreground">History</span>
        </button>
      </div>

      {/* History Panel */}
      {showHistory && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="rounded-2xl border border-border bg-card p-4 coaching-card-shadow"
        >
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
            <Clock className="h-4 w-4 text-primary" />
            Previous Entries
          </h3>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No history yet.</p>
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
                    {expandedEntry === entry.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  {expandedEntry === entry.id && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 flex flex-col gap-2 text-sm">
                      {Object.entries(entry.data).filter(([, v]) => v.trim()).map(([k, v]) => {
                        const parts = k.split("-");
                        const phraseIdx = parseInt(parts[0]);
                        const label = parts.slice(1).join("-");
                        return (
                          <div key={k} className="flex flex-col">
                            <span className="text-xs text-muted-foreground">{MOTIVATIONAL_PHRASES[phraseIdx] || k} — {label}</span>
                            <span className="text-foreground">{v}</span>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Page 0: Intro + first 12 phrases */}
      {page === 0 && (
        <motion.div key="page0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Which words most inspire you to take action? Which words demotivate you? This exercise will help you find out.
          </p>
          <div className="rounded-xl border border-border bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              First pick 3 activities: a short-term goal, a long-term goal and an activity you don't enjoy (eg. a household chore). Thinking about your activities and goals, score them from 1 to 10. Now using the most scored words, make sentences in your mind for each of your 3 goals/activities. Take a moment to FEEL into each statement for how inspired you feel to do each goal/activity in turn.
            </p>
          </div>

          {/* Initial goals */}
          <div className="flex flex-col gap-3 pb-4 border-b border-border">
            {["Your Short-term Goal", "Your Long-term Goal", "An activity you don't enjoy"].map((label) => (
              <div key={label} className="flex flex-col gap-1">
                <label className="text-sm font-bold text-foreground">{label}</label>
                <Input
                  value={values[label] || ""}
                  onChange={(e) => handleChange(label, e.target.value)}
                  placeholder={`Enter ${label.toLowerCase()}...`}
                  className="rounded-xl border-border bg-background text-sm"
                />
              </div>
            ))}
          </div>

          {phrasesPage1.map((phrase, i) => renderPhraseSection(phrase, i, i))}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPage(1)}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 coaching-card-shadow"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </motion.div>
      )}

      {/* Page 1: Remaining phrases */}
      {page === 1 && (
        <motion.div key="page1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
          {phrasesPage2.map((phrase, i) => renderPhraseSection(phrase, i, i + 12))}

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPage(0)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-3.5 text-sm font-bold text-foreground transition-all hover:bg-muted coaching-card-shadow"
            >
              Previous
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPage(2)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 coaching-card-shadow"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Page 2: Wrap-up */}
      {page === 2 && (
        <motion.div key="page2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
          <h2 className="text-lg font-bold" style={{ color: "#dc2626" }}>To wrap up, write out:</h2>

          {[
            { title: "For a Short-term Goal", color: "#1e3a5f" },
            { title: "For a Long-term Goal", color: "#1e3a5f" },
            { title: "For an Unenjoyable Activity", color: "#1e3a5f" },
          ].map((section) => (
            <div key={section.title} className="flex flex-col gap-3 pb-4 border-b border-border/50">
              <h3 className="text-sm font-bold text-foreground">{section.title}</h3>
              {["Which word/s MOST MOTIVATE you?", "Which word/s DEMOTIVATE you?"].map((q) => {
                const key = `wrapup-${section.title}-${q}`;
                return (
                  <div key={key} className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-muted-foreground">{q}</label>
                    <Input
                      value={values[key] || ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      placeholder="Enter your answer..."
                      className="rounded-xl border-border bg-background text-sm"
                    />
                  </div>
                );
              })}
            </div>
          ))}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-foreground">What have you learned about yourself? What will you do differently?</label>
            <Textarea
              value={values["wrapup-reflection"] || ""}
              onChange={(e) => handleChange("wrapup-reflection", e.target.value)}
              placeholder="Enter your reflection..."
              className="min-h-[100px] rounded-xl border-border bg-background resize-y text-sm"
            />
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPage(1)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-3.5 text-sm font-bold text-foreground transition-all hover:bg-muted coaching-card-shadow"
            >
              Previous
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 coaching-card-shadow"
            >
              <Send className="h-4 w-4" />
              Submit
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Page indicator */}
      <div className="flex items-center justify-center gap-2">
        {[0, 1, 2].map((p) => (
          <div
            key={p}
            className={`h-2 rounded-full transition-all ${page === p ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"}`}
          />
        ))}
      </div>
    
      <SuccessDialog open={showSuccess} onClose={() => setShowSuccess(false)} />
    </motion.div>
  );
};

export default GetMotivatedExercise;
