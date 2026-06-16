import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Lightbulb, Quote, BookOpen } from "lucide-react";
import { icons } from "lucide-react";
import type { CoachingArea, Exercise } from "@/data/coachingAreas";
import { exerciseColorMap } from "@/data/coachingAreas";
import { learnImages } from "@/data/learnImages";
import { useTranslation } from "react-i18next";
import { useTranslatedContent } from "@/hooks/useTranslatedContent";
import { exerciseTitleToTemplateId } from "@/data/exerciseTemplates";

interface Props {
  area: CoachingArea;
  onBack: () => void;
  onExerciseClick?: (exercise: Exercise) => void;
  onLearnClick?: (areaId: string, learnIndex: number) => void;
  onResourceClick?: (areaId: string, resourceType: "tips" | "quotes" | "ebooks") => void;
}

const resourceIcons = {
  tips: Lightbulb,
  quotes: Quote,
  ebooks: BookOpen,
};

const CoachingAreaDetail = ({ area, onBack, onExerciseClick, onLearnClick, onResourceClick }: Props) => {
  const { t } = useTranslation();
  const { getTranslatedArea } = useTranslatedContent();
  const translatedArea = getTranslatedArea(area);

  const resourceBg = {
    tips: "bg-coaching-mindset",
    quotes: "bg-coaching-wellness",
    ebooks: "bg-coaching-performance",
  };

  const resourceIconBg = {
    tips: "bg-[hsl(210,75%,50%)]",
    quotes: "bg-[hsl(280,55%,50%)]",
    ebooks: "bg-[hsl(330,65%,55%)]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
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
        <h1 className="text-2xl font-bold text-foreground">{translatedArea.name}</h1>
      </div>

      {/* Exercises */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {t("common.exercises", "Exercises")}
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {area.exercises.map((ex, i) => {
            const IconComponent = icons[ex.lucideIcon as keyof typeof icons];
            const colorClass = exerciseColorMap[ex.color];
            const templateId = exerciseTitleToTemplateId[ex.title as keyof typeof exerciseTitleToTemplateId] || ex.title;
            
            return (
              <motion.button
                key={ex.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
                whileHover={{ y: -3, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onExerciseClick?.(ex)}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-2xl ${colorClass} coaching-card-shadow transition-all hover:coaching-card-shadow-hover`}
                >
                  {IconComponent ? (
                    <IconComponent className="h-9 w-9 text-white" strokeWidth={1.8} />
                  ) : (
                    <span className="text-2xl text-white">⚡</span>
                  )}
                </div>
                <span className="text-xs font-semibold text-foreground text-center leading-tight max-w-[90px]">
                  {t(`exercises.${templateId}.title`, { defaultValue: ex.title })}
                </span>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Learn */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {t("common.learn", "Learn")}
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {area.learn.map((item, i) => (
            <motion.button
              key={item.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.03, duration: 0.2 }}
              whileHover={{ y: -3 }}
              onClick={() => onLearnClick?.(area.id, i)}
              className="group flex flex-col items-center gap-2"
            >
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-muted coaching-card-shadow transition-all hover:coaching-card-shadow-hover">
                <img
                  src={typeof learnImages[area.id]?.[i] === 'object' 
                    ? (learnImages[area.id][i] as any).src 
                    : (learnImages[area.id]?.[i] || "")}
                  alt={item.title}
                  loading="eager"
                  decoding="async"
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-xs font-semibold text-foreground text-center leading-tight max-w-[90px]">
                {t(`learn.${area.id}.${i}.title`, { defaultValue: item.title })}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Resources */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {t("common.resources", "Resources")}
        </h2>
        <div className="flex flex-col gap-3">
          {area.resources.map((resource, i) => {
            const Icon = resourceIcons[resource.type];
            return (
              <motion.button
                key={resource.type}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.03, duration: 0.2 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onResourceClick?.(area.id, resource.type)}
                className={`flex items-center gap-4 rounded-2xl p-4 text-left transition-all coaching-card-shadow hover:coaching-card-shadow-hover ${resourceBg[resource.type]}`}
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm`}>
                  <Icon className="h-6 w-6 text-primary" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-foreground">
                    {t(`common.${resource.type}.title`, { defaultValue: resource.title })}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {t(`common.${resource.type}.subtitle`, { defaultValue: resource.subtitle })}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground/50" />
              </motion.button>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
};

export default CoachingAreaDetail;
