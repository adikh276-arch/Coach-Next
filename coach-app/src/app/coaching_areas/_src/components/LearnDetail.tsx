import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import type { LearnArticle } from "@/data/learnContent";
import { useTranslatedContent } from "@/hooks/useTranslatedContent";
import { useTranslation } from "react-i18next";

interface Props {
  article: LearnArticle;
  onBack: () => void;
  areaId: string;
  index: number;
}

const LearnDetail = ({ article: originalArticle, onBack, areaId, index }: Props) => {
  const { t } = useTranslation();
  const { getTranslatedLearn } = useTranslatedContent();
  const article = getTranslatedLearn(areaId, index, originalArticle);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-5 pb-8"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <button
          onClick={onBack}
          className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card coaching-card-shadow transition-all hover:coaching-card-shadow-hover"
          title={t("common.back", "Back")}
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground leading-tight">
          {article.title}
        </h1>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4">
        {article.paragraphs.map((paragraph, i) => {
          const isHeading = paragraph.length < 80 && !paragraph.endsWith(".") && !paragraph.includes("\n");

          if (isHeading) {
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="mt-2"
              >
                {i > 0 && <div className="mb-3 h-px bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />}
                <p className="text-base font-bold text-foreground">
                  {paragraph}
                </p>
              </motion.div>
            );
          }

          if (paragraph.includes("\n")) {
            const lines = paragraph.split("\n");
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex flex-col gap-2 rounded-xl bg-card/60 border border-border/50 p-4"
              >
                {lines.map((line, j) => (
                  <p key={j} className="text-sm leading-relaxed text-muted-foreground">
                    {line}
                  </p>
                ))}
              </motion.div>
            );
          }

          const boldMatch = paragraph.match(/^([A-Z][\w\s-]+:)\s(.+)$/);
          if (boldMatch) {
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-xl border-l-[3px] border-primary/40 bg-card/40 py-3 pl-4 pr-3"
              >
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <span className="font-bold text-foreground">{boldMatch[1]}</span>{" "}
                  {boldMatch[2]}
                </p>
              </motion.div>
            );
          }

          return (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="text-sm leading-relaxed text-muted-foreground"
            >
              {paragraph}
            </motion.p>
          );
        })}
      </div>
    </motion.div>
  );
};

export default LearnDetail;
