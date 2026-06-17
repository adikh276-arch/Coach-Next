"use client";
import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, TrendingUp, RefreshCw } from 'lucide-react';
import { ASSESSMENTS, AssessmentAnswer, FOCUS_AREAS, calculateFocusAreaScores } from '../data/assessmentData';
import { useAssessments } from '../context/AssessmentContext';
import { useTranslation } from 'react-i18next';
import { ShareModal } from '@/components/ShareModal';

export function AssessmentTest() {
  const { t } = useTranslation();
  const { assessmentId } = useParams() as { assessmentId?: string };
  const router = useRouter();
  const { addAssessmentResult, getLatestAssessmentResult } = useAssessments();
  
  const assessment = ASSESSMENTS.find(a => a.id === assessmentId);
  const existingResult = getLatestAssessmentResult(assessmentId || '');
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([]);
  const [showResults, setShowResults] = useState(!!existingResult);
  const [isRetaking, setIsRetaking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);

  // Add smooth loading transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Calculate results for this assessment - use existingResult answers if viewing old results
  const resultsToDisplay = showResults && answers.length === 0 && existingResult ? existingResult.answers : answers;
  
  const assessmentScores = useMemo(() => {
    if (!assessment || !showResults || resultsToDisplay.length === 0) return {};
    
    const scores: Record<string, { total: number; count: number }> = {};
    
    FOCUS_AREAS.forEach(area => {
      scores[area.id] = { total: 0, count: 0 };
    });

    resultsToDisplay.forEach(answer => {
      const question = assessment.questions.find(q => q.id === answer.questionId);
      if (!question) return;

      question.focusAreas.forEach(areaId => {
        scores[areaId].total += answer.value;
        scores[areaId].count += 1;
      });
    });

    const finalScores: Record<string, number> = {};
    Object.keys(scores).forEach(areaId => {
      finalScores[areaId] = scores[areaId].count > 0 
        ? Math.round((scores[areaId].total / scores[areaId].count) * 10) / 10
        : 0;
    });

    return finalScores;
  }, [assessment, showResults, resultsToDisplay]);

  // Get top 5 areas to work on (lowest scores)
  const areasToWorkOn = useMemo(() => {
    const areas = Object.entries(assessmentScores)
      .filter(([_, score]) => score > 0 && score < 4) // Below 4 = needs work (1-3 range)
      .sort((a, b) => a[1] - b[1]) // Sort ascending (lowest first)
      .slice(0, 5)
      .map(([areaId, score]) => ({
        area: FOCUS_AREAS.find(a => a.id === areaId)!,
        score,
      }));
    return areas;
  }, [assessmentScores]);

  // Get top 5 strengths (highest scores)
  const strengths = useMemo(() => {
    const areas = Object.entries(assessmentScores)
      .filter(([_, score]) => score >= 4) // 4-5 = strong influence
      .sort((a, b) => b[1] - a[1]) // Sort descending (highest first)
      .slice(0, 5)
      .map(([areaId, score]) => ({
        area: FOCUS_AREAS.find(a => a.id === areaId)!,
        score,
      }));
    return areas;
  }, [assessmentScores]);

  const handleRetakeAssessment = () => {
    setAnswers([]);
    setCurrentQuestion(0);
    setShowResults(false);
    setIsRetaking(true);
  };

  const handleAnswerSelect = (value: number) => {
    if (!assessment) return;
    const questionId = assessment.questions[currentQuestion].id;
    const newAnswers = answers.filter(a => a.questionId !== questionId);
    newAnswers.push({ questionId, value });
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (!assessment) return;
    if (currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Submit assessment
      const result = {
        assessmentId: assessment.id,
        answers,
        completedAt: new Date(),
      };
      addAssessmentResult(result);
      setShowResults(true);
      setShowShareModal(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const currentAnswer = assessment ? answers.find(a => a.questionId === assessment.questions[currentQuestion]?.id) : undefined;
  const canProceed = !!currentAnswer;

  // NO EARLY RETURNS - use conditional rendering instead
  // Handle assessment not found
  if (!assessment) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Assessment not found</p>
      </div>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
          <div className="flex-1">
            <div className="h-8 bg-gray-200 rounded-lg w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
        </div>

        {/* Card Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="space-y-6">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            
            <div className="space-y-3 pt-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-14 bg-gray-100 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    // Only show results sections if we have data
    const hasAreasToWorkOn = areasToWorkOn.length > 0;
    const hasStrengths = strengths.length > 0;

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => router.push('/coach/coach_journey/assessments')}
          className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">{t('test.back')}</span>
        </button>

        {/* Info banner if retaken */}
        {isRetaking && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">
                {t('test.updated')}
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Check className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{t(`assessments.${assessment.id === 'emotional-intelligence' ? 'ei' : assessment.id === 'strength-assessment' ? 'sa' : 'lp'}.title`)}</h1>
                <p className="text-gray-600">{t('test.completedText')}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {hasAreasToWorkOn && (
                <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    {t('test.areasToFocus')}
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">{t('test.areasToFocusDesc')}</p>
                  <div className="space-y-2">
                    {areasToWorkOn.map(({ area, score }) => (
                      <div key={area.id} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0 shadow" 
                            style={{ backgroundColor: area.color }}
                          />
                          <span className="font-medium text-sm text-gray-900 truncate">{t(`assessments.areas.${area.id}`)}</span>
                        </div>
                        <span className="font-bold text-orange-600 ml-2">{score}/5</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasStrengths && (
                <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    {t('test.strengths')}
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">{t('test.strengthsDesc')}</p>
                  <div className="space-y-2">
                    {strengths.map(({ area, score }) => (
                      <div key={area.id} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0 shadow" 
                            style={{ backgroundColor: area.color }}
                          />
                          <span className="font-medium text-sm text-gray-900 truncate">{t(`assessments.areas.${area.id}`)}</span>
                        </div>
                        <span className="font-bold text-green-600 ml-2">{score}/5</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!hasAreasToWorkOn && !hasStrengths && (
                <div className="md:col-span-2">
                  <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-100">
                    <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{t('test.excellent')}</h3>
                    <p className="text-gray-700">{t('test.excellentDesc')}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Score Interpretation Guide */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('test.understanding')}
              </h4>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-red-700 font-bold text-sm">1-2</span>
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">{t('test.needsFocus')}</span>
                  </div>
                  <p className="text-xs text-gray-600">{t('test.needsFocusDesc')}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-yellow-700 font-bold text-sm">3</span>
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">{t('test.developing')}</span>
                  </div>
                  <p className="text-xs text-gray-600">{t('test.developingDesc')}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-700 font-bold text-sm">4-5</span>
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">{t('test.strong')}</span>
                  </div>
                  <p className="text-xs text-gray-600">{t('test.strongDesc')}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('test.nextSteps')}
              </h4>
              <p className="text-sm text-gray-700 mb-4">
                {t('test.nextStepsDesc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => router.push('/coach/coach_journey')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition shadow-md"
                >
                  {t('test.viewFocus')}
                </button>
                <button
                  onClick={() => router.push('/coach/coach_journey/assessments')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-purple-600 border-2 border-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition"
                >
                  {t('test.takeAnother')}
                </button>
                <button
                  onClick={handleRetakeAssessment}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-purple-600 border-2 border-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>{t('test.retake')}</span>
                </button>
              </div>

              <div className="mt-8 border-t border-blue-200 pt-6">
                <ShareModal t={t} 
                  isOpen={showShareModal} 
                  onClose={() => setShowShareModal(false)} 
                  title={t('share.assessmentCompleted', 'Assessment Completed!')}
                  message={t('share.assessment_completed_msg', 'You have successfully completed your self-assessment. Share your results with your network!')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = assessment.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => router.push('/coach/coach_journey/assessments')}
        className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">{t('test.back')}</span>
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{t(`assessments.${assessment.id === 'emotional-intelligence' ? 'ei' : assessment.id === 'strength-assessment' ? 'sa' : 'lp'}.title`)}</h1>
            <span className="text-sm font-medium text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
              {t('test.questionOf', { current: currentQuestion + 1, total: assessment.questions.length })}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <div 
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-lg sm:text-xl text-gray-900 font-medium leading-relaxed">{t(`assessments.${assessment.id === 'emotional-intelligence' ? 'ei' : assessment.id === 'strength-assessment' ? 'sa' : 'lp'}.q${currentQuestion + 1}`)}</h2>

            <div className="space-y-3">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswerSelect(option.value)}
                  className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all ${
                    currentAnswer?.value === option.value
                      ? 'border-purple-500 bg-purple-50 shadow-sm'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
                      currentAnswer?.value === option.value
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300'
                    }`}>
                      {currentAnswer?.value === option.value && (
                        <div className="w-3 h-3 bg-white rounded-full" />
                      )}
                    </div>
                    <span className={`text-sm sm:text-base ${
                      currentAnswer?.value === option.value ? 'text-gray-900 font-medium' : 'text-gray-700'
                    }`}>
                      {t(`assessments.scale.${option.value === 1 ? 'never' : option.value === 2 ? 'rarely' : option.value === 3 ? 'sometimes' : option.value === 4 ? 'often' : 'always'}`)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 sm:p-8 pt-0">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-5 py-2.5 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">{t('test.previous')}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-purple-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            <span>{currentQuestion === assessment.questions.length - 1 ? t('test.completeBtn') : t('test.next')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
