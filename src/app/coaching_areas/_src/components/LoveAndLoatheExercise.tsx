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

const STORAGE_KEY = "exercise-history-love-loathe";

const LoveAndLoatheExercise = ({ onBack }: Props) => {
  const [page, setPage] = useState(0);
  const [loveItems, setLoveItems] = useState<{ item: string; number: string }[]>([{ item: "", number: "" }]);
  const [loatheItems, setLoatheItems] = useState<{ item: string; number: string }[]>([{ item: "", number: "" }]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [actionItems, setActionItems] = useState<{ action: string; byWhen: string }[]>([{ action: "", byWhen: "" }]);
  const [reduceItems, setReduceItems] = useState<string[]>([""]);
  const [increaseItems, setIncreaseItems] = useState<string[]>([""]);
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
    const merged: Record<string, string> = { ...values };
    const filteredLove = loveItems.filter((i) => i.item.trim());
    const filteredLoathe = loatheItems.filter((i) => i.item.trim());
    const filteredActions = actionItems.filter((i) => i.action.trim());
    const filteredReduce = reduceItems.filter((i) => i.trim());
    const filteredIncrease = increaseItems.filter((i) => i.trim());

    if (filteredLove.length > 0) merged["love"] = JSON.stringify(filteredLove);
    if (filteredLoathe.length > 0) merged["loathe"] = JSON.stringify(filteredLoathe);
    if (filteredActions.length > 0) merged["actions"] = JSON.stringify(filteredActions);
    if (filteredReduce.length > 0) merged["reduce-loathe"] = JSON.stringify(filteredReduce);
    if (filteredIncrease.length > 0) merged["increase-love"] = JSON.stringify(filteredIncrease);

    const hasContent = Object.values(merged).some((v) => v.trim());
    if (!hasContent) {
      toast({ title: "Please fill in at least one field", variant: "destructive" });
      return;
    }
    const entry: HistoryEntry = { id: Date.now().toString(), date: new Date().toLocaleString(), data: merged };
    const prev = getHistory();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...prev].slice(0, 50)));
    setValues({});
    setLoveItems([{ item: "", number: "" }]);
    setLoatheItems([{ item: "", number: "" }]);
    setActionItems([{ action: "", byWhen: "" }]);
    setReduceItems([""]);
    setIncreaseItems([""]);
    setPage(0);
    setShowSuccess(true);
  };

  const description = "Get happier at work- or in your personal life. This deceptively simple exercise helps you bring more of what you love and cut out you 'loathe'.";

  const renderTableItems = (
    items: { item: string; number: string }[],
    setItems: React.Dispatch<React.SetStateAction<{ item: string; number: string }[]>>,
    label: string,
    color: string
  ) => (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <p className="flex-1 text-xs font-semibold text-muted-foreground">{label}</p>
        <p className="w-20 text-xs font-semibold text-muted-foreground text-center">Number</p>
        <div className="w-8 shrink-0" />
      </div>
      {items.map((row, idx) => (
        <motion.div key={idx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
          <Input value={row.item} onChange={(e) => { const n = [...items]; n[idx] = { ...n[idx], item: e.target.value }; setItems(n); }} placeholder={`${label}...`} className="flex-1 rounded-xl border-border bg-background text-sm" />
          <Input value={row.number} onChange={(e) => { const n = [...items]; n[idx] = { ...n[idx], number: e.target.value }; setItems(n); }} placeholder="#" className="w-20 rounded-xl border-border bg-background text-sm text-center" />
          {items.length > 1 && (
            <button onClick={() => { const n = [...items]; n.splice(idx, 1); setItems(n); }} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><X className="h-4 w-4" /></button>
          )}
          {items.length <= 1 && <div className="w-8 shrink-0" />}
        </motion.div>
      ))}
      <button onClick={() => setItems([...items, { item: "", number: "" }])} className="mt-1 flex items-center gap-2 self-start rounded-xl px-3 py-2 text-sm font-semibold hover:bg-muted" style={{ color }}>
        <Plus className="h-4 w-4" />Add item
      </button>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }} className="flex flex-col gap-5 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          
          <h1 className="text-xl font-bold text-foreground">Love And Loathe List</h1>
        </div>
        <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 rounded-xl bg-card px-4 py-2.5 text-sm font-semibold coaching-card-shadow transition-all hover:coaching-card-shadow-hover">
          <History className="h-4 w-4 text-primary" />
          <span className="text-foreground">History</span>
          {history.length > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">{history.length}</span>
          )}
        </button>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>

      <div className="rounded-xl border border-border bg-muted/50 p-3">
        <ul className="ml-4 list-disc text-xs text-muted-foreground flex flex-col gap-1">
          <li>Over the course of a week or so, make a brief note below whenever you feel great doing (are doing something you LOVE) or are miserable (doing something you LOATHE). The more specific you are, the better.</li>
          <li>If something comes up several times, put a number next to it. Be sure to count each separate instance.</li>
        </ul>
      </div>

      {/* History */}
      {showHistory && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="rounded-2xl border border-border bg-card p-4 coaching-card-shadow">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground"><Clock className="h-4 w-4 text-primary" />Previous Entries</h3>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No history yet.</p>
          ) : (
            <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
              {history.map((entry) => (
                <button key={entry.id} onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)} className="w-full rounded-xl border border-border bg-background p-3 text-left transition-all hover:bg-muted/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">{entry.date}</span>
                    {expandedEntry === entry.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  {expandedEntry === entry.id && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 flex flex-col gap-2 text-sm">
                      {Object.entries(entry.data).filter(([, v]) => v.trim()).map(([k, v]) => (
                        <div key={k}><span className="text-xs text-muted-foreground capitalize">{k.replace(/-/g, " ")}</span><div className="text-foreground whitespace-pre-wrap">{v}</div></div>
                      ))}
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Page 0: Love & Loathe lists */}
      {page === 0 && (
        <motion.div key="page0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
          {/* LOVE */}
          <div>
            <h2 className="text-lg font-bold mb-1" style={{ color: "#dc2626" }}>LOVE</h2>
            <p className="text-xs font-semibold text-foreground mb-3">You feel great, look forward to doing it, or simply enjoy it immensely. Be specific!</p>
            {renderTableItems(loveItems, setLoveItems, "Love", "#dc2626")}
          </div>

          {/* LOATHE */}
          <div>
            <h2 className="text-lg font-bold mb-1" style={{ color: "#7c3aed" }}>LOATHE</h2>
            <p className="text-xs font-semibold text-foreground mb-3">You feel terrible, dread, or just hate doing this. Be specific!</p>
            {renderTableItems(loatheItems, setLoatheItems, "Loathe", "#7c3aed")}
          </div>

          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={() => setPage(1)} className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 coaching-card-shadow">
            Next<ChevronRight className="h-4 w-4" />
          </motion.button>
        </motion.div>
      )}

      {/* Page 1: Reflection */}
      {page === 1 && (
        <motion.div key="page1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
          {[
            { key: "surprised", label: "Are you surprised by the number of things you love and/or loathe? What did you notice first?" },
            { key: "patterns", label: "Take a closer look. What common threads and patterns can you see?" },
            { key: "significant", label: "What else seems significant or you'd like to make a note of?" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="text-sm font-bold text-foreground">{label}</label>
              <Textarea value={values[key] || ""} onChange={(e) => handleChange(key, e.target.value)} placeholder="Enter your thoughts..." className="mt-1 min-h-[80px] rounded-xl border-border bg-background resize-y text-sm" />
            </div>
          ))}

          {/* Reduce loathe - list */}
          <div>
            <label className="text-sm font-bold text-foreground">So, if some ideas were to spring to mind, how could you REDUCE doing what you LOATHE or make doing it a little easier or more pleasurable?</label>
            <div className="flex flex-col gap-2 mt-2">
              {reduceItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input value={item} onChange={(e) => { const n = [...reduceItems]; n[idx] = e.target.value; setReduceItems(n); }} placeholder="Enter idea..." className="flex-1 rounded-xl border-border bg-background text-sm" />
                  {reduceItems.length > 1 && <button onClick={() => { const n = [...reduceItems]; n.splice(idx, 1); setReduceItems(n); }} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><X className="h-4 w-4" /></button>}
                </div>
              ))}
              <button onClick={() => setReduceItems([...reduceItems, ""])} className="mt-1 flex items-center gap-2 self-start rounded-xl px-3 py-2 text-sm font-semibold text-primary hover:bg-muted"><Plus className="h-4 w-4" />Add item</button>
            </div>
          </div>

          {/* Increase love - list */}
          <div>
            <label className="text-sm font-bold text-foreground">And now brainstorm some ideas of things you could do to INCREASE doing what you LOVE. Just whatever pops into your mind for the moment:</label>
            <div className="flex flex-col gap-2 mt-2">
              {increaseItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input value={item} onChange={(e) => { const n = [...increaseItems]; n[idx] = e.target.value; setIncreaseItems(n); }} placeholder="Enter idea..." className="flex-1 rounded-xl border-border bg-background text-sm" />
                  {increaseItems.length > 1 && <button onClick={() => { const n = [...increaseItems]; n.splice(idx, 1); setIncreaseItems(n); }} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><X className="h-4 w-4" /></button>}
                </div>
              ))}
              <button onClick={() => setIncreaseItems([...increaseItems, ""])} className="mt-1 flex items-center gap-2 self-start rounded-xl px-3 py-2 text-sm font-semibold text-primary hover:bg-muted"><Plus className="h-4 w-4" />Add item</button>
            </div>
          </div>

          {/* Thought starters */}
          <div className="rounded-xl border border-border bg-muted/50 p-4">
            <p className="text-xs font-bold text-foreground mb-2">Stuck? Here are some thought starters:</p>
            <ul className="ml-4 list-disc text-xs text-muted-foreground flex flex-col gap-1">
              <li>Find someone who loves to do what you loathe, then barter with them. Offer to swap and do something for them that you enjoy but they don't.</li>
              <li>Add pleasant components to the things you loathe doing. Think of all 5 senses eg. Listen to an inspiring podcast, music, or wear cashmere while you do that dull, loathsome or repetitive task.</li>
              <li>Reward yourself when you complete an unpleasant task with something small but pleasurable like high quality chocolate, a nice cup of tea and a sit down, or a soak in the bath.</li>
              <li>To increase doing what you love, could you volunteer for a project or ask for more, similar tasks in the future? Could you get less pleasant tasks done first and spend longer on the good stuff?</li>
              <li>Where do you waste time on activities like unnecessary email, social media or television that could be spent doing something you truly love?</li>
            </ul>
          </div>

          {/* Actions */}
          <div>
            <label className="text-sm font-bold text-foreground">Finally, what will you do with this information? What are your next steps? (pick at least one)</label>
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2">
                <p className="flex-1 text-xs font-semibold text-muted-foreground">Action</p>
                <p className="w-28 text-xs font-semibold text-muted-foreground text-center">by When</p>
                <div className="w-8 shrink-0" />
              </div>
              {actionItems.map((row, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input value={row.action} onChange={(e) => { const n = [...actionItems]; n[idx] = { ...n[idx], action: e.target.value }; setActionItems(n); }} placeholder="Action..." className="flex-1 rounded-xl border-border bg-background text-sm" />
                  <Input value={row.byWhen} onChange={(e) => { const n = [...actionItems]; n[idx] = { ...n[idx], byWhen: e.target.value }; setActionItems(n); }} placeholder="When..." className="w-28 rounded-xl border-border bg-background text-sm text-center" />
                  {actionItems.length > 1 && <button onClick={() => { const n = [...actionItems]; n.splice(idx, 1); setActionItems(n); }} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><X className="h-4 w-4" /></button>}
                  {actionItems.length <= 1 && <div className="w-8 shrink-0" />}
                </div>
              ))}
              <button onClick={() => setActionItems([...actionItems, { action: "", byWhen: "" }])} className="mt-1 flex items-center gap-2 self-start rounded-xl px-3 py-2 text-sm font-semibold text-primary hover:bg-muted"><Plus className="h-4 w-4" />Add action</button>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={() => setPage(0)} className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-3.5 text-sm font-bold text-foreground transition-all hover:bg-muted coaching-card-shadow">
              Previous
            </motion.button>
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit} className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 coaching-card-shadow">
              <Send className="h-4 w-4" />Submit
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Page indicator */}
      <div className="flex items-center justify-center gap-2">
        {[0, 1].map((p) => (
          <div key={p} className={`h-2 rounded-full transition-all ${page === p ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"}`} />
        ))}
      </div>
    
      <SuccessDialog open={showSuccess} onClose={() => setShowSuccess(false)} />
    </motion.div>
  );
};

export default LoveAndLoatheExercise;
