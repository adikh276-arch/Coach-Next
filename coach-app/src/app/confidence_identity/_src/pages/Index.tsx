import { useState, useCallback } from "react";
import TrackerForm from "@/components/TrackerForm";
import InsightsSection from "@/components/InsightsSection";
import HistorySection from "@/components/HistorySection";
import { useTranslation } from "@/contexts/TranslationContext";

const Index = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { t } = useTranslation();

  const handleSaved = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <div className="min-h-screen bg-mesh relative overflow-hidden">


      <div className="relative z-10 py-4 px-4 md:py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Tracker Form */}
          <TrackerForm onSaved={handleSaved} />

          {/* Insights + History row */}
          <div className="grid grid-cols-2 gap-3">
            <InsightsSection refreshKey={refreshKey} />
            <HistorySection refreshKey={refreshKey} />
          </div>

          {/* Footer */}
          <p className="text-center text-[11px] text-muted-foreground/30 pb-4 pt-1">
            {t("data_private")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
