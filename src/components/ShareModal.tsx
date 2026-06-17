"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ShareActivity } from "./ShareActivity";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  t?: any;
}

export function ShareModal({ isOpen, onClose, title, message, t: customT }: ShareModalProps) {
  const { t: i18nT } = useTranslation();
  const t = customT || i18nT;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-[2rem] border-none bg-white p-0 overflow-hidden shadow-2xl">
        <div className="relative p-8 sm:p-10">
          {/* Success Icon Animation */}
          <div className="flex justify-center mb-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              className="w-20 h-20 rounded-3xl bg-emerald-50 flex items-center justify-center shadow-inner"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
            </motion.div>
          </div>

          <DialogHeader className="text-center mb-10">
            <DialogTitle className="text-3xl font-extrabold tracking-tight text-slate-900">
              {title || t("share.assessmentCompleted", "Assessment Completed!")}
            </DialogTitle>
            <DialogDescription className="text-base text-slate-500 mt-3 font-medium">
              {message || t("share.defaultMessage", "Your progress has been recorded. Share your achievement with your network!")}
            </DialogDescription>
          </DialogHeader>

          <ShareActivity t={t} />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="w-full mt-10 py-4 rounded-2xl bg-slate-100 text-base font-bold text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-all shadow-sm"
          >
            {t("share.done", "Done")}
          </motion.button>
        </div>
        
        {/* Bottom decorative bar */}
        <div className="h-2 w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-500" />
      </DialogContent>
    </Dialog>
  );
}
