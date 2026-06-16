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

const STORAGE_KEY = "exercise-history-discover-yourself";

const DiscoverYourselfExercise = ({ onBack }: Props) => {
  const [page, setPage] = useState(0);
  const [qualities, setQualities] = useState<string[]>(["", ""]);
  const [bridge1, setBridge1] = useState<string[]>(["", ""]);
  const [bridge2, setBridge2] = useState<string[]>(["", ""]);
  const [bridge3, setBridge3] = useState<string[]>(["", ""]);
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
    const copy = [...list]; copy[idx] = val; setList(copy);
  };

  const addToList = (list: string[], setList: (v: string[]) => void) => {
    if (list.length < 20) setList([...list, ""]);
  };

  const removeFromList = (list: string[], setList: (v: string[]) => void, idx: number) => {
    if (list.length > 1) { const c = [...list]; c.splice(idx, 1); setList(c); }
  };

  const handleSubmit = () => {
    const data: Record<string, string> = { ...values };
    const fq = qualities.filter(q => q.trim());
    const fb1 = bridge1.filter(q => q.trim());
    const fb2 = bridge2.filter(q => q.trim());
    const fb3 = bridge3.filter(q => q.trim());
    if (fq.length) data["qualities"] = JSON.stringify(fq);
    if (fb1.length) data["bridge-1-give-away"] = JSON.stringify(fb1);
    if (fb2.length) data["bridge-2-give-away"] = JSON.stringify(fb2);
    if (fb3.length) data["bridge-3-give-away"] = JSON.stringify(fb3);

    if (!Object.values(data).some(v => v.trim())) {
      toast({ title: "Please fill in at least one field", variant: "destructive" });
      return;
    }
    const entry: HistoryEntry = { id: Date.now().toString(), date: new Date().toLocaleString(), data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...getHistory()].slice(0, 50)));
    setQualities(["", ""]); setBridge1(["", ""]); setBridge2(["", ""]); setBridge3(["", ""]);
    setValues({}); setPage(0);
    setShowSuccess(true);
  };

  const renderListField = (label: string, list: string[], setList: (v: string[]) => void) => (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-foreground">{label}</label>
      {list.map((item, idx) => (
        <motion.div key={idx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white bg-primary">{idx + 1}</span>
          <Input value={item} onChange={e => updateList(list, setList, idx, e.target.value)} placeholder={`Item ${idx + 1}...`} className="flex-1 rounded-xl border-border bg-background text-sm" />
          {list.length > 1 && (
            <button onClick={() => removeFromList(list, setList, idx)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><X className="h-4 w-4" /></button>
          )}
        </motion.div>
      ))}
      {list.length < 20 && (
        <button onClick={() => addToList(list, setList)} className="mt-1 flex items-center gap-2 self-start rounded-xl px-3 py-2 text-sm font-semibold text-primary hover:bg-muted">
          <Plus className="h-4 w-4" />Add item
        </button>
      )}
    </div>
  );

  const renderHistoryValue = (raw: string) => {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return <ul className="ml-4 list-disc">{parsed.map((item: string, i: number) => <li key={i}>{item}</li>)}</ul>;
    } catch { /* plain text */ }
    return <span>{raw}</span>;
  };

  const INTRO_TEXT = `In this exercise you'll imagine going on a journey. On this journey you'll cross 3 bridges. And at each bridge, a nasty Troll called Trevor lies in wait for you.

Trevor the Troll is a self-improvement junkie. He wants to be a 'better person' and is following you around to steal your strengths and qualities! He demands that to cross each bridge, you must give 30% of your qualities to him.

At the end of your journey you will have 10% of your qualities left – I wonder which ones?`;

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }} className="flex flex-col gap-5 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          
          <h1 className="text-xl font-bold text-foreground">Discover Yourself</h1>
        </div>
        <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 rounded-xl bg-card px-4 py-2.5 text-sm font-semibold coaching-card-shadow transition-all hover:coaching-card-shadow-hover">
          <History className="h-4 w-4 text-primary" /><span className="text-foreground">History</span>
        </button>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{INTRO_TEXT}</p>

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

      {/* Page 0: Part 1 - Who Am I? */}
      {page === 0 && (
        <motion.div key="p0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4">
          <h3 className="text-sm font-bold" style={{ color: "#0891b2" }}>PART 1: Ask yourself "Who am I?"</h3>
          <p className="text-xs text-muted-foreground">Now write down everything that makes you 'YOU' in the spaces below. Include both your 'GOOD' and 'BAD' qualities.</p>
          <div className="rounded-xl border border-border bg-muted/50 p-3">
            <p className="text-xs font-bold text-foreground">HINT: The qualities you like 'LEAST' about yourself could be helpful on your journey...</p>
          </div>
          {renderListField("Your qualities:", qualities, setQualities)}
        </motion.div>
      )}

      {/* Page 1: Part 2 - The Journey */}
      {page === 1 && (
        <motion.div key="p1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-5">
          <h3 className="text-sm font-bold" style={{ color: "#0891b2" }}>PART 2: Now, you must go on a journey with this newfound self-knowledge</h3>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Imagine you're about to cross <strong>Bridge Number 1</strong>. In order to cross and not be eaten, Trevor the Troll demands you hand over 30 percent of your qualities – who you <u>are</u> – to him!</p>
            {renderListField("List 30% of the qualities below from the above list, you will give away first.", bridge1, setBridge1)}
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Now imagine you're approaching <strong>Bridge Number 2</strong>. Again, in order to cross and not be eaten, Trevor the Troll demands you hand over 30 percent of who you <u>are</u> to him.</p>
            {renderListField("List another 30% of the qualities you will give away next from the list on previous page.", bridge2, setBridge2)}
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">You're about to cross <strong>Bridge Number 3</strong> and it's time for the final visit to your list of qualities. What final 30% of your qualities will you give away? Think hard because the 10% you're left with is all you'll have for the rest of your life. What <em>really</em> matters to you? What is the <em>essence of YOU</em> that you must keep?</p>
            {renderListField("List final 30% of qualities here", bridge3, setBridge3)}
          </div>
        </motion.div>
      )}

      {/* Page 2: Part 3 - Review Time */}
      {page === 2 && (
        <motion.div key="p2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4">
          <h3 className="text-sm font-bold" style={{ color: "#0891b2" }}>PART 3: Review Time</h3>
          <p className="text-xs text-muted-foreground">Now, to wrap up your travels, let's take a look at what you've learned about yourself.</p>

          {[
            { id: "value-most", label: "What do you value MOST about yourself – your top 10%?" },
            { id: "notice-review", label: "What do you notice as you review your most valued qualities?" },
            { id: "easiest-give-up", label: "Which qualities were easiest to give up and why? (the ones you gave up first)" },
            { id: "hardest-give-up", label: "Which qualities were hardest to give up and why? (the ones you gave up last)" },
            { id: "tend-to-focus", label: "Which qualities do you tend to focus on in life, and why do you think that is?" },
            { id: "learned", label: "What else have you learned about yourself from this exercise?" },
          ].map(field => (
            <div key={field.id}>
              <label className="text-xs font-bold text-foreground">{field.label}</label>
              <Textarea value={values[field.id] || ""} onChange={e => handleChange(field.id, e.target.value)} placeholder="Your answer..." className="mt-1 min-h-[80px] rounded-xl border-border bg-background resize-y text-sm" />
            </div>
          ))}
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

export default DiscoverYourselfExercise;
