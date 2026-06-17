"use server";

import { sql } from '@/lib/db';
import { z } from 'zod';

const userIdSchema = z.string();

export async function fetchUserAssessments(userId: string) {
  try {
    const id = userIdSchema.parse(userId);
    const resultsData = await sql`
      SELECT * FROM assessment_results 
      WHERE user_id = ${id} 
      ORDER BY completed_at ASC
    `;
    
    if (resultsData.length > 0) {
      const resultIds = resultsData.map((r: any) => r.id);
      const answersData = await sql`
        SELECT * FROM assessment_answers 
        WHERE result_id = ANY(${resultIds})
      `;
      
      const mappedResults = resultsData.map((r: any) => {
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
      return { success: true, data: mappedResults };
    }
    return { success: true, data: [] };
  } catch (err) {
    console.error('Failed to load assessments:', err);
    return { success: false, error: 'Failed to fetch assessments' };
  }
}

const addAssessmentSchema = z.object({
  userId: z.string(),
  assessmentId: z.string(),
  completedAt: z.string(),
  answers: z.array(z.object({
    questionId: z.string(),
    value: z.any()
  }))
});

export async function addAssessmentResult(payload: z.infer<typeof addAssessmentSchema>) {
  try {
    const p = addAssessmentSchema.parse(payload);
    
    // 1. Insert into assessment_results
    const insertResult = await sql`
      INSERT INTO assessment_results (user_id, assessment_id, completed_at)
      VALUES (${p.userId}, ${p.assessmentId}, ${p.completedAt})
      RETURNING id
    `;
    const insertedResultId = insertResult[0].id;
    
    // 2. Insert into assessment_answers
    for (const answer of p.answers) {
      await sql`
        INSERT INTO assessment_answers (result_id, question_id, value)
        VALUES (${insertedResultId}, ${answer.questionId}, ${answer.value})
      `;
    }
    return { success: true, insertedId: insertedResultId };
  } catch (err) {
    console.error('Failed to save assessment to DB:', err);
    return { success: false, error: 'Failed to save assessment' };
  }
}
