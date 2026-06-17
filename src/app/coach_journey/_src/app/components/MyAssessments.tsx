"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Brain, Heart, Users, ChevronRight, RefreshCw, ChevronLeft } from 'lucide-react';
import { ASSESSMENTS } from '../data/assessmentData';
import { useAssessments } from '../context/AssessmentContext';
import { useTranslation } from 'react-i18next';

export function MyAssessments() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { getLatestAssessmentResult } = useAssessments();

  const getAssessmentStatus = (assessmentId: string) => {
    return getLatestAssessmentResult(assessmentId);
  };

  const assessmentColors = [
    { bg: 'from-purple-500 to-purple-600', light: 'bg-purple-50', text: 'text-purple-700', icon: Brain },
    { bg: 'from-green-500 to-green-600', light: 'bg-green-50', text: 'text-green-700', icon: Heart },
    { bg: 'from-orange-500 to-orange-600', light: 'bg-orange-50', text: 'text-orange-700', icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/coach/coach_journey', { scroll: false })}
          className="p-2 rounded-xl hover:bg-slate-200 transition-colors text-slate-700 flex-shrink-0"
          aria-label="Go Back"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('assessments.title')}</h1>
          <p className="text-sm text-gray-500">{t('assessments.subtitle')}</p>
        </div>
      </div>

      {/* Assessments Grid */}
      <div className="grid gap-4 sm:gap-6">
        {ASSESSMENTS.map((assessment, index) => {
          const assessmentResult = getAssessmentStatus(assessment.id);
          const isCompleted = !!assessmentResult;
          const colors = assessmentColors[index % assessmentColors.length];
          const IconComponent = colors.icon;
          
          return (
            <div key={assessment.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
              <Link href={`/coach/coach_journey/assessments/${assessment.id}`} className="group block">
                <div className="p-6 sm:p-8">
                  <div className="flex items-start gap-4 sm:gap-6">
                    {/* Icon */}
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${colors.bg} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-purple-600 transition">
                          {t(`assessments.${assessment.id === 'emotional-intelligence' ? 'ei' : assessment.id === 'strength-assessment' ? 'sa' : 'lp'}.title`)}
                        </h3>
                        {isCompleted && (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full flex-shrink-0">
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-xs font-semibold text-green-700">{t('assessments.completed')}</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
                        {t(`assessments.${assessment.id === 'emotional-intelligence' ? 'ei' : assessment.id === 'strength-assessment' ? 'sa' : 'lp'}.desc`)}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {assessment.questions.length} {t('assessments.questions')}
                        </span>
                        
                        <div className="flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-3 transition-all">
                          <span className="text-sm">{isCompleted ? t('assessments.viewResults') : t('assessments.start')}</span>
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              {isCompleted && (
                <div className="bg-gray-50 px-6 sm:px-8 py-4 border-t border-gray-100 rounded-b-2xl">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs sm:text-sm text-gray-600">
                      {t('assessments.lastCompleted')} {new Date(assessmentResult.completedAt).toLocaleDateString(i18n.resolvedLanguage || 'en', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                    <Link
                      href={`/coach/coach_journey/assessments/${assessment.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-purple-600 text-purple-600 rounded-xl text-sm font-semibold hover:bg-purple-50 transition shadow-sm"
                    >
                      <RefreshCw className="w-4 h-4" />
                      {t('assessments.retake')}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border border-blue-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 mb-1">{t('assessments.about')}</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {t('assessments.aboutDesc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
