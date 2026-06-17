import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, History, Clock, ChevronDown, ChevronUp, Send, Plus, X, ChevronRight } from "lucide-react";
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

const STORAGE_KEY = "exercise-history-smart-goals";

const SmartGoalsExercise = ({ onBack }: Props) => {
  const [page, setPage] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [actions, setActions] = useState<{ action: string; byWhen: string }[]>([{ action: "", byWhen: "" }]);
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
    const fa = actions.filter(a => a.action.trim());
    if (fa.length) data["smart-actions"] = JSON.stringify(fa);

    if (!Object.values(data).some(v => v.trim())) {
      toast({ title: "Please fill in at least one field", variant: "destructive" });
      return;
    }
    const entry: HistoryEntry = { id: Date.now().toString(), date: new Date().toLocaleString(), data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...getHistory()].slice(0, 50)));
    setValues({}); setActions([{ action: "", byWhen: "" }]); setPage(0);
    setShowSuccess(true);
  };

  const renderHistoryValue = (raw: string) => {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        if (typeof parsed[0] === "object" && parsed[0]?.action !== undefined) {
          return <ul className="ml-4 list-disc">{parsed.map((r: { action: string; byWhen: string }, i: number) => <li key={i}>{r.action} (by {r.byWhen || "–"})</li>)}</ul>;
        }
        return <ul className="ml-4 list-disc">{parsed.map((item: string, i: number) => <li key={i}>{item}</li>)}</ul>;
      }
    } catch { /* plain text */ }
    return <span>{raw}</span>;
  };

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }} className="flex flex-col gap-5 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          
          <h1 className="text-xl font-bold text-foreground">Make Your Goals SMART!</h1>
        </div>
        <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 rounded-xl bg-card px-4 py-2.5 text-sm font-semibold coaching-card-shadow transition-all hover:coaching-card-shadow-hover">
          <History className="h-4 w-4 text-primary" /><span className="text-foreground">History</span>
        </button>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">SMART Goals set you up for success! When your goals are clear and you know exactly what you're working towards it's easier to get started, make action plans, see your progress and succeed!</p>
      <p className="text-xs text-muted-foreground">Follow the steps below to learn about SMART goals – and begin to develop a goal of your own. Then turn to Page 2 to write out your finished SMART Goals, identify 3 actions to get started.</p>

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

      {/* Page indicator */}
      <div className="flex items-center justify-center gap-2">
        {[0, 1].map(i => (
          <div key={i} className={`h-2 rounded-full transition-all ${page === i ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"}`} />
        ))}
      </div>

      {/* Page 0: SMART breakdown */}
      {page === 0 && (
        <motion.div key="p0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-5">
          <div>
            <label className="text-xs font-bold text-foreground">What do you want to set a goal around?</label>
            <Input value={values["goal-area"] || ""} onChange={e => handleChange("goal-area", e.target.value)} placeholder="Your goal area..." className="mt-1 rounded-xl border-border bg-background text-sm" />
          </div>

          {/* SPECIFIC */}
          <div>
            <h3 className="text-sm font-bold" style={{ color: "#0891b2" }}>SPECIFIC</h3>
            <p className="text-xs text-muted-foreground mb-2">Have you ever struggled to get started because your goals id too fuzzy? Well, the more specific you are, the easier your goal is to start, work towards & achieve. Get clear here! <strong>What are the outcomes you're looking for? What results do you want?</strong></p>
            <label className="text-xs font-bold text-foreground">Write out your goal (what you want) below, and make it as SPECIFIC as you can:</label>
            <Textarea value={values["specific"] || ""} onChange={e => handleChange("specific", e.target.value)} placeholder="Your specific goal..." className="mt-1 min-h-[80px] rounded-xl border-border bg-background resize-y text-sm" />
          </div>

          {/* MEASURABLE */}
          <div>
            <h3 className="text-sm font-bold" style={{ color: "#ea580c" }}>MEASURABLE</h3>
            <p className="text-xs text-muted-foreground mb-2">A measure lets you know you've achieved your goal, and also enables you to track your progress. <strong>How would you prove your goal is complete?</strong> This points to your measure. It could be a financial amount, a count, percentage or some other measure.</p>
            <label className="text-xs font-bold text-foreground">Rewrite your goal to include a MEASURE – or how you would PROVE your success:</label>
            <Textarea value={values["measurable"] || ""} onChange={e => handleChange("measurable", e.target.value)} placeholder="Your measurable goal..." className="mt-1 min-h-[80px] rounded-xl border-border bg-background resize-y text-sm" />
          </div>

          {/* ACTIONABLE */}
          <div>
            <h3 className="text-sm font-bold" style={{ color: "#0891b2" }}>ACTIONABLE</h3>
            <p className="text-xs text-muted-foreground mb-2">These goals are within your control. This means you are able to make it happen (even if you need help to get there). For example, "winning the lottery" is <em>not</em> 'Actionable' as you do not have agency – the power – to make this goal happen.</p>
            <label className="text-xs font-bold text-foreground">Write out 3 Key Action steps you can take to achieve this goal:</label>
            <div className="flex flex-col gap-2 mt-1">
              {["action-step-1", "action-step-2", "action-step-3"].map((id, idx) => (
                <div key={id} className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white bg-primary">{idx + 1}</span>
                  <Input value={values[id] || ""} onChange={e => handleChange(id, e.target.value)} placeholder={`Action step ${idx + 1}...`} className="flex-1 rounded-xl border-border bg-background text-sm" />
                </div>
              ))}
            </div>
          </div>

          {/* REALISTIC */}
          <div>
            <h3 className="text-sm font-bold" style={{ color: "#ea580c" }}>REALISTIC</h3>
            <p className="text-xs text-muted-foreground mb-2">It's important to feel good about your goals! Goals need to be challenging enough to inspire – you need to believe you can achieve it. <strong>What's reasonable given the commitments you have?</strong> Consider your lifestyle, then adjust your goal so it's inspiring AND achievable:</p>
            <label className="text-xs font-bold text-foreground">Rewrite your goal, ensuring it is REALISTIC:</label>
            <Textarea value={values["realistic"] || ""} onChange={e => handleChange("realistic", e.target.value)} placeholder="Your realistic goal..." className="mt-1 min-h-[80px] rounded-xl border-border bg-background resize-y text-sm" />
          </div>

          {/* TIME-BOUND */}
          <div>
            <h3 className="text-sm font-bold" style={{ color: "#0891b2" }}>TIME-BOUND</h3>
            <p className="text-xs text-muted-foreground mb-2">These goals motivate us, giving us a date to aim at and plan towards. <strong>Is there a specific date you're aiming at?</strong> If not, what might be reasonable? Consider your lifestyle, other responsibilities and life events that could get in the way.</p>
            <label className="text-xs font-bold text-foreground">By when would you like to complete your goal?</label>
            <Input type="date" value={values["time-bound"] || ""} onChange={e => handleChange("time-bound", e.target.value)} className="mt-1 rounded-xl border-border bg-background text-sm" />
          </div>
        </motion.div>
      )}

      {/* Page 1: Final SMART Goal */}
      {page === 1 && (
        <motion.div key="p1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-5">
          <div className="rounded-xl border border-border bg-muted/50 p-4">
            <h3 className="text-sm font-bold mb-2" style={{ color: "#ea580c" }}>Before writing out the final version of your SMART Goal, read this final tip:</h3>
            <p className="text-xs text-muted-foreground mb-2"><strong>Great GOALS are stated in the POSITIVE:</strong> Why? Because we get what we focus on. Whenever we say "I want to stop biting my fingernails" our brain has to first build a picture of what you DON'T want– bitten fingernails – in order not to do it, so it's good to build a picture of what you're working towards, rather than building a picture of what you don't want. Here are two examples:</p>
            <ul className="ml-4 list-disc text-xs text-muted-foreground flex flex-col gap-0.5">
              <li>Use "I have healthy fingernails" rather than "I want to stop biting my nails"</li>
              <li>Use "I weigh 150lbs." rather than "I want to loose 20lbs."</li>
            </ul>
          </div>

          <h3 className="text-sm font-bold" style={{ color: "#0891b2" }}>Write your finished SMART goal here</h3>

          <div>
            <label className="text-xs font-bold text-foreground">My SMART Goal is to</label>
            <Textarea value={values["final-smart-goal"] || ""} onChange={e => handleChange("final-smart-goal", e.target.value)} placeholder="Your finished SMART goal..." className="mt-1 min-h-[100px] rounded-xl border-border bg-background resize-y text-sm" />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground">by</label>
            <Input type="date" value={values["final-date"] || ""} onChange={e => handleChange("final-date", e.target.value)} className="mt-1 rounded-xl border-border bg-background text-sm" />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground">Write out the first 3 Steps towards your SMART Goal below:</label>
            <div className="flex flex-col gap-2 mt-2">
              {actions.map((ca, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white bg-primary">{idx + 1}</span>
                  <Input value={ca.action} onChange={e => { const c = [...actions]; c[idx] = { ...c[idx], action: e.target.value }; setActions(c); }} placeholder="Action..." className="flex-1 rounded-xl border-border bg-background text-sm" />
                  <Input value={ca.byWhen} onChange={e => { const c = [...actions]; c[idx] = { ...c[idx], byWhen: e.target.value }; setActions(c); }} placeholder="by When" className="w-28 rounded-xl border-border bg-background text-sm" />
                  {actions.length > 1 && (
                    <button onClick={() => { const c = [...actions]; c.splice(idx, 1); setActions(c); }} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><X className="h-4 w-4" /></button>
                  )}
                </motion.div>
              ))}
              {actions.length < 5 && (
                <button onClick={() => setActions([...actions, { action: "", byWhen: "" }])} className="mt-1 flex items-center gap-2 self-start rounded-xl px-3 py-2 text-sm font-semibold text-primary hover:bg-muted">
                  <Plus className="h-4 w-4" />Add step
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        {page > 0 ? (
          <button onClick={() => setPage(page - 1)} className="text-sm font-semibold text-muted-foreground hover:text-foreground">Previous</button>
        ) : <div />}
        {page < 1 ? (
          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={() => setPage(page + 1)} className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 coaching-card-shadow">
            Next<ChevronRight className="h-4 w-4" />
          </motion.button>
        ) : (
          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit} className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 coaching-card-shadow">
            <Send className="h-4 w-4" />Submit
          </motion.button>
        )}
      </div>
    
      <SuccessDialog open={showSuccess} onClose={() => setShowSuccess(false)} />
    </motion.div>
  );
};

export default SmartGoalsExercise;
