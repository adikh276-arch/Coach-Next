"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AssessmentResult } from '../data/assessmentData';
import { sql } from '../../lib/db';
import { useAuth } from './AuthContext';

interface AssessmentContextType {
  assessmentResults: AssessmentResult[];
  addAssessmentResult: (result: AssessmentResult) => Promise<void>;
  getLatestAssessmentResult: (assessmentId: string) => AssessmentResult | undefined;
  onboardingProgress: {
    setFocusAreas: boolean;
    rateFocusAreas: boolean;
    attendFirstSession: boolean;
  };
  updateOnboardingProgress: (step: keyof AssessmentContextType['onboardingProgress']) => void;
  isLoading: boolean;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth();
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [onboardingProgress, setOnboardingProgress] = useState(() => {
    const saved = localStorage.getItem('mantracoach-onboarding');
    return saved ? JSON.parse(saved) : {
      setFocusAreas: false,
      rateFocusAreas: false,
      attendFirstSession: false,
    };
  });

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        if (!userId) return;
        
        let resultsData: any[] = [];
        try {
          // Try Fetch all results for user from DB
          resultsData = await sql`
            SELECT * FROM assessment_results 
            WHERE user_id = ${userId} 
            ORDER BY completed_at ASC
          `;
        } catch (dbErr: any) {
          console.warn('[AssessmentContext] DB Table missing, falling back to LocalStorage:', dbErr.message);
          const localData = localStorage.getItem(`mantra_assessments_${userId}`);
          if (localData) {
            setAssessmentResults(JSON.parse(localData).map((r: any) => ({
              ...r,
              completedAt: new Date(r.completedAt)
            })));
            setIsLoading(false);
            return;
          }
        }
        
        if (resultsData.length > 0) {
          const resultIds = resultsData.map((r: any) => r.id);
          const answersData = await sql`
            SELECT * FROM assessment_answers 
            WHERE result_id = ANY(${resultIds})
          `;
          
          const mappedResults: AssessmentResult[] = resultsData.map((r: any) => {
            const rowAnswers = answersData.filter((a: any) => a.result_id === r.id);
            return {
              assessmentId: r.assessment_id,
              completedAt: new Date(r.completed_at),
              answers: rowAnswers.map((a: any) => ({
                questionId: a.question_id,
                value: a.value
              }))
            };
          });
          
          setAssessmentResults(mappedResults);
          // Sync to local storage for offline use
          localStorage.setItem(`mantra_assessments_${userId}`, JSON.stringify(mappedResults));
        }
      } catch (err) {
        console.error('Failed to load assessments:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAssessments();
  }, [userId]);

  useEffect(() => {
    localStorage.setItem('mantracoach-onboarding', JSON.stringify(onboardingProgress));
  }, [onboardingProgress]);

  const addAssessmentResult = async (result: AssessmentResult) => {
    const updatedResults = [...assessmentResults, result];
    
    // Always update local state first
    setAssessmentResults(updatedResults);
    if (userId) {
      localStorage.setItem(`mantra_assessments_${userId}`, JSON.stringify(updatedResults));
    }

    try {
      if (!userId) throw new Error("Unauthorized");
      
      // 1. Insert into assessment_results
      const insertResult = await sql`
        INSERT INTO assessment_results (user_id, assessment_id, completed_at)
        VALUES (${userId}, ${result.assessmentId}, ${result.completedAt.toISOString()})
        RETURNING id
      `;
      const insertedResultId = insertResult[0].id;
      
      // 2. Insert into assessment_answers
      for (const answer of result.answers) {
        await sql`
          INSERT INTO assessment_answers (result_id, question_id, value)
          VALUES (${insertedResultId}, ${answer.questionId}, ${answer.value})
        `;
      }
    } catch (err: any) {
      if (err.message?.includes('relation') || err.message?.includes('does not exist')) {
        console.warn('[AssessmentContext] DB Table missing, saved to LocalStorage only.');
      } else {
        console.error('Failed to save assessment to DB:', err);
      }
      // We don't throw here because we've already saved to LocalStorage
    }

    // Automatically mark relevant onboarding steps as complete
    if (!onboardingProgress.setFocusAreas) {
      setOnboardingProgress((prev: any) => ({ ...prev, setFocusAreas: true }));
    }
    if (!onboardingProgress.rateFocusAreas) {
      setOnboardingProgress((prev: any) => ({ ...prev, rateFocusAreas: true }));
    }
  };

  const getLatestAssessmentResult = (assessmentId: string) => {
    const results = assessmentResults.filter(r => r.assessmentId === assessmentId);
    return results.length > 0 ? results[results.length - 1] : undefined;
  };

  const updateOnboardingProgress = (step: keyof AssessmentContextType['onboardingProgress']) => {
    setOnboardingProgress((prev: any) => ({ ...prev, [step]: true }));
  };

  return (
    <AssessmentContext.Provider value={{ 
      assessmentResults, 
      addAssessmentResult,
      getLatestAssessmentResult,
      onboardingProgress,
      updateOnboardingProgress,
      isLoading
    }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessments() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessments must be used within AssessmentProvider');
  }
  return context;
}
