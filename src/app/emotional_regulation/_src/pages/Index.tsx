import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ShareModal } from "@/components/ShareModal";
import { Brain, Save, CheckCircle, MessageSquareText } from "lucide-react";
import TrackerSlider from "@/components/TrackerSlider";
import ChallengeToggle from "@/components/ChallengeToggle";
import ResponseQualitySelect from "@/components/ResponseQualitySelect";
import type { ResponseQuality } from "@/components/ResponseQualitySelect";
import InsightsPanel from "@/components/InsightsPanel";
import HistoryPanel from "@/components/HistoryPanel";
import { getEntries, saveEntry, type TrackerEntry } from "../lib/storage";
import { useI18n } from "../lib/i18n-context";

const Index = () => {
  const { t } = useI18n();
  const [stability, setStability] = useState(5);
  const [stress, setStress] = useState(5);
  const [challenge, setChallenge] = useState(false);
  const [responseQuality, setResponseQuality] = useState<ResponseQuality | undefined>();
  const [context, setContext] = useState("");
  const [showContext, setShowContext] = useState(false);
  const [thoughts, setThoughts] = useState("");
  const [entries, setEntries] = useState<TrackerEntry[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchEntries = async () => {
      const data = await getEntries();
      setEntries(data);
    };
    fetchEntries();
  }, []);

  const resetForm = () => {
    setStability(5);
    setStress(5);
    setChallenge(false);
    setResponseQuality(undefined);
    setContext("");
    setShowContext(false);
    setThoughts("");
  };

  const handleSave = async () => {
    try {
      const entry = await saveEntry({
        stability,
        stress,
        challengingSituation: challenge,
        responseQuality: challenge ? responseQuality : undefined,
        context: challenge && context ? context : undefined,
        thoughts: thoughts.trim() || undefined,
      });
      
      const updatedEntries = await getEntries();
      setEntries(updatedEntries);
      setSaved(true);
      
      toast.success(t("toast.saved"), {
        description: `${t("slider.stability")}: ${entry.stability} · ${t("slider.stress")}: ${entry.stress}`,
      });
      
      setTimeout(() => {
        setSaved(false);
        resetForm();
      }, 10000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-pattern px-4 py-8 md:py-14">
      <div className="fixed top-20 left-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-96 h-96 rounded-full bg-accent/40 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-[520px] md:max-w-[900px] relative">
        {/* Hero Header — matches reference style */}
        <div className="relative rounded-3xl mb-8 shadow-elevated">
          {/* Gradient top bar */}
          <div className="h-2 w-full bg-gradient-to-r from-primary via-violet-mid to-primary rounded-t-3xl" />
          <div className="bg-gradient-to-b from-accent/60 to-card px-6 py-8 md:py-10 text-center rounded-3xl overflow-hidden">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground shadow-md">
                <Brain className="h-5 w-5" />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
                {t("app.title")}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              {t("app.description.new")}
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="glass-card rounded-3xl border border-border/60 shadow-elevated p-6 md:p-10 relative overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-primary rounded-t-3xl" />

          <div className="relative grid gap-8 md:grid-cols-2 md:gap-14 mt-2">
            {/* Left Column – Sliders */}
            <div className="space-y-2">
              <TrackerSlider
                label={t("slider.stability")}
                description={t("slider.stability.desc")}
                value={stability}
                onChange={setStability}
                lowLabel={t("slider.low")}
                highLabel={t("slider.high")}
                variant="stability"
              />
              <div className="border-t border-border/40 my-2" />
              <TrackerSlider
                label={t("slider.stress")}
                description={t("slider.stress.desc")}
                value={stress}
                onChange={setStress}
                lowLabel={t("slider.low")}
                highLabel={t("slider.high")}
                variant="stress"
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <ChallengeToggle
                value={challenge}
                onChange={setChallenge}
                label={t("challenge.label")}
                description={t("challenge.desc")}
                yesLabel={t("challenge.yes")}
                noLabel={t("challenge.no")}
              />

              {challenge && (
                <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                  <ResponseQualitySelect
                    value={responseQuality}
                    onChange={setResponseQuality}
                    label={t("response.label")}
                    description={t("response.desc")}
                    qualityLabels={{
                      Reactive: t("response.reactive"),
                      Managed: t("response.managed"),
                      Composed: t("response.composed"),
                      Strategic: t("response.strategic"),
                    }}
                  />
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowContext(!showContext)}
                      className="text-xs font-semibold text-primary hover:text-primary/80 transition-all duration-200 hover:translate-x-0.5"
                    >
                      {showContext ? t("context.hide") : t("context.add")}
                    </button>
                    {showContext && (
                      <textarea
                        value={context}
                        onChange={(e) => setContext(e.target.value.slice(0, 200))}
                        placeholder={t("context.placeholder")}
                        rows={3}
                        className="mt-2.5 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 resize-none transition-all duration-200"
                      />
                    )}
                    {showContext && (
                      <p className="text-right text-xs text-muted-foreground mt-1.5">
                        {context.length}/200
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Share your thoughts */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MessageSquareText className="h-4 w-4 text-primary" />
                <label className="text-sm font-bold text-foreground tracking-tight">
                  {t("thoughts.label")}
                </label>
              </div>
              <span className="text-[11px] text-muted-foreground italic">{t("thoughts.optional")}</span>
            </div>
            <textarea
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value.slice(0, 150))}
              placeholder={t("thoughts.placeholder")}
              rows={2}
              className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 resize-none transition-all duration-200"
            />
            <p className="text-right text-[11px] text-muted-foreground mt-1">
              {thoughts.length}/150
            </p>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saved}
            className={`relative mt-6 w-full rounded-2xl py-4 text-sm font-bold text-primary-foreground shadow-lg transition-all duration-300 active:scale-[0.98] overflow-hidden group ${
              saved ? "opacity-90" : "hover:shadow-xl hover:-translate-y-0.5"
            }`}
            style={{ background: saved ? "hsl(160, 60%, 45%)" : "var(--gradient-primary)" }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {saved ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {saved ? t("save.saved") : t("save.new")}
            </span>
            {!saved && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            )}
          </button>

          <ShareModal t={t} 
            isOpen={saved} 
            onClose={() => setSaved(false)} 
            title={t("share.reflection_saved")}
            message={t("share.emotional_regulation_msg")}
          />
        </div>

        {/* Insights & History */}
        <div className="mt-6 space-y-3">
          <InsightsPanel
            entries={entries}
            showLabel={t("insights.show")}
            hideLabel={t("insights.hide")}
            lockedMessage={t("insights.locked")}
            lockedBold={t("insights.locked.bold")}
            avgStabilityLabel={t("insights.avg_stability")}
            avgStressLabel={t("insights.avg_stress")}
            challengeRatioLabel={t("insights.challenge_ratio")}
            stabilityTitle={t("insights.stability_title")}
            stressTitle={t("insights.stress_title")}
          />
          <HistoryPanel
            entries={entries}
            showLabel={t("history.show")}
            hideLabel={t("history.hide")}
            emptyLabel={t("history.empty")}
            stabilityLabel={t("history.stability")}
            stressLabel={t("history.stress")}
            challengeLabel={t("history.challenge")}
            responseLabel={t("history.response")}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
