"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Share2, Copy, Check, MessageCircle, Mail, Link2, Camera, X, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export function ShareActivity({ t: customT }: { t?: any }) {
  const { t: i18nT } = useTranslation();
  const t = customT || i18nT;
  const [copied, setCopied] = useState(false);
  
  // App Store Links (Placeholders - updated to Coach Mantra)
  const androidUrl = "https://play.google.com/store/apps/details?id=org.mantracare.coach";
  const iosUrl = "https://apps.apple.com/app/coach-mantra/id1610120131";
  const shareMessage = `${t("share.whatsappMessage", "I just completed an activity on Mantra Coach! Check out the app here: ")}${androidUrl}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(androidUrl);
      setCopied(true);
      toast.success(t("share.copiedToast", "Link copied to clipboard!"));
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error(t("share.failedCopyToast", "Failed to copy link"));
    }
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: <MessageCircle className="h-5 w-5" />,
      color: "bg-[#25D366]",
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, "_blank"),
    },
    {
      name: "LinkedIn",
      icon: <Link2 className="h-5 w-5" />,
      color: "bg-[#0077B5]",
      action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(androidUrl)}`, "_blank"),
    },
    {
      name: "Instagram",
      icon: <Camera className="h-5 w-5" />,
      color: "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
      action: () => {
        copyToClipboard();
        toast.info(t("share.instagramToast", "Instagram doesn't support direct links. Link copied - paste it in your story!"));
      },
    },
    {
      name: "Email",
      icon: <Mail className="h-5 w-5" />,
      color: "bg-[#EA4335]",
      action: () => window.open(`mailto:?subject=${encodeURIComponent(t("share.emailSubject", "Achieved a Milestone on Mantra Coach"))}&body=${encodeURIComponent(shareMessage)}`),
    },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-100" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">
            {t("share.title", "Share Your Progress")}
          </span>
          <div className="h-px flex-1 bg-slate-100" />
        </div>

        <div className="grid grid-cols-4 gap-4">
          {shareOptions.map((option) => (
            <motion.button
              key={option.name}
              whileHover={{ y: -5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={option.action}
              className="flex flex-col items-center gap-3 group"
            >
              <div className={`${option.color} w-14 h-14 rounded-[1.25rem] text-white flex items-center justify-center shadow-lg shadow-black/5 transition-all group-hover:shadow-xl group-hover:brightness-110`}>
                {React.cloneElement(option.icon as React.ReactElement<any>, { className: "w-6 h-6" })}
              </div>
              <span className="text-xs font-bold text-slate-500 group-hover:text-slate-900 transition-colors">
                {option.name}
              </span>
            </motion.button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.01, backgroundColor: "rgb(248 250 252)" }}
          whileTap={{ scale: 0.99 }}
          onClick={copyToClipboard}
          className="flex items-center justify-between w-full px-5 py-4 rounded-[1.5rem] bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all group"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-100 shadow-sm flex-shrink-0">
              {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5 text-slate-400" />}
            </div>
            <div className="flex flex-col items-start min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{t("share.appStoreLinkLabel", "App Store Link")}</span>
              <span className="text-sm font-medium text-slate-600 truncate max-w-[180px]">
                {androidUrl.replace("https://", "")}
              </span>
            </div>
          </div>
          <span className="text-xs font-black text-indigo-600 group-hover:text-indigo-700 ml-2">
            {copied ? t("share.copied", "COPIED") : t("share.copy", "COPY")}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
