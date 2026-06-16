import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, History, Clock, ChevronDown, ChevronUp, Send, ChevronRight } from "lucide-react";
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

const STORAGE_KEY = "exercise-history-rocking-chair";

const RockingChairExercise = ({ onBack }: Props) => {
  const [page, setPage] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [showHistory, setShowHistory] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const getHistory = (): HistoryEntry[] => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  };
  const history = getHistory();

  const handleChange = (key: string, val: string) => setValues(p => ({ ...p, [key]: val }));

  const handleSubmit = () => {
    if (!Object.values(values).some(v => v.trim())) {
      toast({ title: "Please fill in at least one field", variant: "destructive" });
      return;
    }
    const entry: HistoryEntry = { id: Date.now().toString(), date: new Date().toLocaleString(), data: { ...values } };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...getHistory()].slice(0, 50)));
    setValues({}); setPage(0);
    setShowSuccess(true);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }} className="flex flex-col gap-5 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          
          <h1 className="text-xl font-bold text-foreground">Rocking Chair</h1>
        </div>
        <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 rounded-xl bg-card px-4 py-2.5 text-sm font-semibold coaching-card-shadow transition-all hover:coaching-card-shadow-hover">
          <History className="h-4 w-4 text-primary" /><span className="text-foreground">History</span>
        </button>
      </div>

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
                        <div key={k}><span className="text-xs text-muted-foreground capitalize">{k.replace(/-/g, " ")}</span><div className="text-foreground">{v}</div></div>
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

      {/* Page 0: "Rocking Chair" Life Version */}
      {page === 0 && (
        <motion.div key="p0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4">
          <h3 className="text-sm font-bold" style={{ color: "#0891b2" }}>"Rocking Chair" Life Version</h3>

          <div className="rounded-xl border border-border bg-muted/50 p-4">
            <p className="text-xs font-bold text-foreground mb-2">INSTRUCTIONS:</p>
            <ul className="ml-4 list-disc text-xs text-muted-foreground flex flex-col gap-1">
              <li>What's your life dream? This exercise helps you see the vision you <em>already have</em> within you for your life.</li>
              <li>Allow yourself 20 minutes of quiet time to ponder and write your answers in the space below!</li>
              <li>This is about YOU, so let your imagination go, write a story and paint a picture of your life with words.</li>
            </ul>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">Now, take a moment to imagine you're blissfully happy, healthy AND 90 years old. You're sitting in your rocking chair and looking back over your IDEAL life. Here are some questions to consider as you write:</p>

          <ol className="ml-5 list-decimal text-xs text-muted-foreground flex flex-col gap-1">
            <li>Who are you as a person? What is it about you that people value?</li>
            <li>What have you achieved? What are you proud of? What added meaning to your life and gives you a sense of fulfillment?</li>
            <li>Perhaps consider how your life unfolded in the following areas: Family, Friends, Significant Other, Career, Health (emotional, spiritual and physical), your Home, what you did for Fun and Leisure, what you Learned about, what you did in Service, Leadership or in your Community?</li>
            <li>Finally I wonder what you can see around you? What are you feeling? What can you hear? What SHOWS you're truly happy?</li>
          </ol>

          <div className="rounded-xl border border-border bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground"><strong style={{ color: "#ea580c" }}>Tip:</strong> The complete picture may just magically arrive, just put pen to paper now and write – see what happens!</p>
          </div>

          <Textarea value={values["life-version"] || ""} onChange={e => handleChange("life-version", e.target.value)} placeholder="Write your rocking chair life vision here..." className="min-h-[160px] rounded-xl border-border bg-background resize-y text-sm" />
        </motion.div>
      )}

      {/* Page 1: Retirement / Big Birthday Party Visioning */}
      {page === 1 && (
        <motion.div key="p1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4">
          <h3 className="text-sm font-bold" style={{ color: "#0891b2" }}>Retirement – or "Big Birthday" Party Visioning</h3>

          <div className="rounded-xl border border-border bg-muted/50 p-4">
            <p className="text-xs font-bold text-foreground mb-2">BACKGROUND:</p>
            <ul className="ml-4 list-disc text-xs text-muted-foreground flex flex-col gap-1">
              <li>This visioning exercise involves you imagining some point in the future when you're going to retire. If you don't work (or can't imagine retiring) it could also be a 'Big' Birthday party, perhaps your 60th, 65th or 70th Birthday.</li>
              <li>This party has been organized to celebrate you and a substantial change you're making in your life. Are you retiring – or moving somewhere new? Maybe you're going travelling or embarking on a new creative career? Only you know!</li>
              <li>However you got here, a big party is being held in your honour. This party is celebrating YOU.</li>
            </ul>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">Take a moment to imagine you're at a party all about you. Someone has written a speech celebrating you. What would it say? Use the prompts below to help you write the speech that someone will read about you.</p>

          <ol className="ml-5 list-decimal text-xs text-muted-foreground flex flex-col gap-1">
            <li>How old are you? Who is at the party? Where is the party being held?</li>
            <li>What have you achieved in your family, career, business, community or in the world?</li>
            <li>What is it about you that the people at the party truly value?</li>
            <li>What would YOU want to be said about you? What would you be disappointed if it was not said?</li>
            <li>What have you done that was truly amazing? Where did you surprise yourself? Where did you surprise others? What are you MOST proud of? What mistakes did you make – that you can laugh about now?</li>
            <li>What is the essence of you that you would want to be captured in that retirement or birthday speech?</li>
            <li><strong>Optional:</strong> Where are you going next in your life? What are you excited to spend more time doing?</li>
          </ol>

          <div className="rounded-xl border border-border bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground"><strong style={{ color: "#ea580c" }}>TIP:</strong> Don't worry about writing a "good speech" – instead focus on what the speaker might say. Imagine this is a first draft to capture the key points. And remember to write the speech in the 3rd person eg. "Sarah/Auntie Sarah has always ............."</p>
          </div>

          <Textarea value={values["party-speech"] || ""} onChange={e => handleChange("party-speech", e.target.value)} placeholder="Write your retirement/birthday speech here..." className="min-h-[160px] rounded-xl border-border bg-background resize-y text-sm" />
        </motion.div>
      )}

      {/* Page 2: "Newspaper Article" Writing */}
      {page === 2 && (
        <motion.div key="p2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4">
          <h3 className="text-sm font-bold" style={{ color: "#0891b2" }}>"Newspaper Article" Writing</h3>

          <div className="rounded-xl border border-border bg-muted/50 p-4">
            <p className="text-xs font-bold text-foreground mb-2">BACKGROUND:</p>
            <ul className="ml-4 list-disc text-xs text-muted-foreground flex flex-col gap-1">
              <li>This visioning exercise involves you imagining you have achieved a great milestone in your life or career.</li>
              <li>What would success look like for you? It could be an award you've received, a book you've written, something you've established or created. It could be a fund-raising goal you reached, a feat of travel, charitable activities or something else.</li>
              <li>Now, write an article as if written by a newspaper about the recent milestone and successes you have achieved.</li>
            </ul>
          </div>

          <p className="text-xs font-bold text-foreground">Tips:</p>
          <ol className="ml-5 list-decimal text-xs text-muted-foreground flex flex-col gap-1">
            <li>Write from 250-500 words in the PAST tense.</li>
            <li>Mention yourself, anyone who helped you and any sources quoted – by name.</li>
            <li>Remember to give a little background including recent successes and other relevant highlights.</li>
            <li>What does your success MEAN for the people reading it – how do the readers benefit?</li>
            <li><strong>OPTIONAL:</strong> What newspaper would you like to be featured in? Try (as best you can) to write in that newspaper's style.</li>
          </ol>

          <p className="text-xs text-muted-foreground italic">And don't worry about grammar or spelling – this is about capturing your vision and essence.</p>

          <Textarea value={values["newspaper-article"] || ""} onChange={e => handleChange("newspaper-article", e.target.value)} placeholder="Write your newspaper article here..." className="min-h-[200px] rounded-xl border-border bg-background resize-y text-sm" />
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

export default RockingChairExercise;
