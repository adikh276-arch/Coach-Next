import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, Loader2 } from "lucide-react";
import CoachingForm from "../components/CoachingForm";
import CoachingInsights from "../components/CoachingInsights";
import CoachingHistory from "../components/CoachingHistory";
import { getEntries, computeIndex, CoachingEntry } from "../lib/coaching-storage";
import { useAuth } from "../lib/auth";
import { useTranslation } from "../lib/translation";

const Index = () => {
  const { userId } = useAuth();
  const { t } = useTranslation();
  const [entries, setEntries] = useState<CoachingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await getEntries(userId);
      setEntries(data);
    } catch (err) {
      console.error("Failed to load entries:", err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Header */}
      <div className="hero-section px-4 pt-10 pb-8 md:pt-14 md:pb-10 mb-6 md:mb-8 mx-2 md:mx-6 lg:mx-auto lg:max-w-3xl mt-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center relative z-10"
        >
          <h1 className="text-2xl md:text-4xl font-extrabold text-foreground mb-2 flex items-center justify-center gap-3">
            <Briefcase className="w-7 h-7 md:w-9 md:h-9 text-primary" />
            <span>{t("hero.title")}</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
            {t("hero.subtitle")}
          </p>
        </motion.div>
      </div>

      {/* Single unified card */}
      <div className="px-4 md:px-8 lg:px-0 lg:max-w-3xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="tracker-card overflow-hidden"
        >
          {/* Form */}
          <CoachingForm onSaved={refresh} />
        </motion.div>

        {/* Insights */}
        <CoachingInsights entries={entries} />

        {/* History */}
        <CoachingHistory entries={entries} />
      </div>
    </div>
  );
};

export default Index;
