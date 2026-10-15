import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ShareActivity } from "./ShareActivity";
import { completeAndExit, handleExit } from "@/lib/navigation";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  lessonId?: string;
  onCompleteExit?: () => void;
}

const SuccessDialog = ({ open, onClose, title, message, lessonId, onCompleteExit }: Props) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const displayTitle = title || t("common.thankYou", "Achievement Unlocked!");
  const displayMessage = message || t("common.entrySavedMessage", "Your progress has been recorded. Why not share your achievement with others?");
  const buttonText = t("common.gotIt", "Done");

  const handleDone = async () => {
    setIsSubmitting(true);
    try {
      if (onCompleteExit) {
        onCompleteExit();
      } else {
        await completeAndExit(lessonId, onClose);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          
          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-[110] w-full max-w-md rounded-[2.5rem] bg-card border-none overflow-hidden coaching-card-shadow"
          >
            <div className="p-8 sm:p-10">
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>

              {/* Success Icon Animation */}
              <div className="flex justify-center mb-8">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-10 h-10 text-primary" strokeWidth={1.5} />
                </motion.div>
              </div>

              {/* Header */}
              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-3">
                  {displayTitle}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed px-4">
                  {displayMessage}
                </p>
              </div>
              
              {/* Share Activity Component */}
              <div className="mb-10">
                <ShareActivity />
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDone}
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-primary text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : null}
                {buttonText}
              </motion.button>
            </div>

            {/* Bottom decorative gradient bar */}
            <div 
              className="h-2 w-full bg-primary" 
              style={{ background: "linear-gradient(90deg, var(--primary) 0%, #a855f7 50%, #ec4899 100%)" }} 
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessDialog;
