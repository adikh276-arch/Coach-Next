import { motion } from "framer-motion";
import { icons } from "lucide-react";
import type { CoachingArea } from "@/data/coachingAreas";
import { useTranslatedContent } from "@/hooks/useTranslatedContent";

interface Props {
  area: CoachingArea;
  index: number;
  onClick: (area: CoachingArea) => void;
}

const CoachingAreaCard = ({ area, index, onClick }: Props) => {
  const { getTranslatedArea } = useTranslatedContent();
  const IconComponent = icons[area.lucideIcon as keyof typeof icons];
  const translatedArea = getTranslatedArea(area);

  return (
    <motion.button
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.25, ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(area)}
      className={`group flex flex-col items-center gap-3 rounded-2xl p-5 coaching-card-shadow transition-all duration-200 hover:coaching-card-shadow-hover ${area.bgColor}`}
    >
      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl">
        {IconComponent ? (
          <IconComponent className={`h-12 w-12 transition-transform duration-200 group-hover:scale-110 ${area.iconColor}`} strokeWidth={1.5} />
        ) : (
          <img
            src={typeof area.image === 'object' ? (area.image as any).src : area.image}
            alt={translatedArea.name}
            width={80}
            height={80}
            loading="eager"
            decoding="async"
            className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-110"
          />
        )}
      </div>
      <span className="text-sm font-semibold text-foreground">{translatedArea.name}</span>
    </motion.button>
  );
};

export default CoachingAreaCard;
