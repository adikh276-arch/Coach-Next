import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  getOrCreateUser,
  startSession,
  completeSession,
  saveAllFieldResponses,
  saveSpecialResponse,
} from "@/lib/exerciseDb";


type Status = "idle" | "starting" | "saving" | "done" | "error";

interface SaveFieldPayload {
  fieldId: string;
  fieldLabel: string;
  fieldType: string;
  responseText: string | null;
  responseJson: unknown | null;
}

interface UseExerciseSessionReturn {
  sessionId: string | null;
  status: Status;
  /** Call once when opening an exercise to create a fresh session. */
  initSession: (coachingAreaId: string, exerciseId: string) => Promise<string | null>;
  /** Save all template-exercise fields and mark session complete. */
  submitTemplateExercise: (fields: SaveFieldPayload[]) => Promise<void>;
  /** Save special exercise blob and mark session complete. */
  submitSpecialExercise: (
    specialType: string,
    data: Record<string, unknown>,
    score?: number
  ) => Promise<void>;
}

/**
 * Manages the full lifecycle of a single exercise session:
 * init → save responses → complete.
 */
export function useExerciseSession(): UseExerciseSessionReturn {
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  const initSession = useCallback(
    async (coachingAreaId: string, exerciseId: string): Promise<string | null> => {
      try {
        setStatus("starting");
        const storedUserId = sessionStorage.getItem("user_id");
        if (!storedUserId) throw new Error("No user session found");
        
        const userId = await getOrCreateUser(storedUserId);
        const sid = await startSession(userId, coachingAreaId, exerciseId);
        setSessionId(sid);
        setStatus("idle");
        return sid;
      } catch (err) {
        console.error("Failed to init exercise session:", err);
        setStatus("error");
        const message = err instanceof Error ? err.message : "Failed to initialize session.";
        toast({
          variant: "destructive",
          title: "Session Error",
          description: message,
        });
        return null;
      }
    },
    [toast]
  );

  const submitTemplateExercise = useCallback(
    async (fields: SaveFieldPayload[]) => {
      if (!sessionId) {
        throw new Error("No active database session. Ensure you have a valid connection.");
      }
      try {
        setStatus("saving");
        await saveAllFieldResponses(sessionId, fields);
        await completeSession(sessionId);
        setStatus("done");
      } catch (err) {
        console.error("Failed to save template exercise:", err);
        setStatus("error");
      }
    },
    [sessionId]
  );

  const submitSpecialExercise = useCallback(
    async (
      specialType: string,
      data: Record<string, unknown>,
      score?: number
    ) => {
      if (!sessionId) {
        throw new Error("No active database session. Ensure you have a valid connection.");
      }
      try {
        setStatus("saving");
        await saveSpecialResponse(sessionId, specialType, data, score);
        await completeSession(sessionId);
        setStatus("done");
      } catch (err) {
        console.error("Failed to save special exercise:", err);
        setStatus("error");
      }
    },
    [sessionId]
  );

  return { sessionId, status, initSession, submitTemplateExercise, submitSpecialExercise };
}
