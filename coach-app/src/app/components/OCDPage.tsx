import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Calendar, MessageCircle, CheckCircle, ChevronRight, ChevronLeft, Sparkles, Heart, Wind, BookOpen, BarChart3, ArrowRight, Play, Headphones, FileText, Activity, Moon, Music, Star, ArrowUpRight, Clock, Award, Check, Zap, Battery, Users } from "lucide-react";
import { motion } from "motion/react";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { MobileAppModal } from "./MobileAppModal";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import ocdCtaImage from "figma:asset/db1e749f8f0e51fd6bed6aac17a276ea49c074c0.png";

export function OCDPage() {
  const navigate = useNavigate();
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());
  const [showMobileAppModal, setShowMobileAppModal] = useState(false);
  const [showTodaysPlan, setShowTodaysPlan] = useState(false);

  const service = {
    name: "OCD",
    description: "Specialized support and therapy for Obsessive-Compulsive Disorder.",
    icon: "🔄",
    color: "#EC4899",
    pathways: [
      { title: "Understanding OCD", type: "Video", points: "10 Points", icon: "▶️", duration: "8 min", completed: false },
      { title: "ERP Introduction Exercise", type: "Audio", points: "10 Points", icon: "🎧", duration: "6 min", completed: false },
      { title: "Track Your Symptoms Today", type: "Tracker", points: "10 Points", icon: "📊", duration: "3 min", completed: false },
      { title: "OCD Assessment", type: "Assessment", points: "10 Points", icon: "📋", duration: "10 min", completed: false },
      { title: "Mindfulness for OCD", type: "Audio", points: "5 Points", icon: "🎵", duration: "12 min", completed: false }
    ]
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  const toggleTaskCompletion = (index: number, pathway: any) => {
    // If it's an Assessment, show the mobile app modal
    if (pathway.type === "Assessment") {
      setShowMobileAppModal(true);
      return;
    }
    
    setCompletedTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Map activity types to colors and icon components
  const activityConfig: Record<string, { bgColor: string; iconBg: string; textColor: string; icon: React.ReactNode }> = {
    'Audio': { 
      bgColor: '#FEF3C7', 
      iconBg: 'bg-[#F59E0B]', 
      textColor: '#F59E0B',
      icon: <Headphones size={24} className="text-white" strokeWidth={2} />
    },
    'Tracker': { 
      bgColor: '#DBEAFE', 
      iconBg: 'bg-[#3B82F6]', 
      textColor: '#3B82F6',
      icon: <BarChart3 size={24} className="text-white" strokeWidth={2} />
    },
    'Assessment': { 
      bgColor: '#F3E8FF', 
      iconBg: 'bg-[#A855F7]', 
      textColor: '#A855F7',
      icon: <FileText size={24} className="text-white" strokeWidth={2} />
    },
    'Activity': { 
      bgColor: '#D1FAE5', 
      iconBg: 'bg-[#10B981]', 
      textColor: '#10B981',
      icon: <Activity size={24} className="text-white" strokeWidth={2} />
    },
    'Video': { 
      bgColor: '#FEE2E2', 
      iconBg: 'bg-[#EF4444]', 
      textColor: '#EF4444',
      icon: <Play size={24} className="text-white" strokeWidth={2} />
    },
  };

  return (
    <>
      <div className="flex min-h-screen bg-[#F9FAFB]">
        {/* Sidebar */}
        <Sidebar />

        {/* Mobile Nav */}
        <MobileNav />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <main className="max-w-[1000px] w-full mx-auto px-4 md:px-6 py-4 md:py-10 pt-[72px] md:pt-10">
            {/* Service Header */}
            <motion.div
              className="mb-6 md:mb-8"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <div className="flex items-center gap-2.5 mb-2">
                {/* Back Arrow */}
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 text-[#64748B] hover:bg-[#f3faff]"
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md text-lg flex-shrink-0" style={{ backgroundColor: service.color }}>
                  {service.icon}
                </div>
                <h1 className="text-xl md:text-2xl text-[#020817]">{service.name}</h1>
              </div>
              <p className="text-xs md:text-sm leading-relaxed max-w-xl text-[#64748B] pl-[54px]">{service.description}</p>
            </motion.div>

            {/* Expert Support Section - Default Two-Card Layout */}
            <motion.div 
              className="mb-[10px]"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="space-y-[10px]">
                {/* Talk to a Therapist */}
                <motion.button
                  onClick={() => navigate("/care-team")}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full relative overflow-hidden bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] border-2 border-transparent rounded-2xl px-5 py-5 flex items-center justify-between shadow-lg hover:shadow-2xl transition-all duration-300 group"
                >
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-[18px] flex items-center justify-center flex-shrink-0 shadow-md">
                      <MessageCircle className="text-white" size={24} strokeWidth={2} />
                    </div>
                    <div className="text-left">
                      <h4 className="text-base font-semibold text-white">Talk to an OCD Specialist</h4>
                      <p className="text-xs mt-1 text-white/90 font-medium">Professional Care, Counseling & Therapeutic Support</p>
                    </div>
                  </div>
                  <div className="relative z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-[14px] flex items-center justify-center shadow-sm">
                    <ArrowRight className="text-white group-hover:translate-x-1 transition-transform flex-shrink-0" size={20} strokeWidth={2} />
                  </div>
                </motion.button>

                {/* Today's Plan Section */}
                <div className="border bg-white rounded-2xl shadow-sm overflow-hidden">
                  {/* Today's Plan Accordion Button */}
                  <motion.button
                    onClick={() => setShowTodaysPlan(!showTodaysPlan)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    whileHover={{ scale: 1.005 }}
                    whileTap={{ scale: 0.995 }}
                    className="w-full p-4 md:p-5 hover:bg-opacity-80 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#F97316] to-[#FB923C] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                          <Star className="text-white" size={24} strokeWidth={2} />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-base mb-0.5 text-[#020817]">
                            Today's Plan
                          </h3>
                          <p className="text-xs md:text-sm text-[#64748B]">
                            Complete your daily wellness activities
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="text-[#F97316] flex-shrink-0 group-hover:translate-x-1 transition-transform" size={24} />
                    </div>
                  </motion.button>

                  {/* Today's Plan Content (Collapsible) */}
                  {showTodaysPlan && (
                  <motion.div 
                    className="px-5 md:px-6 pb-5 md:pb-6 pt-2.5"
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                  <motion.div 
                  className="space-y-4"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  {service.pathways.map((pathway, index) => {
                    const isCompleted = completedTasks.has(index);
                    const config = activityConfig[pathway.type] || activityConfig['Activity'];

                    return (
                      <motion.div
                        key={index}
                        variants={item}
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.995 }}
                        onClick={() => {
                          // If it's an Assessment, show the mobile app modal
                          if (pathway.type === "Assessment") {
                            setShowMobileAppModal(true);
                            return;
                          }
                          setCompletedTasks(prev => {
                            const newSet = new Set(prev);
                            if (newSet.has(index)) {
                              newSet.delete(index);
                            } else {
                              newSet.add(index);
                            }
                            return newSet;
                          });
                        }}
                        className="relative flex items-center gap-3 py-3 transition-all cursor-pointer group"
                      >
                        {/* Checkbox */}
                        <div 
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            isCompleted ? 'bg-[#00c0ff] border-[#00c0ff]' : 'border-[#E5E7EB]'
                          }`}
                        >
                          {isCompleted && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                              <Check className="text-white" size={12} strokeWidth={3} />
                            </motion.div>
                          )}
                        </div>
                        
                        {/* Icon */}
                        <div 
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${config.iconBg}`}
                        >
                          {config.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm md:text-base mb-1 font-medium text-[#374151]">
                            {pathway.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs flex-wrap">
                            <span 
                              className="px-2 py-0.5 rounded text-xs font-medium"
                              style={{ backgroundColor: config.bgColor, color: config.textColor }}
                            >
                              {pathway.type}
                            </span>
                            {pathway.duration && (
                              <span className="text-[#9CA3AF] flex items-center gap-1">
                                <Clock size={12} />
                                {pathway.duration}
                              </span>
                            )}
                            <span className="text-[#10B981] flex items-center gap-1 font-medium">
                              <Award size={12} className="text-[#10B981]" />
                              {pathway.points}
                            </span>
                          </div>
                        </div>

                        {/* Arrow */}
                        <ChevronRight 
                          className="flex-shrink-0 transition-all text-[#E5E7EB] group-hover:text-[#9CA3AF]" 
                          size={20} 
                        />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>
                )}
                </div>

                {/* Self Care Resources */}
                <motion.button
                  onClick={() => navigate("/ocd-self-care")}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#FF9F43] rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Sparkles className="text-white" size={24} strokeWidth={2} />
                    </div>
                    <div className="text-left">
                      <h4 className="text-base font-semibold text-[#020817]">Self Care Resources</h4>
                      <p className="text-xs mt-1 text-[#64748B]">Mindfulness & guided sessions</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-[#FF9F43]/10 rounded-[14px] flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="text-[#FF9F43] group-hover:translate-x-1 transition-transform" size={20} strokeWidth={2} />
                  </div>
                </motion.button>
              </div>
            </motion.div>

            {/* Quick Tools Section */}
            <motion.div
              className="border bg-white rounded-2xl p-4 md:p-6 mb-6 md:mb-8 shadow-sm"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="mb-5 md:mb-6">
                <h2 className="text-sm md:text-base flex items-center gap-2 mb-1 text-[#020817]">
                  <Sparkles className="text-[#00c0ff]" size={16} />
                  Quick Tools
                </h2>
                <p className="text-xs text-[#64748B]">
                  Access helpful resources instantly
                </p>
              </div>

              {/* Mobile: 3×2 grid | Desktop: 6-column single row */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
                {[
                  { label: "Log OCD Moments", Icon: FileText, grad: "#F39C12", link: "https://platform\.mantracare.com/app/ocd_moments", external: true },
                  { label: "Journal", Icon: BookOpen, grad: "#3498DB", link: "/journal", external: false },
                  { label: "OCD in Daily Life", Icon: Calendar, grad: "#FF9F43", link: "https://platform\.mantracare.com/app/daily_life", external: true },
                  { label: "Mood Tracker", Icon: Heart, grad: "#E74C3C", link: "https://platform\.mantracare.com/app/mood_tracker", external: true },
                  { label: "Energy Check", Icon: Battery, grad: "#9B59B6", link: "https://platform\.mantracare.com/app/energy_tracker", external: true },
                  { label: "OCD Assessment", Icon: CheckCircle, grad: "#27AE60", link: "https://app.mantracare.org/ocd-test/", external: true },
                ].map((tool, i) => (
                  <motion.button
                    key={tool.label}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.3 + i * 0.06 }}
                    className="flex flex-col items-center gap-2"
                    onClick={() => {
                      if (tool.external) {
                        window.open(tool.link, '_blank');
                      } else {
                        navigate(tool.link);
                      }
                    }}
                  >
                    <div
                      className="w-16 h-16 md:w-20 md:h-20 rounded-3xl flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
                      style={{ backgroundColor: tool.grad }}
                    >
                      <tool.Icon className="text-white" size={28} strokeWidth={2} />
                    </div>
                    <p className="text-xs font-medium text-[#020817]">{tool.label}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* CTA Banner */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-white via-[#F8FCFF] to-[#F3FAFF] rounded-2xl p-6 md:p-8 shadow-lg border border-[#E2E8F0] relative overflow-hidden group hover:shadow-xl transition-shadow duration-300 mb-6 md:mb-8"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#00c0ff]/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#043570]/5 to-transparent rounded-full blur-2xl pointer-events-none"></div>

              {/* Blue wave decoration at bottom right */}
              <div className="absolute bottom-0 right-0 w-48 h-40 opacity-100 pointer-events-none">
                <svg viewBox="0 0 192 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M0 160C0 160 48 96 96 96C144 96 192 48 192 48V160H0Z" fill="url(#wave1)" fillOpacity="0.6"/>
                  <path d="M24 160C24 160 60 114 96 114C132 114 168 78 168 78L192 102V160H24Z" fill="url(#wave2)" fillOpacity="0.4"/>
                  <defs>
                    <linearGradient id="wave1" x1="0" y1="0" x2="192" y2="160" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#00c0ff" stopOpacity="0.2"/>
                      <stop offset="1" stopColor="#0EA5E9" stopOpacity="0.1"/>
                    </linearGradient>
                    <linearGradient id="wave2" x1="24" y1="78" x2="192" y2="160" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#043570" stopOpacity="0.15"/>
                      <stop offset="1" stopColor="#043570" stopOpacity="0.05"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2">
                <div className="flex-1 space-y-4">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 bg-[#00c0ff]/10 text-[#043570] border-[#00c0ff]/20 px-3 py-1.5 rounded-full text-xs font-semibold border">
                    <Sparkles size={14} className="text-[#00c0ff]" />
                    OCD Specialists
                  </div>

                  {/* Heading */}
                  <h3 className="text-[#020817] text-2xl md:text-3xl font-bold leading-tight">
                    Connect with OCD specialists from the comfort of home
                  </h3>

                  {/* Description */}
                  <p className="text-[#64748B] text-sm md:text-base max-w-lg leading-relaxed">
                    Consult with licensed OCD specialists via video or chat for therapeutic support, personalized treatment plans, and evidence-based care. Get expert help managing OCD without leaving your home.
                  </p>

                  {/* Stats Row */}
                  <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00c0ff] to-[#0EA5E9] border-2 border-white flex items-center justify-center">
                            <Users size={14} className="text-white" />
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-[#64748B] font-medium">
                        150+ OCD Specialists
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star size={16} className="text-[#FFA500] fill-[#FFA500]" />
                      <span className="text-sm font-semibold text-[#020817]">4.9</span>
                      <span className="text-xs text-[#64748B]">
                        (1.2k reviews)
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate("/plans")}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00c0ff] to-[#0EA5E9] text-white px-8 py-3.5 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all"
                    >
                      Explore Plans
                      <ArrowRight size={18} strokeWidth={2.5} />
                    </motion.button>
                  </div>
                </div>

                {/* Profile Image with decoration */}
                <div className="hidden md:block flex-shrink-0 relative mx-auto w-auto md:w-64">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00c0ff] to-[#0EA5E9] rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>

                  {/* Image container */}
                  <div className="relative w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-4 ring-[#00c0ff]/20">
                    <ImageWithFallback
                      src={ocdCtaImage}
                      alt="OCD Treatment"
                      className="w-full h-full object-cover"
                    />

                    {/* Online indicator */}
                    <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 w-4 h-4 bg-[#22C55E] rounded-full border-2 border-white shadow-md z-10"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </main>
        </div>
      </div>

      {/* Mobile App Modal */}
      <MobileAppModal isOpen={showMobileAppModal} onClose={() => setShowMobileAppModal(false)} />
    </>
  );
}
