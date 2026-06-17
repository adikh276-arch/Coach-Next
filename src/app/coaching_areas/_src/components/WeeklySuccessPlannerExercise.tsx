import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, History, Clock, ChevronDown, ChevronUp, Send, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import SuccessDialog from "@/components/SuccessDialog";

interface HistoryEntry {
  id: string;
  date: string;
  fields: Record<string, string>;
}

interface Props {
  onBack: () => void;
}

const STORAGE_KEY = "exercise-history-weekly-success-planner";

const PAGE1_FIELDS = [
  { id: "theme", label: "My THEME for this week is", type: "text" as const },
  { id: "top-priorities", label: "My TOP 3 priorities this week", subtitle: "If I did nothing else this week, I would be happy just doing these.", type: "list" as const },
  { id: "annual-goals", label: "My Annual/Quarterly Goals", subtitle: "I will take these actions towards my bigger goals:", type: "list" as const },
  { id: "smash-obstacles", label: "Smash those Obstacles", subtitle: "What's getting in the way? Pick one task/situation/decision you've been avoiding and write one action you'll take to resolve it:", type: "text" as const },
  { id: "clear-decks", label: "Clear the Decks!", subtitle: "What will you FINISH this week?", type: "text" as const },
  { id: "must-remember", label: "What I MUST remember this week:", subtitle: "List birthdays, anniversaries, events, appointments, etc.", type: "list" as const },
  { id: "distractions", label: "Distractions or Interruptions", subtitle: "to watch out for this week:", type: "text" as const },
  { id: "look-after-you", label: "Look after You!", subtitle: "What action you will take this week just for you?", type: "text" as const },
  { id: "long-term-goal", label: "Long-term goal or Intention", subtitle: "Write one action you'll take this week towards a long-term goal, intention or vision.", type: "text" as const },
  { id: "productivity", label: "Productivity Accelerators", subtitle: "What action will you take to boost your productivity? Eg. delegate something, say \"no\", have a super-focused day, turn off all notifications on all devices, go to bed early, try something new etc.", type: "text" as const },
];

const PAGE2_FIELDS = [
  { id: "progress", label: "Progress this week?", subtitle: "What specifically have I achieved or progressed. What are my successes and wins?", type: "list" as const },
  { id: "proud-of", label: "What am I proud of this week?", subtitle: "What do I need to give myself a pat on the back for? Personally or professionally, however big or small.", type: "list" as const },
  { id: "learned", label: "What have I learned this week?", subtitle: "Where were you too hard on yourself? What could you have done differently? What other key insights have you had?", type: "list" as const },
  { id: "appreciation", label: "Appreciation", subtitle: "What am I grateful for this week, however small? What went better than expected? What pleasant surprises were there?", type: "list" as const },
  { id: "thank-people", label: "The 3 people I will make a point of thanking are:", type: "list" as const },
  { id: "differently", label: "What one thing could I do differently next week?", subtitle: "Review everything above and identify one thing you could do differently next week. It could be an action, a thought or quote you focus on. It could be an attitude, how you choose to see the world or something else – but it will be unique to you. Write it here and see what happens:", type: "text" as const },
];

const WeeklySuccessPlannerExercise = ({ onBack }: Props) => {
  const [page, setPage] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [listValues, setListValues] = useState<Record<string, string[]>>({});
  const [showHistory, setShowHistory] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const getHistory = (): HistoryEntry[] => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  };
  const history = getHistory();

  const fields = page === 0 ? PAGE1_FIELDS : PAGE2_FIELDS;
  const sectionTitle = page === 0 ? "Your Week Ahead" : "Your Week in Review";
  const sectionNote = page === 1
    ? "Be sure to complete the questions below in full. You can add more items you're proud of etc. but not fewer. If you have trouble finding answers, think smaller – or lower your standards until you can."
    : undefined;

  const getListItems = (id: string) => listValues[id] || [""];
  const handleListChange = (id: string, idx: number, val: string) => {
    setListValues(p => { const items = [...(p[id] || [""])]; items[idx] = val; return { ...p, [id]: items }; });
  };
  const addListItem = (id: string) => {
    setListValues(p => ({ ...p, [id]: [...(p[id] || [""]), ""] }));
  };
  const removeListItem = (id: string, idx: number) => {
    setListValues(p => { const items = [...(p[id] || [""])]; if (items.length <= 1) return p; items.splice(idx, 1); return { ...p, [id]: items }; });
  };

  const handleSubmit = () => {
    const merged: Record<string, string> = { ...values };
    [...PAGE1_FIELDS, ...PAGE2_FIELDS].forEach(f => {
      if (f.type === "list") {
        const items = (listValues[f.id] || []).filter(v => v.trim());
        if (items.length) merged[f.id] = JSON.stringify(items);
      }
    });
    const hasContent = Object.values(merged).some(v => v.trim());
    if (!hasContent) { toast({ title: "Please fill in at least one field", variant: "destructive" }); return; }
    const entry: HistoryEntry = { id: Date.now().toString(), date: new Date().toLocaleString(), fields: merged };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...getHistory()].slice(0, 50)));
    setValues({}); setListValues({}); setPage(0);
    setShowSuccess(true);
  };

  const renderHistoryValue = (raw: string | undefined) => {
    if (!raw) return "—";
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return (
        <ul className="ml-4 list-disc flex flex-col gap-0.5">
          {parsed.map((item: string, i: number) => <li key={i} className="text-sm text-foreground">{item}</li>)}
        </ul>
      );
    } catch (e) {
      console.error("Error parsing history value", e);
    }
    return <span className="text-sm text-foreground whitespace-pre-wrap">{raw}</span>;
  };

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }} className="flex flex-col gap-5 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          
          <h1 className="text-xl font-bold text-foreground">Weekly Success Planner</h1>
        </div>
        <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 rounded-xl bg-card px-4 py-2.5 text-sm font-semibold coaching-card-shadow transition-all hover:coaching-card-shadow-hover">
          <History className="h-4 w-4 text-primary" />
          <span className="text-foreground">History</span>
        </button>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        This exercise empowers you by organizing your tasks, goals, and priorities for each week. It helps to schedule activities, allocate time for self-improvement, and track achievements. This planner fosters productivity by breaking down objectives into manageable steps, encouraging progress, and enhancing time management for holistic success.
      </p>

      {/* History Panel */}
      {showHistory && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="rounded-2xl border border-border bg-card p-4 coaching-card-shadow">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground"><Clock className="h-4 w-4 text-primary" />Previous Entries</h3>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No history yet.</p>
          ) : (
            <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
              {history.map(entry => (
                <button key={entry.id} onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)} className="w-full rounded-xl border border-border bg-background p-3 text-left transition-all hover:bg-muted/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">{entry.date}</span>
                    {expandedEntry === entry.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  {expandedEntry === entry.id && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 flex flex-col gap-2">
                      {[...PAGE1_FIELDS, ...PAGE2_FIELDS].map(f => entry.fields[f.id] && (
                        <div key={f.id}>
                          <p className="text-xs font-semibold text-primary">{f.label}</p>
                          {renderHistoryValue(entry.fields[f.id])}
                        </div>
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
      <div className="flex items-center gap-2">
        <div className={`h-2 flex-1 rounded-full ${page === 0 ? "bg-primary" : "bg-muted"}`} />
        <div className={`h-2 flex-1 rounded-full ${page === 1 ? "bg-primary" : "bg-muted"}`} />
      </div>

      {/* Section Title */}
      <h2 className="text-lg font-bold text-primary">{sectionTitle}</h2>
      {sectionNote && <p className="text-sm font-medium text-foreground -mt-3">{sectionNote}</p>}

      {/* Fields */}
      <div className="flex flex-col gap-6">
        {fields.map((field, i) => (
          <motion.div key={field.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
            <h3 className="text-sm font-bold mb-1 text-foreground">{field.label}</h3>
            {field.subtitle && <p className="text-sm text-muted-foreground mb-2">{field.subtitle}</p>}
            {field.type === "list" ? (
              <div className="flex flex-col gap-2">
                {getListItems(field.id).map((item, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{idx + 1}</span>
                    <Input value={item} onChange={e => handleListChange(field.id, idx, e.target.value)} placeholder={`Item ${idx + 1}...`} className="flex-1 rounded-xl border-border bg-background text-sm" />
                    {getListItems(field.id).length > 1 && (
                      <button onClick={() => removeListItem(field.id, idx)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><X className="h-4 w-4" /></button>
                    )}
                  </motion.div>
                ))}
                <button onClick={() => addListItem(field.id)} className="mt-1 flex items-center gap-2 self-start rounded-xl px-3 py-2 text-sm font-semibold text-primary hover:bg-muted">
                  <Plus className="h-4 w-4" />Add item
                </button>
              </div>
            ) : (
              <Textarea value={values[field.id] || ""} onChange={e => setValues(p => ({ ...p, [field.id]: e.target.value }))} placeholder="Enter your response..." className="min-h-[80px] rounded-xl border-border bg-background resize-y text-sm" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3 mt-2">
        {page === 1 && (
          <button onClick={() => setPage(0)} className="flex-1 rounded-xl border border-border bg-card py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted">
            Previous
          </button>
        )}
        {page === 0 ? (
          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={() => setPage(1)} className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground coaching-card-shadow">
            Next
          </motion.button>
        ) : (
          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit} className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground coaching-card-shadow">
            <Send className="h-4 w-4" />Submit
          </motion.button>
        )}
      </div>
    
      <SuccessDialog open={showSuccess} onClose={() => setShowSuccess(false)} />
    </motion.div>
  );
};

export default WeeklySuccessPlannerExercise;
