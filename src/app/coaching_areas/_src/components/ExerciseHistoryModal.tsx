import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, BookOpen, ChevronDown, ChevronUp, History, Loader2, CloudOff } from "lucide-react";
import { getExerciseHistory, getSessionDetail, type ExerciseSession, type ExerciseResponse } from "@/lib/exerciseDb";
import { getOrCreateUser } from "@/lib/exerciseDb";


interface Props {
  open: boolean;
  onClose: () => void;
  filterAreaId?: string; // if set, only shows entries for that coaching area
}

interface SessionWithDetails extends ExerciseSession {
  responses?: ExerciseResponse[];
  specialData?: Record<string, unknown> | null;
  expanded?: boolean;
}

const ExerciseHistoryModal = ({ open, onClose, filterAreaId }: Props) => {
  const [sessions, setSessions] = useState<SessionWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    fetchHistory();
  }, [open, filterAreaId]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const storedUserId = sessionStorage.getItem("user_id");
      if (!storedUserId) throw new Error("No user session found");
      const userId = await getOrCreateUser(storedUserId);
      const history = await getExerciseHistory(userId, filterAreaId);
      setSessions(history.map((s) => ({ ...s, expanded: false })));
    } catch (err) {
      console.error(err);
      setError("Could not load history. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = async (session: SessionWithDetails) => {
    if (expandedId === session.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(session.id);

    // Fetch detail if not already loaded
    const existing = sessions.find((s) => s.id === session.id);
    if (existing?.responses !== undefined) return;

    try {
      setDetailLoading(session.id);
      const detail = await getSessionDetail(session.id);
      setSessions((prev) =>
        prev.map((s) =>
          s.id === session.id
            ? {
                ...s,
                responses: detail.responses,
                specialData: detail.special?.response_data ?? null,
              }
            : s
        )
      );
    } catch {
      /* silently fail – responses just won't show */
    } finally {
      setDetailLoading(null);
    }
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const renderResponseValue = (r: ExerciseResponse) => {
    // Try response_json first
    const raw = r.response_json ?? r.response_text;
    if (!raw) return <span className="text-muted-foreground italic text-xs">—</span>;

    // If it's an array → bullet list
    if (Array.isArray(raw)) {
      return (
        <ul className="ml-3 list-disc flex flex-col gap-0.5 mt-1">
          {(raw as string[]).map((item, i) => (
            <li key={i} className="text-xs text-foreground">{String(item)}</li>
          ))}
        </ul>
      );
    }

    // If it's an object with rows → table
    if (raw && typeof raw === "object" && "columns" in raw && "rows" in raw) {
      const t = raw as { columns: string[]; rows: string[][] };
      return (
        <div className="overflow-x-auto mt-1">
          <table className="w-full text-xs">
            <thead>
              <tr>
                {t.columns.map((col, i) => (
                  <th key={i} className="text-left font-semibold text-muted-foreground pb-1 pr-3">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="text-foreground pr-3 py-0.5">{cell || "—"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Plain string
    return (
      <span className="text-xs text-foreground whitespace-pre-wrap">
        {typeof raw === "string" ? raw : JSON.stringify(raw, null, 2)}
      </span>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Exercise History</h2>
              </div>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Loading your history…</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                  <CloudOff className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-destructive font-medium">{error}</p>
                  <button
                    onClick={fetchHistory}
                    className="mt-1 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
                  >
                    Retry
                  </button>
                </div>
              ) : sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">No completed exercises yet</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Submit an exercise to see your history here.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {sessions.map((session) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border border-border bg-card coaching-card-shadow overflow-hidden"
                    >
                      <button
                        onClick={() => toggleExpand(session)}
                        className="w-full p-4 text-left hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-foreground truncate">
                              {session.exercise_title}
                            </p>
                            <p className="text-xs text-primary font-medium mt-0.5">
                              {session.coaching_area_name}
                            </p>
                            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 shrink-0" />
                              {formatDate(session.completed_at)}
                            </div>
                          </div>
                          {detailLoading === session.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mt-1 shrink-0" />
                          ) : expandedId === session.id ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                          )}
                        </div>
                      </button>

                      {/* Expanded responses */}
                      <AnimatePresence>
                        {expandedId === session.id && session.responses !== undefined && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-border px-4 pb-4 pt-3 flex flex-col gap-3">
                              {session.responses && session.responses.length > 0 ? (
                                session.responses.map((r) => (
                                  <div key={r.field_id}>
                                    <p className="text-xs font-semibold text-foreground">{r.field_label}</p>
                                    {renderResponseValue(r)}
                                  </div>
                                ))
                              ) : session.specialData ? (
                                <div>
                                  <p className="text-xs font-semibold text-foreground mb-1">Response Data</p>
                                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-all">
                                    {JSON.stringify(session.specialData, null, 2)}
                                  </pre>
                                </div>
                              ) : (
                                <p className="text-xs text-muted-foreground italic">No response details available.</p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border px-5 py-3">
              <p className="text-center text-xs text-muted-foreground">
                {sessions.length > 0
                  ? `${sessions.length} completed exercise${sessions.length !== 1 ? "s" : ""} saved to cloud`
                  : "Your responses are saved securely to the cloud"}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExerciseHistoryModal;
