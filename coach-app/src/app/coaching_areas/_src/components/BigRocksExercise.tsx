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

const STORAGE_KEY = "exercise-history-big-rocks";

const BigRocksExercise = ({ onBack }: Props) => {
  const [page, setPage] = useState(0);
  const [timeSpentList, setTimeSpentList] = useState<string[]>([""]);
  const [priorities, setPriorities] = useState<string[]>([""]);
  const [bigRocks, setBigRocks] = useState<string[]>([""]);
  const [pebbles, setPebbles] = useState<string[]>([""]);
  const [sand, setSand] = useState<string[]>([""]);
  const [commitActions, setCommitActions] = useState<{ action: string; byWhen: string }[]>([{ action: "", byWhen: "" }]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [showHistory, setShowHistory] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const getHistory = (): HistoryEntry[] => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  };
  const history = getHistory();

  const handleChange = (key: string, val: string) => setValues(p => ({ ...p, [key]: val }));

  const updateList = (list: string[], setList: (v: string[]) => void, idx: number, val: string) => {
    const c = [...list]; c[idx] = val; setList(c);
  };

  const handleSubmit = () => {
    const data: Record<string, string> = { ...values };
    const save = (key: string, list: string[]) => { const f = list.filter(i => i.trim()); if (f.length) data[key] = JSON.stringify(f); };
    save("time-spent", timeSpentList);
    save("top-priorities", priorities);
    save("big-rocks", bigRocks);
    save("pebbles", pebbles);
    save("sand", sand);
    const fa = commitActions.filter(a => a.action.trim());
    if (fa.length) data["commit-actions"] = JSON.stringify(fa);

    if (!Object.values(data).some(v => v.trim())) {
      toast({ title: "Please fill in at least one field", variant: "destructive" });
      return;
    }
    const entry: HistoryEntry = { id: Date.now().toString(), date: new Date().toLocaleString(), data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...getHistory()].slice(0, 50)));
    setTimeSpentList([""]); setPriorities([""]); setBigRocks([""]); setPebbles([""]); setSand([""]);
    setCommitActions([{ action: "", byWhen: "" }]); setValues({}); setPage(0);
    setShowSuccess(true);
  };

  const renderListField = (label: string, list: string[], setList: (v: string[]) => void, max = 15) => (
    <div>
      <label className="text-xs font-bold text-foreground">{label}</label>
      <div className="flex flex-col gap-2 mt-1">
        {list.map((item, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
            <Input value={item} onChange={e => updateList(list, setList, idx, e.target.value)} placeholder={`Item ${idx + 1}...`} className="flex-1 rounded-xl border-border bg-background text-sm" />
            {list.length > 1 && (
              <button onClick={() => { const c = [...list]; c.splice(idx, 1); setList(c); }} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><X className="h-4 w-4" /></button>
            )}
          </motion.div>
        ))}
        {list.length < max && (
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
      if (Array.isArray(parsed)) {
        if (typeof parsed[0] === "object" && parsed[0]?.action !== undefined) {
          return <ul className="ml-4 list-disc">{parsed.map((r: { action: string; byWhen: string }, i: number) => <li key={i}>{r.action} (by {r.byWhen || "–"})</li>)}</ul>;
        }
        return <ul className="ml-4 list-disc">{parsed.map((item: string, i: number) => <li key={i}>{item}</li>)}</ul>;
      }
    } catch { /* plain text */ }
    return <span>{raw}</span>;
  };

  const INTRO = `A teacher addresses his class. He fills a jar with big rocks and asks the class if it's full. The class responds with a "YES". So he adds pebbles to the jar and asks again if the jar is full. Again the class responds, "YES". He says "NO" and now adds sand to the jar.

The sand and pebbles represent the small daily tasks we all fill our life with. If we don't fit our big rocks in first, our lives will fill with only sand and pebbles. But if we start with our big rocks, we create room for what's most important in life – and the sand and pebbles can only fill the spaces in between.`;

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }} className="flex flex-col gap-5 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          
          <h1 className="text-xl font-bold text-foreground">Big Rocks and Little Rocks</h1>
        </div>
        <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 rounded-xl bg-card px-4 py-2.5 text-sm font-semibold coaching-card-shadow transition-all hover:coaching-card-shadow-hover">
          <History className="h-4 w-4 text-primary" /><span className="text-foreground">History</span>
        </button>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{INTRO}</p>

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
        {[0, 1, 2].map(i => (
          <div key={i} className={`h-2 rounded-full transition-all ${page === i ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"}`} />
        ))}
      </div>

      {/* Page 0: Part 1 */}
      {page === 0 && (
        <motion.div key="p0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4">
          <h3 className="text-sm font-bold" style={{ color: "#ea580c" }}>Part 1: Review your Current Priorities</h3>

          <div>
            <label className="text-xs font-bold text-foreground">Where or on what do you currently spend most of your time?</label>
            <p className="text-xs text-muted-foreground mb-1">Make a list of whatever jumps into your mind.</p>
            {renderListField("", timeSpentList, setTimeSpentList)}
          </div>

          <div>
            <label className="text-xs font-bold text-foreground">Currently, what's the ONE biggest, unwanted thing that ZAPS your time?</label>
            <p className="text-xs text-muted-foreground mb-1">This is an unwelcome time-zapper – not things that you want or are a necessary part of your life.</p>
            <Textarea value={values["time-zapper"] || ""} onChange={e => handleChange("time-zapper", e.target.value)} placeholder="Your answer..." className="mt-1 min-h-[70px] rounded-xl border-border bg-background resize-y text-sm" />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground">What needs to change?</label>
            <Textarea value={values["needs-to-change"] || ""} onChange={e => handleChange("needs-to-change", e.target.value)} placeholder="Your answer..." className="mt-1 min-h-[70px] rounded-xl border-border bg-background resize-y text-sm" />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground">Take a few moments to think about what's TRULY important to you in your life. What are your Top 3 priorities in life?</label>
            {renderListField("", priorities, setPriorities, 5)}
          </div>

          <div>
            <label className="text-xs font-bold text-foreground">What one thing is MOST IMPORTANT to you right now?</label>
            <Input value={values["most-important"] || ""} onChange={e => handleChange("most-important", e.target.value)} placeholder="Your answer..." className="mt-1 rounded-xl border-border bg-background text-sm" />
          </div>
        </motion.div>
      )}

      {/* Page 1: Part 2 */}
      {page === 1 && (
        <motion.div key="p1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4">
          <h3 className="text-sm font-bold" style={{ color: "#0891b2" }}>Part 2: Identify & Prioritise Your Rocks!</h3>

          <div className="rounded-xl border border-border bg-muted/50 p-3">
            <p className="text-xs font-bold text-foreground mb-1">INSTRUCTIONS:</p>
            <ol className="ml-4 list-decimal text-xs text-muted-foreground flex flex-col gap-0.5">
              <li>Using the story we started with as your guide, write your key priorities/activities under "Big Rocks" below.</li>
              <li>Now fill in the smaller rocks under "Pebbles" – with your next (lower) level of priorities/activities.</li>
              <li>Then, as in any gaps between the rocks that were filled with sand, write your lowest priorities/activities under "Sand".</li>
              <li>Finally, add a priority to your "Big Rocks" from 1 to 5.</li>
            </ol>
            <p className="text-xs text-muted-foreground mt-2"><strong>TIP:</strong> Use this tool regularly to visually prioritize your week/month and ensure you schedule your "Big Rocks" first.</p>
          </div>

          {renderListField("Big Rocks", bigRocks, setBigRocks)}
          {renderListField("Pebbles", pebbles, setPebbles)}
          {renderListField("Sand", sand, setSand)}
        </motion.div>
      )}

      {/* Page 2: Part 3 */}
      {page === 2 && (
        <motion.div key="p2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4">
          <h3 className="text-sm font-bold" style={{ color: "#0891b2" }}>Part 3: Review your Learnings & Take Action</h3>

          <p className="text-xs font-bold text-foreground">Review</p>
          {[
            { id: "compare-priorities", label: 'How does where you currently spend your time compare to your "Big Rocks" and your real priorities?' },
            { id: "what-tells-you", label: "What does this tell you?" },
            { id: "biggest-learning", label: "To wrap-up, what is the BIGGEST thing you learned about yourself from this exercise?" },
          ].map(field => (
            <div key={field.id}>
              <label className="text-xs font-bold text-foreground">{field.label}</label>
              <Textarea value={values[field.id] || ""} onChange={e => handleChange(field.id, e.target.value)} placeholder="Your answer..." className="mt-1 min-h-[80px] rounded-xl border-border bg-background resize-y text-sm" />
            </div>
          ))}

          <h4 className="text-xs font-bold" style={{ color: "#ea580c" }}>What Needs to Change?</h4>
          {[
            { id: "do-differently", label: "What could you do differently?" },
            { id: "easiest-change", label: "What is the EASIEST change/s you could make to prioritize your time better?" },
            { id: "willing-to-change", label: "What are you WILLING to change to prioritize your time better?" },
            { id: "smash-obstacles", label: "Smash those Obstacles. What could get in the way? If you were going to sabotage yourself how would you do it?" },
          ].map(field => (
            <div key={field.id}>
              <label className="text-xs font-bold text-foreground">{field.label}</label>
              <Textarea value={values[field.id] || ""} onChange={e => handleChange(field.id, e.target.value)} placeholder="Your answer..." className="mt-1 min-h-[80px] rounded-xl border-border bg-background resize-y text-sm" />
            </div>
          ))}

          <h4 className="text-xs font-bold" style={{ color: "#ea580c" }}>What will you Commit to?</h4>
          <p className="text-xs text-muted-foreground mb-1">What will you change or do differently? Review this entire worksheet and identify 3 actions you'll take to focus on your "Big Rocks" in life:</p>
          <div className="flex flex-col gap-2">
            {commitActions.map((ca, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white bg-primary">{idx + 1}</span>
                <Input value={ca.action} onChange={e => { const c = [...commitActions]; c[idx] = { ...c[idx], action: e.target.value }; setCommitActions(c); }} placeholder="Action..." className="flex-1 rounded-xl border-border bg-background text-sm" />
                <Input value={ca.byWhen} onChange={e => { const c = [...commitActions]; c[idx] = { ...c[idx], byWhen: e.target.value }; setCommitActions(c); }} placeholder="by When" className="w-28 rounded-xl border-border bg-background text-sm" />
                {commitActions.length > 1 && (
                  <button onClick={() => { const c = [...commitActions]; c.splice(idx, 1); setCommitActions(c); }} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><X className="h-4 w-4" /></button>
                )}
              </motion.div>
            ))}
            {commitActions.length < 5 && (
              <button onClick={() => setCommitActions([...commitActions, { action: "", byWhen: "" }])} className="mt-1 flex items-center gap-2 self-start rounded-xl px-3 py-2 text-sm font-semibold text-primary hover:bg-muted">
                <Plus className="h-4 w-4" />Add action
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        {page > 0 ? (
          <button onClick={() => setPage(page - 1)} className="text-sm font-semibold text-muted-foreground hover:text-foreground">Previous</button>
        ) : <div />}
        {page < 2 ? (
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

export default BigRocksExercise;
