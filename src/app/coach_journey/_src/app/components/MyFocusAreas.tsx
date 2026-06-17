"use client";
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, ChevronLeft, Sparkles, Activity, BarChart3, Info, 
  Target, Zap, Compass, LayoutDashboard
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { FOCUS_AREAS, calculateFocusAreaScores, calculateActualProgress } from '../data/assessmentData';
import { useAssessments } from '../context/AssessmentContext';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

export function MyFocusAreas() {
  const { t } = useTranslation();
  const router = useRouter();
  const { assessmentResults, onboardingProgress, updateOnboardingProgress } = useAssessments();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate current cumulative scores
  const focusAreaScores = useMemo(() => {
    return calculateFocusAreaScores(assessmentResults);
  }, [assessmentResults]);

  // Generate cumulative chart data points over time
  const chartData = useMemo(() => {
    return calculateActualProgress(assessmentResults);
  }, [assessmentResults]);

  const radarData = useMemo(() => {
    return FOCUS_AREAS.map(area => ({
      subject: t(`assessments.areas.${area.id}`),
      A: focusAreaScores[area.id] || 0,
      fullMark: 5,
    }));
  }, [focusAreaScores, t]);

  // Filter visible lines in chart
  const visibleAreas = selectedFilter === 'all' 
    ? FOCUS_AREAS 
    : FOCUS_AREAS.filter(area => area.id === selectedFilter);

  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-purple-600 font-bold">Initializing Dashboard...</div>;
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.location.replace('/coach/coaching_areas')}
            className="p-2 rounded-xl hover:bg-white transition-colors text-slate-500 shadow-sm border border-slate-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('focus.title')}</h1>
            <p className="text-sm text-slate-500">{t('focus.subtitle')}</p>
          </div>
        </div>
        
        <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm hidden sm:block">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer py-2 px-4"
          >
            <option value="all">{t("focus.viewGlobalProgress", "View Global Cumulative Progress")}</option>
            {FOCUS_AREAS.map((area) => (
              <option key={area.id} value={area.id}>{t(`assessments.areas.${area.id}`)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Onboarding / Coaching Session Card */}
      <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-[2rem] p-6 sm:p-8 shadow-lg shadow-cyan-100 border border-cyan-400/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              {t('focus.onboardingTitle')}
            </h3>
            <p className="text-cyan-50 text-sm max-w-2xl leading-relaxed">
              {t('focus.onboardingDesc')}
            </p>
          </div>
          <a 
            href="https://web.mantracare.com/plans/coach"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-cyan-600 rounded-2xl font-bold hover:bg-cyan-50 transition shadow-xl whitespace-nowrap"
          >
            <Activity className="h-5 w-5" />
            {t('focus.onboardingBtn')}
          </a>
        </div>
      </div>

      {assessmentResults.length > 0 ? (
        <div className="space-y-6">
          
          {/* Main Timeline Card - FIXED SIZE FOR ABSOLUTE GUARANTEED VISIBILITY */}
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{t('focus.growthTimeline', 'Growth Timeline')}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('focus.cumulativeScoring', 'Cumulative Scoring')}</p>
                </div>
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                {t('focus.metricLabel', 'Metric: 0 - 5.0 Average')}
              </div>
            </div>

            <div className="w-full flex flex-col items-center bg-slate-50/50 rounded-3xl p-6 border border-slate-50">
              {/* FIXED PIXEL WIDTH CHART - Guaranteed to show in all environments */}
              <LineChart width={1000} height={420} data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dy={15} />
                <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                {visibleAreas.map((area) => (
                  <Line
                    key={area.id}
                    type="monotone"
                    dataKey={area.id}
                    stroke={area.color}
                    strokeWidth={4}
                    dot={{ fill: area.color, r: 5, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 7, strokeWidth: 0 }}
                    name={t(`assessments.areas.${area.id}`)}
                  />
                ))}
              </LineChart>

              {/* EXTERNAL LEGEND */}
              <div className="mt-14 flex flex-wrap justify-center gap-x-6 gap-y-3 px-8 w-full">
                {visibleAreas.map(area => (
                  <div key={area.id} className="flex items-center gap-2 group cursor-pointer">
                    <div className="w-3 h-3 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform" style={{ backgroundColor: area.color }} />
                    <span className="text-[9px] font-black text-slate-400 group-hover:text-slate-600 transition-colors uppercase tracking-widest">
                      {t(`assessments.areas.${area.id}`)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Balance Profile - FIXED SIZE */}
            <div className="lg:col-span-5 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col items-center">
              <h3 className="font-bold text-slate-800 mb-8 w-full flex items-center gap-2">
                <Target className="w-4 h-4 text-orange-500" />
                Current Balance Profile
              </h3>
              <div className="bg-slate-50 rounded-[2.5rem] p-6 border border-slate-100 shadow-inner flex justify-center items-center">
                <RadarChart cx="50%" cy="50%" outerRadius="60%" width={400} height={350} data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 800 }} />
                  <Radar name="Score" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                  <Tooltip />
                </RadarChart>
              </div>
            </div>

            {/* Performance Grid */}
            <div className="lg:col-span-7 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-8 flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-purple-500" />
                Cumulative Performance
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                {visibleAreas.map(area => (
                  <div key={area.id} className="p-5 bg-slate-50/80 rounded-3xl border border-transparent hover:border-slate-200 transition-all shadow-none hover:shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-6 rounded-full" style={{ backgroundColor: area.color }} />
                      <span className="text-[11px] font-black text-slate-500 uppercase tracking-tight">
                        {t(`assessments.areas.${area.id}`)}
                      </span>
                    </div>
                    <div className="flex items-end justify-between px-1 mb-2">
                      <div className="text-3xl font-black text-slate-900">{focusAreaScores[area.id] || 0}</div>
                      <div className="text-[11px] text-slate-400 mb-1 font-bold">/ 5.0</div>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-1000" 
                        style={{ width: `${((focusAreaScores[area.id] || 0) / 5) * 100}%`, backgroundColor: area.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Activity className="w-10 h-10 text-purple-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">{t('focus.emptyTitle')}</h3>
          <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto">{t('focus.emptyDesc')}</p>
          <Link 
            href="/coach/coach_journey/assessments" 
            replace
            className="inline-flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition shadow-xl"
          >
            <Sparkles className="h-5 w-5 text-yellow-400" />
            {t('focus.startBtn')}
          </Link>
        </div>
      )}
    </div>
  );
}
