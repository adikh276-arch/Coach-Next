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

const STORAGE_KEY = "exercise-history-stop-procrastinating";

const PAGE1_FIELDS = [
  { id: "task", label: "What is the task you want to complete?", type: "text" as const },
  { id: "enjoyable", label: "How enjoyable is this task?", subtitle: "(Be 100% honest with yourself)\n\nSit with this score for a moment. If it's a low on enjoyment factor – no wonder you haven't completed it yet! If it's high on enjoyment, get curious. Either way, write (specifically) what's getting in the way below:", type: "textarea" as const },
  { id: "benefits", label: "So, what are the BENEFITS to YOU (specifically) of completing this task?", type: "list" as const },
  { id: "consequences", label: "And what will happen to YOU (specifically) if you DON'T complete this task?", type: "list" as const },
  { id: "who-for", label: "Who is this task for really?", type: "text" as const },
  { id: "how-much", label: "How much do YOU want to have the task finished and done?", type: "text" as const },
  { id: "truly-have-to", label: "Do you really, TRULY have to do this task?", type: "yesno" as const },
  { id: "will-complete", label: "Decide here if you're going to complete this task or not: I will complete this task", type: "yesno" as const },
  { id: "steps-if-not", label: "If you've decided NOT to complete this task, what steps do you need to take now, eg. let someone know?", type: "text" as const },
  { id: "break-down", label: "If you DO still want to complete this task, could this task be made easier if you broke it down? If so, break your task into the first 3 steps below:", type: "table" as const, columns: ["Task", "by When"] },
];

const PAGE2_FIELDS = [
  { id: "visual", label: "VISUAL: I love the sight of?", subtitle: "eg. the view from the top of a mountain, my partner's smile, sunset, a lake, flowers", type: "list" as const },
  { id: "auditory", label: "AUDITORY: I love the sound of?", subtitle: "eg. Mozart, jazz, cats purring, children happily playing, silence", type: "list" as const },
  { id: "kinaesthetic", label: "KINAESTHETIC: I love the feel/feeling of?", subtitle: "eg. feeling joyful, appreciated, cashmere, grass under my toes, sunshine on my skin.", type: "list" as const },
  { id: "olfactory", label: "OLFACTORY: I love the smell of?", subtitle: "eg. a rose, beautifully scented bath products, coffee, flower, cedar, newly mown grass, freshly baked bread", type: "list" as const },
  { id: "gustatory", label: "GUSTATORY: I love the taste of?", subtitle: "eg. favorite food/drink like chocolate or wine – and try to include one non-food item like snow or lip balm!", type: "list" as const },
  { id: "delights", label: "DELIGHTS: A real treat for me would be?", subtitle: "eg. a walk in nature, go dancing, do a crossword, a relaxing bath, massage, time with friends, to get dressed up.", type: "list" as const },
  { id: "creative-3", label: "Now get creative. Choose up to 3 things to help you get the task a) Started or b) Done!", subtitle: "Review your ideas above or pick another action entirely to complete your task faster, more enjoyable and/or give yourself a reward.", type: "list" as const },
  { id: "score", label: "Give a score out of 10 for how likely you feel now that you'll complete this task?", subtitle: "If you score 8 or more, great, you're good to go! If your score is less than 8, ask: What could make my score an 8 or higher?", type: "text" as const },
  { id: "commit-date", label: "I am committed to complete this task by:", type: "date" as const },
];

const StopProcrastinatingExercise = ({ onBack }: Props) => {
  const [page, setPage] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [listValues, setListValues] = useState<Record<string, string[]>>({});
  const [tableValues, setTableValues] = useState<Record<string, string[][]>>({});
  const [showHistory, setShowHistory] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const getHistory = (): HistoryEntry[] => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  };
  const history = getHistory();

  const fields = page === 0 ? PAGE1_FIELDS : PAGE2_FIELDS;
  const sectionTitle = page === 0
    ? "PART 1: Answer these questions to review your motivation & what's getting in the way"
    : "PART 2: Consider your 5 senses for ideas to boost your motivation and enjoyment";

  const getListItems = (id: string) => listValues[id] || [""];
  const handleListChange = (id: string, idx: number, val: string) => {
    setListValues(p => { const items = [...(p[id] || [""])]; items[idx] = val; return { ...p, [id]: items }; });
  };
  const addListItem = (id: string) => setListValues(p => ({ ...p, [id]: [...(p[id] || [""]), ""] }));
  const removeListItem = (id: string, idx: number) => {
    setListValues(p => { const items = [...(p[id] || [""])]; if (items.length <= 1) return p; items.splice(idx, 1); return { ...p, [id]: items }; });
  };

  const getTableRows = (id: string, cols: number) => tableValues[id] || [Array(cols).fill("")];
  const handleTableCell = (id: string, ri: number, ci: number, val: string, cols: number) => {
    setTableValues(p => {
      const rows = [...(p[id] || [Array(cols).fill("")])].map(r => [...r]);
      if (!rows[ri]) rows[ri] = Array(cols).fill("");
      rows[ri][ci] = val;
      return { ...p, [id]: rows };
    });
  };
  const addTableRow = (id: string, cols: number) => setTableValues(p => ({ ...p, [id]: [...(p[id] || [Array(cols).fill("")]), Array(cols).fill("")] }));
  const removeTableRow = (id: string, ri: number) => {
    setTableValues(p => { const rows = [...(p[id] || [])]; if (rows.length <= 1) return p; rows.splice(ri, 1); return { ...p, [id]: rows }; });
  };

  const handleSubmit = () => {
    const merged: Record<string, string> = { ...values };
    [...PAGE1_FIELDS, ...PAGE2_FIELDS].forEach(f => {
      if (f.type === "list") {
        const items = (listValues[f.id] || []).filter(v => v.trim());
        if (items.length) merged[f.id] = JSON.stringify(items);
      } else if (f.type === "table" && "columns" in f) {
        const rows = (tableValues[f.id] || []).filter(r => r.some(c => c.trim()));
        if (rows.length) merged[f.id] = JSON.stringify({ columns: f.columns, rows });
      }
    });
    const hasContent = Object.values(merged).some(v => v.trim());
    if (!hasContent) { toast({ title: "Please fill in at least one field", variant: "destructive" }); return; }
    const entry: HistoryEntry = { id: Date.now().toString(), date: new Date().toLocaleString(), fields: merged };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...getHistory()].slice(0, 50)));
    setValues({}); setListValues({}); setTableValues({}); setPage(0);
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
      if (parsed?.columns && parsed?.rows) return (
        <div className="overflow-x-auto mt-1">
          <table className="w-full text-sm">
            <thead><tr>{parsed.columns.map((col: string, i: number) => <th key={i} className="text-left text-xs font-semibold text-muted-foreground pb-1 pr-3">{col}</th>)}</tr></thead>
            <tbody>{parsed.rows.map((row: string[], ri: number) => <tr key={ri}>{row.map((cell: string, ci: number) => <td key={ci} className="text-foreground pr-3 py-0.5">{cell || "—"}</td>)}</tr>)}</tbody>
          </table>
        </div>
      );
    } catch (e) {
      console.error("Error parsing history value", e);
    }
    return <span className="text-sm text-foreground whitespace-pre-wrap">{raw}</span>;
  };

  const renderField = (field: typeof PAGE1_FIELDS[number] | typeof PAGE2_FIELDS[number], i: number) => {
    return (
      <motion.div key={field.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
        <h3 className="text-sm font-bold mb-1 text-foreground">{field.label}</h3>
        {field.subtitle && <p className="text-sm text-muted-foreground mb-2 whitespace-pre-line">{field.subtitle}</p>}

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
        ) : field.type === "table" && "columns" in field && field.columns ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 shrink-0" />
              {field.columns.map((col, ci) => <p key={ci} className="flex-1 text-xs font-semibold text-muted-foreground">{col}</p>)}
              <div className="w-8 shrink-0" />
            </div>
            {getTableRows(field.id, field.columns.length).map((row, ri) => (
              <motion.div key={ri} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{ri + 1}</span>
                {field.columns!.map((col, ci) => (
                  <Input key={ci} value={row[ci] || ""} onChange={e => handleTableCell(field.id, ri, ci, e.target.value, field.columns!.length)} placeholder={col} className="flex-1 rounded-xl border-border bg-background text-sm" />
                ))}
                {getTableRows(field.id, field.columns.length).length > 1 ? (
                  <button onClick={() => removeTableRow(field.id, ri)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><X className="h-4 w-4" /></button>
                ) : <div className="w-8 shrink-0" />}
              </motion.div>
            ))}
            <button onClick={() => addTableRow(field.id, field.columns!.length)} className="mt-1 flex items-center gap-2 self-start rounded-xl px-3 py-2 text-sm font-semibold text-primary hover:bg-muted">
              <Plus className="h-4 w-4" />Add row
            </button>
          </div>
        ) : field.type === "yesno" ? (
          <div className="flex gap-4">
            {["Yes", "No"].map(opt => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name={field.id} value={opt} checked={values[field.id] === opt} onChange={e => setValues(p => ({ ...p, [field.id]: e.target.value }))} className="h-4 w-4 accent-primary" />
                <span className="text-sm text-foreground">{opt}</span>
              </label>
            ))}
          </div>
        ) : field.type === "date" ? (
          <Input type="date" value={values[field.id] || ""} onChange={e => setValues(p => ({ ...p, [field.id]: e.target.value }))} className="rounded-xl border-border bg-background text-sm max-w-xs" />
        ) : field.type === "textarea" ? (
          <Textarea value={values[field.id] || ""} onChange={e => setValues(p => ({ ...p, [field.id]: e.target.value }))} placeholder="Enter your response..." className="min-h-[100px] rounded-xl border-border bg-background resize-y text-sm" />
        ) : (
          <Input value={values[field.id] || ""} onChange={e => setValues(p => ({ ...p, [field.id]: e.target.value }))} placeholder="Enter your response..." className="rounded-xl border-border bg-background text-sm" />
        )}
      </motion.div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }} className="flex flex-col gap-5 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          
          <h1 className="text-xl font-bold text-foreground">Stop Procrastinating</h1>
        </div>
        <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 rounded-xl bg-card px-4 py-2.5 text-sm font-semibold coaching-card-shadow transition-all hover:coaching-card-shadow-hover">
          <History className="h-4 w-4 text-primary" />
          <span className="text-foreground">History</span>
        </button>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        Do you have a lingering task you keep postponing? It's time to tackle it head-on! Whether it's a recurring or one-time task you've been avoiding, start by answering Part 1's questions meticulously to reassess your drive, identify obstacles, and validate its necessity. Then, proceed to Part 2 for fresh approaches to make the task enjoyable. Let's aim to finally check it off your list!
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
      <h2 className="text-sm font-bold text-primary">{sectionTitle}</h2>

      {/* Fields */}
      <div className="flex flex-col gap-6">
        {fields.map((field, i) => renderField(field, i))}
      </div>

      {page === 0 && (
        <p className="text-xs text-muted-foreground italic font-semibold">
          Next, answer the questions on the next page. Then use your responses to come up with new ideas and ways to make your task more pleasant, enjoyable and/or fun
        </p>
      )}

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

export default StopProcrastinatingExercise;
