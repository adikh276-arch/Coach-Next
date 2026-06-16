import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Lightbulb,
  Layers,
  Target,
  Star,
  Rocket,
  PenLine,
  Save,
  RefreshCw,
  History,
} from "lucide-react";
import { getTodayEntry, saveEntry } from "../lib/coaching-storage";
import { useAuth } from "../lib/auth";
import { ShareModal } from '@/components/ShareModal';
import { useTranslation } from "../lib/translation";

interface Props {
  onSaved: () => void;
}

const depthOptions = [
  { label: "Tried It Briefly", icon: Lightbulb, desc: "Quick experiment", color: "hsla(45, 93%, 47%, 0.12)" },
  { label: "Partially Applied", icon: Layers, desc: "Meaningful effort", color: "hsla(200, 80%, 50%, 0.12)" },
  { label: "Fully Implemented", icon: Rocket, desc: "Complete integration", color: "hsla(160, 84%, 39%, 0.12)" },
];

const getDepthLabelKey = (label: string) => {
  const map: Record<string, string> = {
    "Tried It Briefly": "depth.tried_briefly",
    "Partially Applied": "depth.partially_applied",
    "Fully Implemented": "depth.fully_implemented",
  };
  return map[label] || label;
};

const getDepthDescKey = (label: string) => {
  const map: Record<string, string> = {
    "Tried It Briefly": "depth.tried_briefly_desc",
    "Partially Applied": "depth.partially_applied_desc",
    "Fully Implemented": "depth.fully_implemented_desc",
  };
  return map[label] || label;
};

const CoachingForm = ({ onSaved }: Props) => {
  const { t } = useTranslation();
  const { userId } = useAuth();
  const [implemented, setImplemented] = useState(false);
  const [depth, setDepth] = useState<string | null>(null);
  const [accountability, setAccountability] = useState(5);
  const [sessionValue, setSessionValue] = useState(5);
  const [nextAction, setNextAction] = useState("");
  const [saved, setSaved] = useState(false);
  const [ripple, setRipple] = useState(false);
  const [hasExisting, setHasExisting] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const fetchExisting = async () => {
      const existing = await getTodayEntry(userId);
      if (existing) {
        setImplemented(existing.implemented);
        setDepth(existing.implementation_depth);
        setAccountability(existing.accountability_score);
        setSessionValue(existing.session_value);
        setNextAction(existing.next_action ?? "");
        setHasExisting(true);
      }
    };
    fetchExisting();
  }, [userId]);

  const handleSave = async () => {
    if (!userId) return;
    setRipple(true);
    setTimeout(() => setRipple(false), 600);
    
    await saveEntry(userId, {
      implemented,
      implementation_depth: implemented ? depth : null,
      accountability_score: accountability,
      session_value: sessionValue,
      next_action: nextAction.trim() || null,
    });
    
    setSaved(true);
    // Reset to default state
    setImplemented(false);
    setDepth(null);
    setAccountability(5);
    setSessionValue(5);
    setNextAction("");
    
    setTimeout(() => setSaved(false), 5000);
    onSaved();
  };

  const sliderPercent = (val: number) => ((val - 1) / 9) * 100;

  const getSliderColor = (val: number) => {
    if (val >= 8) return "hsl(160, 84%, 39%)";
    if (val >= 5) return "hsl(174, 72%, 40%)";
    if (val >= 3) return "hsl(45, 93%, 47%)";
    return "hsl(0, 84%, 60%)";
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-primary" style={{ background: "var(--gradient-primary)" }}>
            <PenLine className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">{t("form.daily_log")}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{t("form.daily_log_desc")}</p>
          </div>
        </div>
        <button 
          onClick={() => {
            document.getElementById('coaching-history')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-primary hover:bg-primary/5 transition-all border-2 border-primary/10 active:scale-95"
        >
          <History className="w-3.5 h-3.5" />
          {t("form.history")}
        </button>
      </div>

      {/* 1. Toggle - Clear Yes/No Buttons */}
      <div className="mb-7">
        <label className="flex items-center gap-2 text-sm font-medium mb-3">
          <span className="w-6 h-6 rounded-md flex items-center justify-center bg-yellow-500/10">
            <Lightbulb className="w-3.5 h-3.5 text-yellow-500" />
          </span>
          {t("form.apply_learning")}
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary ml-auto font-semibold">{t("form.required")}</span>
        </label>
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setImplemented(true)}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-250 flex items-center justify-center gap-2 border-2 ${
              implemented
                ? "border-transparent text-white shadow-lg bg-primary"
                : "border-slate-200 text-muted-foreground hover:border-primary/30 hover:text-foreground bg-white"
            }`}
            style={implemented ? { background: "var(--gradient-primary)" } : {}}
          >
            <Check className="w-4 h-4" />
            {t("form.yes")}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setImplemented(false)}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-250 flex items-center justify-center gap-2 border-2 ${
              !implemented
                ? "border-transparent text-white shadow-lg bg-slate-500"
                : "border-slate-200 text-muted-foreground hover:border-red-500/30 hover:text-foreground bg-white"
            }`}
            style={!implemented ? { background: "linear-gradient(135deg, #64748b, #475569)" } : {}}
          >
            {t("form.no")}
          </motion.button>
        </div>
      </div>

      {/* 2. Depth */}
      <AnimatePresence>
        {implemented && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 28 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <label className="flex items-center gap-2 text-sm font-medium mb-3">
              <span className="w-6 h-6 rounded-md flex items-center justify-center bg-blue-500/10">
                <Layers className="w-3.5 h-3.5 text-blue-500" />
              </span>
              {t("form.impl_depth")}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {depthOptions.map(({ label, icon: Icon, desc, color }) => {
                const isSelected = depth === label;
                return (
                  <motion.button
                    key={label}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setDepth(label)}
                    className={`flex flex-col items-center gap-2.5 py-5 rounded-2xl border-2 transition-all ${
                      isSelected ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white hover:border-primary/20'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      isSelected ? 'bg-primary text-white' : ''
                    }`}
                      style={{ background: isSelected ? "var(--gradient-primary)" : color }}>
                      <Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-foreground"}`} />
                    </div>
                    <span className="text-sm font-semibold">{t(getDepthLabelKey(label))}</span>
                    <span className={`text-[10px] ${isSelected ? "text-primary/70" : "text-muted-foreground"}`}>
                      {t(getDepthDescKey(label))}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Accountability */}
      <div className="mb-7">
        <label className="flex items-center gap-2 text-sm font-medium mb-1">
          <span className="w-6 h-6 rounded-md flex items-center justify-center bg-red-500/10">
            <Target className="w-3.5 h-3.5 text-red-500" />
          </span>
          {t("form.acc_level")}
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary ml-auto font-semibold">{t("form.required")}</span>
        </label>
        <p className="text-[10px] text-muted-foreground mb-3">{t("form.acc_level_desc")}</p>
        <div className="flex items-center gap-4">
          <div className="flex-1 relative h-10 flex items-center">
            <div className="absolute left-0 right-0 h-2.5 rounded-full bg-slate-100 overflow-hidden pointer-events-none">
              <motion.div
                className="h-full rounded-full"
                animate={{ width: `${sliderPercent(accountability)}%`, backgroundColor: getSliderColor(accountability) }}
                transition={{ duration: 0.15 }}
              />
            </div>
            <input type="range" min={1} max={10} value={accountability}
              onChange={(e) => setAccountability(Number(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer" />
          </div>
          <motion.div
            key={accountability}
            initial={{ scale: 1.4, opacity: 0.4 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-white shrink-0 shadow-lg"
            style={{ background: "var(--gradient-primary)" }}
          >
            {accountability}
          </motion.div>
        </div>
      </div>

      {/* 4. Session Value */}
      <div className="mb-7">
        <label className="flex items-center gap-2 text-sm font-medium mb-1">
          <span className="w-6 h-6 rounded-md flex items-center justify-center bg-yellow-500/10">
            <Star className="w-3.5 h-3.5 text-yellow-500" />
          </span>
          {t("form.session_usefulness")}
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary ml-auto font-semibold">{t("form.required")}</span>
        </label>
        <p className="text-[10px] text-muted-foreground mb-3">{t("form.session_usefulness_desc")}</p>
        <div className="flex items-center gap-4">
          <div className="flex-1 relative h-10 flex items-center">
            <div className="absolute left-0 right-0 h-2.5 rounded-full bg-slate-100 overflow-hidden pointer-events-none">
              <motion.div
                className="h-full rounded-full"
                animate={{ width: `${sliderPercent(sessionValue)}%`, backgroundColor: getSliderColor(sessionValue) }}
                transition={{ duration: 0.15 }}
              />
            </div>
            <input type="range" min={1} max={10} value={sessionValue}
              onChange={(e) => setSessionValue(Number(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer" />
          </div>
          <motion.div
            key={sessionValue}
            initial={{ scale: 1.4, opacity: 0.4 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-white shrink-0 shadow-lg"
            style={{ background: "var(--gradient-primary)" }}
          >
            {sessionValue}
          </motion.div>
        </div>
      </div>

      {/* 5. Next Action */}
      <div className="mb-8">
        <label className="flex items-center gap-2 text-sm font-medium mb-2">
          <span className="w-6 h-6 rounded-md flex items-center justify-center bg-purple-500/10">
            <Rocket className="w-3.5 h-3.5 text-purple-500" />
          </span>
          {t("form.next_action")}
          <span className="text-[10px] text-muted-foreground ml-auto font-normal">{t("form.optional")}</span>
        </label>
        <input
          type="text"
          value={nextAction}
          onChange={(e) => setNextAction(e.target.value.slice(0, 150))}
          placeholder={t("form.next_action_placeholder")}
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
        />
        <p className="text-[10px] text-muted-foreground mt-1.5 text-right">{nextAction.length}/150</p>
      </div>

      {/* Save / Update Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        whileHover={{ y: -2 }}
        onClick={handleSave}
        className="w-full py-4 text-white font-bold rounded-2xl relative overflow-hidden flex items-center justify-center gap-2.5 shadow-xl shadow-primary/20"
        style={{ background: "var(--gradient-primary)" }}
      >
        {ripple && (
          <motion.span className="absolute inset-0 bg-white"
            initial={{ scale: 0, opacity: 0.6 }} animate={{ scale: 3, opacity: 0 }} transition={{ duration: 0.6 }} />
        )}
        {saved ? (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }} className="inline-flex items-center gap-2">
            <Check className="w-5 h-5" /> {t("form.saved")}
          </motion.span>
        ) : (
          <>
            <Save className="w-4 h-4" />
            {t("form.save")}
          </>
        )}
      </motion.button>

      <ShareModal t={t} 
        isOpen={saved} 
        onClose={() => setSaved(false)} 
        title={t("form.modal_title")}
        message={t("form.modal_desc")}
      />
    </div>
  );
};

export default CoachingForm;
