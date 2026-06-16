import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, History, Clock, ChevronDown, ChevronUp, Send, Plus, X, CloudCheck } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import type { ExerciseTemplate } from "@/data/exerciseTemplates";
import { toast } from "@/hooks/use-toast";
import SuccessDialog from "@/components/SuccessDialog";
import { useExerciseSession } from "@/hooks/useExerciseSession";
import { useTranslation } from "react-i18next";
import { useTranslatedContent } from "@/hooks/useTranslatedContent";


interface HistoryEntry {
  id: string;
  date: string;
  fields: Record<string, string>;
}

interface Props {
  template: ExerciseTemplate;
  onBack: () => void;
  coachingAreaId?: string;
  exerciseId?: string;
}

const ExerciseDetail = ({ template: originalTemplate, onBack, coachingAreaId, exerciseId }: Props) => {
  const { t } = useTranslation();
  const { getTranslatedExercise } = useTranslatedContent();
  const template = getTranslatedExercise(originalTemplate.id, originalTemplate);
  const storageKey = `exercise-history-${template.id}`;
  const [values, setValues] = useState<Record<string, string>>({});
  const [listValues, setListValues] = useState<Record<string, string[]>>({});
  const [tableValues, setTableValues] = useState<Record<string, string[][]>>({});
  const [ratedValues, setRatedValues] = useState<Record<string, Record<string, string>>>({});
  const [showHistory, setShowHistory] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cloudSaved, setCloudSaved] = useState(false);

  const { initSession, submitTemplateExercise, status: dbStatus } = useExerciseSession();

  // Start a DB session as soon as the exercise opens
  useEffect(() => {
    if (coachingAreaId && exerciseId) {
      initSession(coachingAreaId, exerciseId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getHistory = (): HistoryEntry[] => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch {
      return [];
    }
  };

  const history = getHistory();

  const handleChange = (fieldId: string, value: string) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  // List helpers
  const getListItems = (fieldId: string): string[] => listValues[fieldId] || [""];

  const handleListItemChange = (fieldId: string, index: number, value: string) => {
    setListValues((prev) => {
      const items = [...(prev[fieldId] || [""])];
      items[index] = value;
      return { ...prev, [fieldId]: items };
    });
  };

  const addListItem = (fieldId: string) => {
    setListValues((prev) => ({
      ...prev,
      [fieldId]: [...(prev[fieldId] || [""]), ""],
    }));
  };

  const removeListItem = (fieldId: string, index: number) => {
    setListValues((prev) => {
      const items = [...(prev[fieldId] || [""])];
      if (items.length <= 1) return prev;
      items.splice(index, 1);
      return { ...prev, [fieldId]: items };
    });
  };

  // Table helpers
  const getTableRows = (fieldId: string, colCount: number): string[][] =>
    tableValues[fieldId] || [Array(colCount).fill("")];

  const handleTableCellChange = (fieldId: string, rowIdx: number, colIdx: number, value: string, colCount: number) => {
    setTableValues((prev) => {
      const rows = [...(prev[fieldId] || [Array(colCount).fill("")])].map((r) => [...r]);
      if (!rows[rowIdx]) rows[rowIdx] = Array(colCount).fill("");
      rows[rowIdx][colIdx] = value;
      return { ...prev, [fieldId]: rows };
    });
  };

  const addTableRow = (fieldId: string, colCount: number) => {
    setTableValues((prev) => ({
      ...prev,
      [fieldId]: [...(prev[fieldId] || [Array(colCount).fill("")]), Array(colCount).fill("")],
    }));
  };

  const removeTableRow = (fieldId: string, rowIdx: number) => {
    setTableValues((prev) => {
      const rows = [...(prev[fieldId] || [])];
      if (rows.length <= 1) return prev;
      rows.splice(rowIdx, 1);
      return { ...prev, [fieldId]: rows };
    });
  };

  // Rated-list helpers
  const handleRatedChange = (fieldId: string, item: string, value: string) => {
    setRatedValues((prev) => ({
      ...prev,
      [fieldId]: { ...(prev[fieldId] || {}), [item]: value },
    }));
  };

  const handleSubmit = async () => {
    const merged: Record<string, string> = { ...values };
    template.fields.forEach((field) => {
      if (field.type === "list") {
        const items = (listValues[field.id] || []).filter((v) => v.trim());
        if (items.length > 0) merged[field.id] = JSON.stringify(items);
      } else if (field.type === "table") {
        const rows = (tableValues[field.id] || []).filter((r) => r.some((c) => c.trim()));
        if (rows.length > 0) merged[field.id] = JSON.stringify({ columns: field.columns, rows });
      } else if (field.type === "rated-list") {
        const ratings = ratedValues[field.id];
        if (ratings && Object.values(ratings).some((v) => v.trim())) {
          merged[field.id] = JSON.stringify(ratings);
        }
      }
    });

    const hasContent = Object.values(merged).some((v) => v.trim());
    if (!hasContent) {
      toast({ title: "Please fill in at least one field", variant: "destructive" });
      return;
    }

    // ── 1. Save to localStorage (instant, local) ──────────────────
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      fields: merged,
    };
    const prev = getHistory();
    localStorage.setItem(storageKey, JSON.stringify([entry, ...prev].slice(0, 50)));

    // ── 2. Save to Neon DB (cloud, async) ─────────────────────────
    if (coachingAreaId && exerciseId) {
      const dbFields = template.fields.map((field) => ({
        fieldId: field.id,
        fieldLabel: field.label,
        fieldType: field.type ?? "text",
        responseText: field.type === "text" || !field.type ? (merged[field.id] ?? null) : null,
        responseJson: field.type === "list" || field.type === "table" || field.type === "rated-list"
          ? (merged[field.id] ? JSON.parse(merged[field.id]) : null)
          : null,
      }));
      submitTemplateExercise(dbFields).then(() => setCloudSaved(true)).catch(console.error);
    }

    setValues({});
    setListValues({});
    setTableValues({});
    setRatedValues({});
    setShowSuccess(true);
  };

  const renderHistoryValue = (raw: string | undefined) => {
    if (!raw) return "—";
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return (
          <ul className="ml-4 list-disc flex flex-col gap-0.5">
            {parsed.map((item: string, idx: number) => (
              <li key={idx} className="text-sm text-foreground">{item}</li>
            ))}
          </ul>
        );
      }
      if (parsed && typeof parsed === "object") {
        // Table data
        if (parsed.columns && parsed.rows) {
          return (
            <div className="overflow-x-auto mt-1">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    {parsed.columns.map((col: string, i: number) => (
                      <th key={i} className="text-left text-xs font-semibold text-muted-foreground pb-1 pr-3">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsed.rows.map((row: string[], ri: number) => (
                    <tr key={ri}>
                      {row.map((cell: string, ci: number) => (
                        <td key={ci} className="text-foreground pr-3 py-0.5">{cell || "—"}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        // Rated-list data
        return (
          <div className="flex flex-col gap-0.5 mt-1">
            {Object.entries(parsed).map(([key, val]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-foreground">{key}</span>
                <span className="font-semibold text-primary">{val as string}</span>
              </div>
            ))}
          </div>
        );
      }
    } catch {
      /* plain text */
    }
    return <span className="text-sm text-foreground whitespace-pre-wrap">{raw}</span>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-5 pb-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-card coaching-card-shadow transition-all hover:coaching-card-shadow-hover"
          title={t("common.back", "Back")}
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-foreground leading-tight">{template.title}</h2>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock size={12} /> 10-15 {t("common.minutes", "min")}</span>
            <span className="flex items-center gap-1"><History size={12} /> 4 {t("common.sessionsCount", "sessions")}</span>
          </div>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all coaching-card-shadow ${
            showHistory ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:coaching-card-shadow-hover"
          }`}
          title={t("common.history", "History")}
        >
          <History className="h-5 w-5" />
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed bg-white/50 p-3 rounded-xl border border-slate-100 italic">
        {template.description}
      </p>

      {template.importantNote && (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 text-xs text-indigo-900">
          <p className="font-bold mb-1">{t("common.importantNote", "Important Note")}:</p>
          {template.importantNote}
        </div>
      )}

      {/* History Drawer */}
      {showHistory && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden rounded-2xl bg-slate-50 border border-slate-200"
        >
          <div className="p-4 border-b border-slate-200 bg-slate-100/50 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-700">{t("common.previousEntries", "Previous Entries")}</h3>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{history.length} {t("common.saved", "Saved")}</span>
          </div>
          {history.length === 0 ? (
            <div className="p-8 text-center">
              <History className="h-10 w-10 text-slate-300 mx-auto mb-2 opacity-50" />
              <p className="text-xs text-slate-500">{t("common.noHistory", "No history yet. Submit your first entry!")}</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 max-h-[300px] overflow-y-auto">
              {history.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                  className="w-full p-4 text-left transition-all hover:bg-white"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">{entry.date}</span>
                    {expandedEntry === entry.id ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                  {expandedEntry === entry.id && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 flex flex-col gap-2">
                      {template.fields.map((field) => (
                        <div key={field.id}>
                          <p className="text-xs font-semibold" style={{ color: field.color }}>{field.label}</p>
                          {renderHistoryValue(entry.fields[field.id])}
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

      {/* Fields */}
      <div className="flex flex-col gap-6">
        {template.fields.map((field, i) => {
          const sectionHeaders: Record<string, string> = {
            "budgeting-status": t("common.budgeting", "Budgeting"),
            "banking-status": t("common.banking", "Banking"),
            "credit-status": t("common.creditHistory", "Credit History"),
            "debt-status": t("common.debtReduction", "Debt Reduction"),
            "saving-status": t("common.savingLabel", "Saving"),
            "tax-status": t("common.taxFiling", "Tax Filing"),
          };
          const sectionTitle = sectionHeaders[field.id];

          return (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
            >
              {sectionTitle && (
                <div className="mb-3 mt-2">
                  {i > 0 && <div className="border-t border-border mb-4" />}
                  <h2 className="text-lg font-bold" style={{ color: field.color }}>
                    {sectionTitle}
                  </h2>
                </div>
              )}
              <h3 className="text-sm font-bold mb-1 text-foreground flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: field.color }} />
                {field.label}
              </h3>
              {field.subtitle && (
                <p className="text-sm font-medium text-muted-foreground mb-2 whitespace-pre-line">{field.subtitle}</p>
              )}
              {Array.isArray(field.prompts) && field.prompts.length > 0 && (
                <ul className="mb-3 ml-5 flex flex-col gap-1 list-disc">
                  {field.prompts.map((p, j) => (
                    <li key={j} className="text-sm text-muted-foreground">{p}</li>
                  ))}
                </ul>
              )}

              {field.type === "list" ? (
                <ListField
                  fieldId={field.id}
                  color={field.color}
                  items={getListItems(field.id)}
                  onChange={handleListItemChange}
                  onAdd={() => addListItem(field.id)}
                  onRemove={(idx) => removeListItem(field.id, idx)}
                />
              ) : field.type === "table" && field.columns ? (
                <TableField
                  fieldId={field.id}
                  color={field.color}
                  columns={field.columns}
                  rows={getTableRows(field.id, field.columns.length)}
                  onChange={(rowIdx, colIdx, val) => handleTableCellChange(field.id, rowIdx, colIdx, val, field.columns!.length)}
                  onAdd={() => addTableRow(field.id, field.columns!.length)}
                  onRemove={(rowIdx) => removeTableRow(field.id, rowIdx)}
                />
              ) : field.type === "rated-list" && field.items ? (
                <RatedListField
                  fieldId={field.id}
                  items={field.items}
                  ratings={ratedValues[field.id] || {}}
                  onChange={(item, val) => handleRatedChange(field.id, item, val)}
                />
              ) : (
                <Textarea
                  value={values[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  placeholder={t("common.enterResponse", "Enter your response...")}
                  className="min-h-[100px] rounded-xl border-border bg-background resize-y text-sm transition-all focus:ring-2 focus:ring-primary/30"
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {template.footerNote && (
        <p className="text-xs text-muted-foreground italic leading-relaxed whitespace-pre-line">{template.footerNote}</p>
      )}

      {/* Submit */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={dbStatus === "saving"}
        className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 coaching-card-shadow disabled:opacity-60"
      >
        {dbStatus === "saving" ? (
          <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />{t("common.saving", "Saving...")}</>
        ) : (
          <><Send className="h-4 w-4" />{t("common.submit", "Submit")}</>
        )}
      </motion.button>
      {cloudSaved && (
        <p className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 font-medium">
          <CloudCheck className="h-3.5 w-3.5" /> {t("common.savedToCloud", "Response saved to cloud")}
        </p>
      )}
      <SuccessDialog open={showSuccess} onClose={() => setShowSuccess(false)} />
    </motion.div>
  );
};

/* ── Sub-components ── */

function ListField({
  fieldId,
  color,
  items,
  onChange,
  onAdd,
  onRemove,
}: {
  fieldId: string;
  color: string;
  items: string[];
  onChange: (fieldId: string, idx: number, val: string) => void;
  onAdd: () => void;
  onRemove: (idx: number) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-2">
      {Array.isArray(items) && items.map((item, idx) => (
        <div key={idx} className="flex gap-2">
          <Input
            value={item}
            onChange={(e) => onChange(fieldId, idx, e.target.value)}
            placeholder={`${t("common.item", "Item")} ${idx + 1}...`}
            className="rounded-xl border-border bg-background text-sm transition-all focus:ring-2 focus:ring-primary/30"
          />
          <button
            onClick={() => onRemove(idx)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
      <button
        onClick={onAdd}
        className="flex items-center gap-2 self-start text-xs font-bold transition-all hover:opacity-80"
        style={{ color }}
      >
        <Plus size={14} /> {t("common.addItem", "Add item")}
      </button>
    </div>
  );
}

function TableField({
  fieldId,
  color,
  columns,
  rows,
  onChange,
  onAdd,
  onRemove,
}: {
  fieldId: string;
  color: string;
  columns: string[];
  rows: string[][];
  onChange: (rowIdx: number, colIdx: number, val: string) => void;
  onAdd: () => void;
  onRemove: (rowIdx: number) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/30 p-4">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr>
              {Array.isArray(columns) && columns.map((col, i) => (
                <th key={i} className="pb-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2">
                  {col}
                </th>
              ))}
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Array.isArray(rows) && rows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {Array.isArray(row) && row.map((cell, colIdx) => (
                  <td key={colIdx} className="py-2 px-1">
                    <Input
                      value={cell}
                      onChange={(e) => onChange(rowIdx, colIdx, e.target.value)}
                      className="h-9 rounded-lg border-border bg-white text-xs"
                    />
                  </td>
                ))}
                <td className="py-2 pl-2">
                  <button
                    onClick={() => onRemove(rowIdx)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 self-start text-xs font-bold transition-all hover:opacity-80 mt-1"
        style={{ color }}
      >
        <Plus size={14} /> {t("common.addRow", "Add row")}
      </button>
    </div>
  );
}

function RatedListField({
  fieldId,
  items,
  ratings,
  onChange,
}: {
  fieldId: string;
  items: string[];
  ratings: Record<string, string>;
  onChange: (item: string, val: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      {Array.isArray(items) && items.map((item) => (
        <div key={item} className="flex items-center justify-between py-2 border-b border-border/50">
          <p className="text-sm font-medium text-foreground">{item}</p>
          <Input
            value={ratings[item] || ""}
            onChange={(e) => onChange(item, e.target.value)}
            placeholder="—"
            className="w-20 rounded-lg border-border bg-background text-center text-sm"
          />
        </div>
      ))}
    </div>
  );
}

export default ExerciseDetail;
