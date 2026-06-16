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

const STORAGE_KEY = "exercise-history-wacky-wild-goal";

const LIFE_AREAS = [
  "1. Career/Work/Occupation",
  "2. Finances",
  "3. Health (Physical, Mental, Spiritual)",
  "4. Community, Friends and Family",
  "5. Significant Other/Life Partner",
  "6. Personal Growth and Learning",
  "7. Fun, Leisure and Recreation",
  "8. Physical Environment/Home",
];

const WackyWildGoalExercise = ({ onBack }: Props) => {
  const [page, setPage] = useState(0);
  const [brainstormItems, setBrainstormItems] = useState<{ item: string; score: string }[]>([{ item: "", score: "" }]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [selectedGoals, setSelectedGoals] = useState<string[]>([""]);
  const [keyLearnings, setKeyLearnings] = useState<string[]>([""]);
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
    const fb = brainstormItems.filter(i => i.item.trim());
    if (fb.length) data["brainstorm-list"] = JSON.stringify(fb);
    const fg = selectedGoals.filter(i => i.trim());
    if (fg.length) data["selected-goals"] = JSON.stringify(fg);
    const fk = keyLearnings.filter(i => i.trim());
    if (fk.length) data["key-learnings"] = JSON.stringify(fk);

    if (!Object.values(data).some(v => v.trim())) {
      toast({ title: "Please fill in at least one field", variant: "destructive" });
      return;
    }
    const entry: HistoryEntry = { id: Date.now().toString(), date: new Date().toLocaleString(), data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...getHistory()].slice(0, 50)));
    setBrainstormItems([{ item: "", score: "" }]); setValues({}); setSelectedGoals([""]); setKeyLearnings([""]); setPage(0);
    setShowSuccess(true);
  };

  const renderHistoryValue = (raw: string) => {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        if (typeof parsed[0] === "object" && parsed[0]?.item !== undefined) {
          return <ul className="ml-4 list-disc">{parsed.map((r: { item: string; score: string }, i: number) => <li key={i}>{r.item} (Score: {r.score || "–"})</li>)}</ul>;
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
          
          <h1 className="text-xl font-bold text-foreground">Wacky Wild Goal</h1>
        </div>
        <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 rounded-xl bg-card px-4 py-2.5 text-sm font-semibold coaching-card-shadow transition-all hover:coaching-card-shadow-hover">
          <History className="h-4 w-4 text-primary" /><span className="text-foreground">History</span>
        </button>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">Everyone says it's important to have goals, but sometimes we just don't know where to start. The purpose of this exercise is to brainstorm potential goals and identify up to 10 possible areas that could be turned into goals. You can do all 5 stages in one sitting, but it works well to allow yourself 1-2 weeks to complete all the steps.</p>

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

      {/* Page 0: Stage 1 + 2 */}
      {page === 0 && (
        <motion.div key="p0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-5">
          <h3 className="text-sm font-bold" style={{ color: "#0891b2" }}>STAGE 1 – BRAINSTORM A WACKY, WILD LIST of everything you want in your lifetime!</h3>
          <ul className="ml-5 list-disc text-xs text-muted-foreground flex flex-col gap-0.5">
            <li>List below all the <strong>Wacky, Wild and Normal</strong> things you want to BE, DO and HAVE in your life.</li>
            <li>Aim for at least 50 items from big to small: ANYthing and EVERYthing you can think of.</li>
            <li>Write as quickly as you can, keeping your answers brief. This is a brainstorming exercise, so nothing is ruled out here.</li>
            <li>As this is a 'stream of consciousness' approach, <strong>duplicates, silly and meaningless answers are just fine.</strong></li>
          </ul>

          <div className="flex flex-col gap-2">
            {brainstormItems.map((bi, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white bg-primary">{idx + 1}</span>
                <Input value={bi.item} onChange={e => { const c = [...brainstormItems]; c[idx] = { ...c[idx], item: e.target.value }; setBrainstormItems(c); }} placeholder="Item..." className="flex-1 rounded-xl border-border bg-background text-sm" />
                <Input value={bi.score} onChange={e => { const c = [...brainstormItems]; c[idx] = { ...c[idx], score: e.target.value }; setBrainstormItems(c); }} placeholder="Score" className="w-20 rounded-xl border-border bg-background text-sm text-center" />
                {brainstormItems.length > 1 && (
                  <button onClick={() => { const c = [...brainstormItems]; c.splice(idx, 1); setBrainstormItems(c); }} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><X className="h-4 w-4" /></button>
                )}
              </motion.div>
            ))}
            <button onClick={() => setBrainstormItems([...brainstormItems, { item: "", score: "" }])} className="mt-1 flex items-center gap-2 self-start rounded-xl px-3 py-2 text-sm font-semibold text-primary hover:bg-muted">
              <Plus className="h-4 w-4" />Add item
            </button>
          </div>

          <h3 className="text-sm font-bold mt-3" style={{ color: "#ea580c" }}>STAGE 2 – DISCOVER WHICH GOALS are most meaningful for you</h3>
          <p className="text-xs text-muted-foreground">Now, for each item on your Wacky, Wild Brainstorm List above, score 1 point for EACH of the 8 elements below that <strong>would be improved</strong> if you achieved that goal. Then write the total score next to each item above.</p>
          <div className="rounded-xl border border-border bg-muted/50 p-3">
            <p className="text-xs font-bold text-foreground mb-1">Here are the elements you will use to score each item:</p>
            <ul className="ml-4 list-decimal text-xs text-muted-foreground flex flex-col gap-0.5">
              {LIFE_AREAS.map(a => <li key={a}>{a.substring(3)}</li>)}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-muted/50 p-3">
            <p className="text-xs font-bold text-foreground mb-1">NOTES:</p>
            <ul className="ml-4 list-disc text-xs text-muted-foreground flex flex-col gap-0.5">
              <li>Because there are 8 categories, the maximum possible score for any item on your brainstorming list is 8.</li>
              <li>Think carefully: Only give your item a point if it truly improves one of the eight elements above.</li>
              <li>Yes, you can score 0.5 points</li>
            </ul>
          </div>
        </motion.div>
      )}

      {/* Page 1: Stage 3 */}
      {page === 1 && (
        <motion.div key="p1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4">
          <h3 className="text-sm font-bold" style={{ color: "#0891b2" }}>STAGE 3 – REVIEW Your Learnings</h3>
          <p className="text-xs text-muted-foreground">Take another look at your Wacky, Wild Brainstorm List above and answer the following:</p>

          {[
            { id: "highest-scores", label: "Which goals have the highest scores?" },
            { id: "surprises", label: "What surprises (if any) are there as you review your scores?" },
            { id: "focus-in-life", label: "Where do you normally place your focus in life? Why do you think that is?" },
            { id: "learned-about-self", label: "What have you learned about yourself so far from this exercise? What common themes are there? What else?" },
          ].map(field => (
            <div key={field.id}>
              <label className="text-xs font-bold text-foreground">{field.label}</label>
              <Textarea value={values[field.id] || ""} onChange={e => handleChange(field.id, e.target.value)} placeholder="Your answer..." className="mt-1 min-h-[80px] rounded-xl border-border bg-background resize-y text-sm" />
            </div>
          ))}

          <h3 className="text-sm font-bold mt-3" style={{ color: "#ea580c" }}>STAGE 4 – SELECT 10 ITEMS from your list as possible goals</h3>
          <ul className="ml-5 list-disc text-xs text-muted-foreground flex flex-col gap-0.5">
            <li>Choose 10 items from above. These don't have to be the highest scoring items, but they'll probably have high scores.</li>
            <li>Then in one brief sentence write below WHY the goal is important to you.</li>
            <li>IMPORTANT: If you're unable to come up with a meaningful reason why – ask yourself why is this goal still on the list?</li>
          </ul>
          <div className="flex flex-col gap-2">
            {selectedGoals.map((goal, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white bg-primary">{idx + 1}</span>
                <Input value={goal} onChange={e => { const c = [...selectedGoals]; c[idx] = e.target.value; setSelectedGoals(c); }} placeholder={`Goal ${idx + 1} and why...`} className="flex-1 rounded-xl border-border bg-background text-sm" />
                {selectedGoals.length > 1 && (
                  <button onClick={() => { const c = [...selectedGoals]; c.splice(idx, 1); setSelectedGoals(c); }} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><X className="h-4 w-4" /></button>
                )}
              </motion.div>
            ))}
            {selectedGoals.length < 10 && (
              <button onClick={() => setSelectedGoals([...selectedGoals, ""])} className="mt-1 flex items-center gap-2 self-start rounded-xl px-3 py-2 text-sm font-semibold text-primary hover:bg-muted">
                <Plus className="h-4 w-4" />Add goal
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Page 2: Stage 5 */}
      {page === 2 && (
        <motion.div key="p2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4">
          <h3 className="text-sm font-bold" style={{ color: "#ea580c" }}>STAGE 5 – What are the 3 key learnings that you can take away?</h3>
          <p className="text-xs text-muted-foreground">So, now you have 10 goals to work with. To wrap up this exercise, summarize what you have learned about yourself below:</p>
          <div className="flex flex-col gap-2">
            {keyLearnings.map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white bg-primary">{idx + 1}</span>
                <Input value={item} onChange={e => { const c = [...keyLearnings]; c[idx] = e.target.value; setKeyLearnings(c); }} placeholder={`Learning ${idx + 1}...`} className="flex-1 rounded-xl border-border bg-background text-sm" />
                {keyLearnings.length > 1 && (
                  <button onClick={() => { const c = [...keyLearnings]; c.splice(idx, 1); setKeyLearnings(c); }} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><X className="h-4 w-4" /></button>
                )}
              </motion.div>
            ))}
            {keyLearnings.length < 5 && (
              <button onClick={() => setKeyLearnings([...keyLearnings, ""])} className="mt-1 flex items-center gap-2 self-start rounded-xl px-3 py-2 text-sm font-semibold text-primary hover:bg-muted">
                <Plus className="h-4 w-4" />Add learning
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

export default WackyWildGoalExercise;
