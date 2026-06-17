import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, History, Clock, ChevronDown, ChevronUp, Send, Plus, X, Calendar } from "lucide-react";
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

const STORAGE_KEY = "exercise-history-gratitude-diary";

const GratitudeDiaryExercise = ({ onBack }: Props) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [progressList, setProgressList] = useState<string[]>(["", "", ""]);
  const [gratitudeList, setGratitudeList] = useState<string[]>(["", "", ""]);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const getHistory = (): HistoryEntry[] => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  };
  const history = getHistory();

  const handleChange = (key: string, val: string) => setValues(p => ({ ...p, [key]: val }));

  const handleSubmit = () => {
    const data: Record<string, string> = { ...values };
    const fp = progressList.filter(i => i.trim());
    const fg = gratitudeList.filter(i => i.trim());
    if (fp.length) data["progress-successes"] = JSON.stringify(fp);
    if (fg.length) data["gratitude-appreciation"] = JSON.stringify(fg);

    if (!Object.values(data).some(v => v.trim())) {
      toast({ title: "Please fill in at least one field", variant: "destructive" });
      return;
    }
    const entry: HistoryEntry = { id: Date.now().toString(), date: new Date().toLocaleString(), data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...getHistory()].slice(0, 50)));
    setValues({}); setProgressList(["", "", ""]); setGratitudeList(["", "", ""]);
    setShowSuccess(true);
  };

  const updateList = (list: string[], setList: (v: string[]) => void, idx: number, val: string) => {
    const c = [...list]; c[idx] = val; setList(c);
  };

  const renderListField = (label: string, subtitle: string, list: string[], setList: (v: string[]) => void) => (
    <div>
      <label className="text-sm font-bold text-foreground">{label}</label>
      <p className="text-xs text-muted-foreground mb-2">{subtitle}</p>
      <div className="flex flex-col gap-2">
        {list.map((item, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white bg-primary">{idx + 1}</span>
            <Input value={item} onChange={e => updateList(list, setList, idx, e.target.value)} placeholder={`Item ${idx + 1}...`} className="flex-1 rounded-xl border-border bg-background text-sm" />
            {list.length > 1 && (
              <button onClick={() => { const c = [...list]; c.splice(idx, 1); setList(c); }} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><X className="h-4 w-4" /></button>
            )}
          </motion.div>
        ))}
        {list.length < 10 && (
          <button onClick={() => setList([...list, ""])} className="mt-1 flex items-center gap-2 self-start rounded-xl px-3 py-2 text-sm font-semibold text-primary hover:bg-muted">
            <Plus className="h-4 w-4" />Add item
          </button>
        )}
      </div>
    </div>
  );

  const renderHistoryValue = (raw: string) => {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return <ul className="ml-4 list-disc">{parsed.map((item: string, i: number) => <li key={i}>{item}</li>)}</ul>;
    } catch { /* plain text */ }
    return <span>{raw}</span>;
  };

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }} className="flex flex-col gap-5 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          
          <h1 className="text-xl font-bold text-foreground">Daily Gratitude Diary</h1>
        </div>
        <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 rounded-xl bg-card px-4 py-2.5 text-sm font-semibold coaching-card-shadow transition-all hover:coaching-card-shadow-hover">
          <History className="h-4 w-4 text-primary" /><span className="text-foreground">History</span>
        </button>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">This diary empowers you with a positive mindset. It encourages daily reflection on blessings, fostering gratitude for both small and significant moments. This practice enhances mental well-being, promoting mindfulness and a deeper appreciation for life.</p>

      {/* History */}
      {showHistory && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="rounded-2xl border border-border bg-card p-4 coaching-card-shadow">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground"><Clock className="h-4 w-4 text-primary" />Previous Entries</h3>
          {history.length === 0 ? <p className="text-sm text-muted-foreground py-4 text-center">No history yet.</p> : (
            <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
              {history.map(entry => (
                <button key={entry.id} onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)} className="w-full rounded-xl border border-border bg-background p-3 text-left transition-all hover:bg-muted/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">{entry.date}</span>
                    {expandedEntry === entry.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  {expandedEntry === entry.id && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 flex flex-col gap-2 text-sm">
                      {Object.entries(entry.data).filter(([, v]) => v.trim()).map(([k, v]) => (
                        <div key={k}><span className="text-xs text-muted-foreground capitalize">{k.replace(/-/g, " ")}</span><div className="text-foreground">{renderHistoryValue(v)}</div></div>
                      ))}
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Today's Date */}
      <div>
        <label className="text-sm font-bold text-foreground">Today is</label>
        <Input type="date" value={values["today-date"] || ""} onChange={e => handleChange("today-date", e.target.value)} className="mt-1 rounded-xl border-border bg-background text-sm" />
      </div>

      {/* Day Score Start */}
      <div>
        <label className="text-sm font-bold text-foreground">How was my day? The score for my day as I start this journal is</label>
        <p className="text-xs text-muted-foreground mb-2">This is your initial gut-feel score from 1 to 10 that represents how you felt your day went</p>
        <div className="flex items-center gap-3">
          <input type="range" min="1" max="10" value={values["day-score-start"] || "5"} onChange={e => handleChange("day-score-start", e.target.value)} className="flex-1 accent-primary" />
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">{values["day-score-start"] || "5"}</span>
        </div>
      </div>

      {/* Progress & Successes */}
      {renderListField("My Progress & Successes Today", "List 3 things you had success or made progress with. Lower your standards until you find 3 things!", progressList, setProgressList)}

      {/* Pat Yourself */}
      <div>
        <label className="text-sm font-bold text-foreground">Pat Yourself on the Back</label>
        <p className="text-xs text-muted-foreground mb-1">What did you do today that required courage? What positive choice did you make consistent with who you want to become? However small, write it here:</p>
        <Textarea value={values["pat-yourself"] || ""} onChange={e => handleChange("pat-yourself", e.target.value)} placeholder="Your answer..." className="mt-1 min-h-[80px] rounded-xl border-border bg-background resize-y text-sm" />
      </div>

      {/* What have you learned */}
      <div>
        <label className="text-sm font-bold text-foreground">What have you learned?</label>
        <p className="text-xs text-muted-foreground mb-1">What did you learn about yourself today? What inspired you?</p>
        <Textarea value={values["learned"] || ""} onChange={e => handleChange("learned", e.target.value)} placeholder="Your answer..." className="mt-1 min-h-[80px] rounded-xl border-border bg-background resize-y text-sm" />
      </div>

      {/* Goals & Intentions */}
      <div>
        <label className="text-sm font-bold text-foreground">Goals & Intentions:</label>
        <p className="text-xs text-muted-foreground mb-1">What steps did you take today that move you towards your goals or intentions?</p>
        <Textarea value={values["goals-intentions"] || ""} onChange={e => handleChange("goals-intentions", e.target.value)} placeholder="Your answer..." className="mt-1 min-h-[80px] rounded-xl border-border bg-background resize-y text-sm" />
      </div>

      {/* Triggered */}
      <div>
        <label className="text-sm font-bold text-foreground">What, if anything, triggered me today?</label>
        <Textarea value={values["triggered"] || ""} onChange={e => handleChange("triggered", e.target.value)} placeholder="Your answer..." className="mt-1 min-h-[80px] rounded-xl border-border bg-background resize-y text-sm" />
      </div>

      {/* Be kind */}
      <div>
        <label className="text-sm font-bold text-foreground">Where do I need to be kind to myself?</label>
        <p className="text-xs text-muted-foreground mb-1">Where, if you had been kinder to yourself, would you have been happier today?</p>
        <Textarea value={values["be-kind"] || ""} onChange={e => handleChange("be-kind", e.target.value)} placeholder="Your answer..." className="mt-1 min-h-[80px] rounded-xl border-border bg-background resize-y text-sm" />
      </div>

      {/* Looking After You */}
      <div>
        <label className="text-sm font-bold text-foreground">Looking after You!</label>
        <p className="text-xs text-muted-foreground mb-1">What did I do today just for me?</p>
        <Textarea value={values["looking-after-you"] || ""} onChange={e => handleChange("looking-after-you", e.target.value)} placeholder="Your answer..." className="mt-1 min-h-[80px] rounded-xl border-border bg-background resize-y text-sm" />
      </div>

      {/* Gratitude */}
      {renderListField("Gratitude & Appreciation", "3 things that you're grateful for (or appreciated) today. ESSENTIAL: Lower your standards until you find 3 things to genuinely appreciate!", gratitudeList, setGratitudeList)}

      {/* Day Score End */}
      <div>
        <label className="text-sm font-bold text-foreground">The score I now give my day as I complete this journal is</label>
        <p className="text-xs text-muted-foreground mb-2">This is your gut-feel score from 1 to 10 that represents how your day went now you have reviewed your day with a more positive mindset</p>
        <div className="flex items-center gap-3">
          <input type="range" min="1" max="10" value={values["day-score-end"] || "5"} onChange={e => handleChange("day-score-end", e.target.value)} className="flex-1 accent-primary" />
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">{values["day-score-end"] || "5"}</span>
        </div>
      </div>

      {/* What do I notice */}
      <div>
        <label className="text-sm font-bold text-foreground">What do I notice?</label>
        <p className="text-xs text-muted-foreground mb-1">Make a note here of what you've learned and anything else you may want to record like what you noticed as you reflected, things you may want to do differently tomorrow etc.</p>
        <Textarea value={values["notice"] || ""} onChange={e => handleChange("notice", e.target.value)} placeholder="Your answer..." className="mt-1 min-h-[100px] rounded-xl border-border bg-background resize-y text-sm" />
      </div>

      {/* Submit */}
      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit} className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 coaching-card-shadow">
        <Send className="h-4 w-4" />Submit
      </motion.button>
    
      <SuccessDialog open={showSuccess} onClose={() => setShowSuccess(false)} />
    </motion.div>
  );
};

export default GratitudeDiaryExercise;
