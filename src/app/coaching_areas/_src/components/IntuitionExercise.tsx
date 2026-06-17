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
  data: Record<string, string>;
}

interface Props {
  onBack: () => void;
}

const STORAGE_KEY = "exercise-history-intuition";

const IntuitionExercise = ({ onBack }: Props) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [associations, setAssociations] = useState<string[]>([""]);
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
    const filteredAssoc = associations.filter((a) => a.trim());
    if (filteredAssoc.length > 0) merged["associations"] = JSON.stringify(filteredAssoc);

    const hasContent = Object.values(merged).some((v) => v.trim());
    if (!hasContent) {
      toast({ title: "Please fill in at least one field", variant: "destructive" });
      return;
    }
    const entry: HistoryEntry = { id: Date.now().toString(), date: new Date().toLocaleString(), data: merged };
    const prev = getHistory();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...prev].slice(0, 50)));
    setValues({});
    setAssociations([""]);
    setShowSuccess(true);
  };

  const MEDITATION_TEXT = `I invite you to take a deep breath and when you're comfortable, perhaps begin to close your eyes.

Maybe you can just enjoy sitting still for a moment, doing nothing but breathing deeply – breathing deeply however this feels comfortable for you.

And just allow yourself to find a rhythm. [PAUSE]

So, did you know that water is often a symbol for our emotions?

• Well, now that you're breathing more deeply, perhaps you can imagine any remaining thoughts, tasks, nagging emotions, "to do's" etc. as a river raging around you.
• Perhaps take a moment to experience that more fully. Make sure that everything that's bothering you right now becomes part of that raging river
• Wonderful. So now I want you to take another deep breath and begin to make the river calmer
• I wonder if you've already started to notice it slowing and calming around you. Calmer and calmer until it is now a beautiful, quiet, gently flowing stream
• And once it's a gentle stream now imagine it gettin even calmer, smaller and trickling into a beautiful, quiet, still pond.

Why not take another deep breath and enjoy your beautiful, quiet, still pond for a moment. Take in the absolute stillness, the serenity, peace and calm.

In the days and weeks ahead, know that you can use this technique anywhere, at any time to still your mind and in a few simple moments feel completely calm again.

Hmm. Now I want you to repeat these affirmations so that you're in a space to listen and be open to your conscious mind. Do this in your mind or out loud if you prefer:

• I open myself to inner messages
• I am ready to know what I need to know
• I recognize that my imagination is a doorway to my heart, intuition and transformation

So I'm wondering, if you were to imagine a symbol, picture or object that represented YOUR doorway to reconnect with your heart and spirituality, what would it be? What jumps into your mind?

It's very important to take the image as you receive it, not as you prefer it. This is about learning to TRUST your intuition. So, don't analyze what comes up, just ACCEPT whatever arises AS IT IS.

And for some of you, you may need to sit for a moment, and simply wait. We want this to be spontaneous and natural. So, just breathe for a moment and see what arises for you now. It could be anything at all!

So, now that you have your image, I invite you now to take a breath for a moment and begin to move your attention back to the room, listening to the sounds around you and begin to open your eyes.`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-5 pb-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          
          <h1 className="text-xl font-bold text-foreground">Intuition Exercise</h1>
        </div>
        <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 rounded-xl bg-card px-4 py-2.5 text-sm font-semibold coaching-card-shadow transition-all hover:coaching-card-shadow-hover">
          <History className="h-4 w-4 text-primary" />
          <span className="text-foreground">History</span>
          {history.length > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">{history.length}</span>
          )}
        </button>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">A powerful way to access your intuition, inner wisdom and reconnect with your heart.</p>

      {/* History */}
      {showHistory && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="rounded-2xl border border-border bg-card p-4 coaching-card-shadow">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
            <Clock className="h-4 w-4 text-primary" />Previous Entries
          </h3>
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
                      {Object.entries(entry.data).filter(([, v]) => v.trim()).map(([k, v]) => {
                        let display: React.ReactNode = v;
                        try {
                          const parsed = JSON.parse(v);
                          if (Array.isArray(parsed)) {
                            display = <ul className="ml-4 list-disc">{parsed.map((item: string, i: number) => <li key={i}>{item}</li>)}</ul>;
                          }
                        } catch { /* plain text */ }
                        return (
                          <div key={k}><span className="text-xs text-muted-foreground capitalize">{k.replace(/-/g, " ")}</span><div className="text-foreground">{display}</div></div>
                        );
                      })}
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Step 1: Meditation instructions */}
      <div className="rounded-xl border border-border bg-muted/50 p-4">
        <h3 className="text-sm font-bold text-foreground mb-2" style={{ color: "#0891b2" }}>1. Read the 5 minute meditation given below or take a few deep breaths to calm your mind.</h3>
        <p className="text-xs text-muted-foreground mb-2">Once you feel grounded, repeat these affirmations (out loud or in your head) so that you're more open to this exercise:</p>
        <ul className="ml-5 list-disc text-xs text-muted-foreground flex flex-col gap-1 mb-3">
          <li>I open myself to inner messages</li>
          <li>I am ready to know what I need to know</li>
          <li>I recognize that my imagination is a doorway to my heart, intuition and transformation</li>
        </ul>
      </div>

      {/* Step 2 */}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-1" style={{ color: "#ea580c" }}>2. Choose an image, symbol or object from your life or a dream to work with.</h3>
        <p className="text-xs text-muted-foreground mb-2">If nothing comes up easily, think about a specific issue or goal in your life. Now, if you were to imagine a symbol, 'thing', picture or object that represents that goal or issue for you, what would it be?</p>
        <div className="rounded-xl border border-border bg-muted/50 p-3 mb-2">
          <p className="text-xs font-bold text-foreground mb-1">IMPORTANT:</p>
          <ul className="ml-4 list-disc text-xs text-muted-foreground flex flex-col gap-0.5">
            <li>You may need to sit for a moment and wait. Allow something to spontaneously arise, don't force it.</li>
            <li>Take the image as you receive it, not as you prefer it – trust what comes up for you</li>
            <li>Lastly, do NOT analyze. Instead simply ACCEPT whatever arises.</li>
          </ul>
        </div>
      </div>

      {/* Step 3 */}
      <p className="text-sm font-bold text-foreground" style={{ color: "#ea580c" }}>3. Once you have an image, remember it or draw it on a paper.</p>

      {/* Step 4: Associations list */}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-1" style={{ color: "#ea580c" }}>4. Write down the associations you have with the image below (atmost 8).</h3>
        <ul className="ml-5 list-disc text-xs text-muted-foreground flex flex-col gap-0.5 mb-3">
          <li>After EACH association you make, RETURN to the original image and let a NEW word or phrase arise.</li>
          <li>Passively listen, see or feel what the image says or brings to you – do NOT force or prompt yourself.</li>
          <li>The associations you make should not be about describing or defining the image or object using alternatives names. Instead see what your subconscious mind associates with the image.</li>
        </ul>
        <p className="text-xs font-semibold text-foreground mb-2">Now you're ready to write down whatever associations come up for you – however surprising or unlikely they may seem.</p>
        <div className="flex flex-col gap-2">
          {associations.map((item, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white bg-primary">{idx + 1}</span>
              <Input value={item} onChange={(e) => { const a = [...associations]; a[idx] = e.target.value; setAssociations(a); }} placeholder={`Association ${idx + 1}...`} className="flex-1 rounded-xl border-border bg-background text-sm" />
              {associations.length > 1 && (
                <button onClick={() => { const a = [...associations]; a.splice(idx, 1); setAssociations(a); }} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><X className="h-4 w-4" /></button>
              )}
            </motion.div>
          ))}
          {associations.length < 8 && (
            <button onClick={() => setAssociations([...associations, ""])} className="mt-1 flex items-center gap-2 self-start rounded-xl px-3 py-2 text-sm font-semibold text-primary hover:bg-muted">
              <Plus className="h-4 w-4" />Add association
            </button>
          )}
        </div>
      </div>

      {/* Step 5 */}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-1" style={{ color: "#ea580c" }}>5. Pick the most striking or surprising phrase or word of the things that have been evoked for you. Quickly turn it into a question, or make a request of yourself.</h3>
        <label className="text-xs font-semibold text-foreground">Question or Request of Myself:</label>
        <Input value={values["question-request"] || ""} onChange={(e) => handleChange("question-request", e.target.value)} placeholder="Enter your question or request..." className="mt-1 rounded-xl border-border bg-background text-sm" />
      </div>

      {/* Step 6 */}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-1" style={{ color: "#ea580c" }}>6. Respond IMMEDIATELY, again without 'thinking':</h3>
        <label className="text-xs font-semibold text-foreground">My Immediate Response:</label>
        <Input value={values["immediate-response"] || ""} onChange={(e) => handleChange("immediate-response", e.target.value)} placeholder="Enter your immediate response..." className="mt-1 rounded-xl border-border bg-background text-sm" />
      </div>

      {/* Step 7 */}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-1" style={{ color: "#ea580c" }}>7. Return to your original (central) image, and evoking its power, take your response above and turn it into a practical action.</h3>
        <label className="text-xs font-semibold text-foreground">Action I will take:</label>
        <Input value={values["action"] || ""} onChange={(e) => handleChange("action", e.target.value)} placeholder="Enter the action you will take..." className="mt-1 rounded-xl border-border bg-background text-sm" />
      </div>

      {/* Step 8 */}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-1" style={{ color: "#ea580c" }}>8. Finally,</h3>
        <label className="text-xs font-semibold text-foreground">What did you learn about yourself?</label>
        <Textarea value={values["learned"] || ""} onChange={(e) => handleChange("learned", e.target.value)} placeholder="Enter what you learned..." className="mt-1 min-h-[100px] rounded-xl border-border bg-background resize-y text-sm" />
      </div>

      {/* 5 Minute Meditation */}
      <div className="rounded-2xl border border-border bg-card p-5 coaching-card-shadow">
        <h3 className="text-base font-bold mb-3" style={{ color: "#0891b2" }}>5 Minute Meditation (to prepare and relax you)</h3>
        <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">{MEDITATION_TEXT}</p>
      </div>

      {/* Submit */}
      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit} className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 coaching-card-shadow">
        <Send className="h-4 w-4" />Submit
      </motion.button>
    
      <SuccessDialog open={showSuccess} onClose={() => setShowSuccess(false)} />
    </motion.div>
  );
};

export default IntuitionExercise;
