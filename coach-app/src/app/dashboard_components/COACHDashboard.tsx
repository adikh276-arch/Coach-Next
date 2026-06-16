"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const activities = [
  {
    slug: "coach_journey",
    title: "My Journey",
    description: "Track your personal growth, goals, and assessments",
    icon: "🗺️",
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
  },
  {
    slug: "coaching_areas",
    title: "Coaching Areas",
    description: "Explore all areas of your coaching and personal growth",
    icon: "🎯",
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
  },
  {
    slug: "confidence_identity",
    title: "Confidence & Identity",
    description: "Build self-esteem and discover your true self",
    icon: "🦁",
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50",
  },
  {
    slug: "daily_focus",
    title: "Daily Focus Tracker",
    description: "Maintain your daily habits and focus areas",
    icon: "☀️",
    color: "from-yellow-400 to-amber-500",
    bg: "bg-yellow-50",
  },
  {
    slug: "emotional_regulation",
    title: "Emotional Regulation",
    description: "Tools to manage stress and balance your emotions",
    icon: "🌊",
    color: "from-cyan-500 to-blue-600",
    bg: "bg-cyan-50",
  },
  {
    slug: "goal_momentum",
    title: "Goal Momentum Tracker",
    description: "Keep your goals alive with momentum tracking",
    icon: "🚀",
    color: "from-rose-500 to-pink-600",
    bg: "bg-rose-50",
  },
  {
    slug: "coaching_integration",
    title: "Coaching Integration",
    description: "Measure how effectively you apply coaching into action",
    icon: "💼",
    color: "from-purple-500 to-violet-600",
    bg: "bg-purple-50",
  },
];

export default function COACHDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            MantraCoach
          </h1>
          <p className="text-slate-400 text-lg">
            Select an activity to begin your session
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activities.map((activity) => (
            <Link
              key={activity.slug}
              href={`/${activity.slug}`}
              className="group relative rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 overflow-hidden flex flex-col h-full"
            >
              <div className="p-6 flex flex-col flex-grow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 bg-gradient-to-br ${activity.color} shadow-lg shadow-black/20`}>
                  {activity.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {activity.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed flex-grow">
                  {activity.description}
                </p>
                
                <div className="mt-6 flex items-center text-sm font-medium text-white/50 group-hover:text-white transition-colors">
                  Open Activity
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              
              {/* Decorative gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${activity.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
