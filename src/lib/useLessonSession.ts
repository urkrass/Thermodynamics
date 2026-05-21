"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CheckResult } from "@/lib/checkAnswer";

export const STORAGE_KEY = "thermo-worksheet-v1";

export type LessonSession = {
  version: 1;
  currentStepIndex: number;
  completedStepIds: string[];
  answers: Record<string, Record<string, string>>;
  revealedExamples: Record<string, boolean>;
  exerciseAttempts: Record<string, number>;
  exerciseResults: Record<string, Record<string, CheckResult>>;
  hintsShown: Record<string, boolean>;
  solutionsShown: Record<string, boolean>;
  lastVisitedAt: string | null;
};

const createInitialSession = (): LessonSession => ({
  version: 1,
  currentStepIndex: 0,
  completedStepIds: [],
  answers: {},
  revealedExamples: {},
  exerciseAttempts: {},
  exerciseResults: {},
  hintsShown: {},
  solutionsShown: {},
  lastVisitedAt: null,
});

function normalizeSession(value: unknown): LessonSession {
  if (!value || typeof value !== "object") {
    return createInitialSession();
  }

  const candidate = value as Partial<LessonSession>;

  if (candidate.version !== 1) {
    return createInitialSession();
  }

  return {
    ...createInitialSession(),
    ...candidate,
    completedStepIds: Array.isArray(candidate.completedStepIds)
      ? candidate.completedStepIds.filter((id): id is string => typeof id === "string")
      : [],
    currentStepIndex:
      typeof candidate.currentStepIndex === "number"
        ? Math.max(0, candidate.currentStepIndex)
        : 0,
    lastVisitedAt:
      typeof candidate.lastVisitedAt === "string" ? candidate.lastVisitedAt : null,
  };
}

export function useLessonSession(totalSteps: number) {
  const [session, setSession] = useState<LessonSession>(createInitialSession);
  const [isHydrated, setIsHydrated] = useState(false);
  const skipNextPersistRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let nextSession = createInitialSession();

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = normalizeSession(JSON.parse(saved));
        nextSession = {
          ...parsed,
          currentStepIndex: Math.min(parsed.currentStepIndex, totalSteps - 1),
        };
      }
    } catch {
      nextSession = createInitialSession();
    }

    window.queueMicrotask(() => {
      if (cancelled) {
        return;
      }

      setSession(nextSession);
      setIsHydrated(true);
    });

    return () => {
      cancelled = true;
    };
  }, [totalSteps]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (skipNextPersistRef.current) {
      skipNextPersistRef.current = false;
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [isHydrated, session]);

  const updateSession = useCallback(
    (updater: (previous: LessonSession) => LessonSession) => {
      setSession((previous) => ({
        ...updater(previous),
        lastVisitedAt: new Date().toISOString(),
      }));
    },
    [],
  );

  const setCurrentStepIndex = useCallback(
    (index: number) => {
      updateSession((previous) => ({
        ...previous,
        currentStepIndex: Math.max(0, Math.min(index, totalSteps - 1)),
      }));
    },
    [totalSteps, updateSession],
  );

  const markStepComplete = useCallback(
    (stepId: string) => {
      updateSession((previous) => {
        if (previous.completedStepIds.includes(stepId)) {
          return previous;
        }

        return {
          ...previous,
          completedStepIds: [...previous.completedStepIds, stepId],
        };
      });
    },
    [updateSession],
  );

  const setAnswer = useCallback(
    (stepId: string, answerId: string, value: string) => {
      updateSession((previous) => ({
        ...previous,
        answers: {
          ...previous.answers,
          [stepId]: {
            ...(previous.answers[stepId] ?? {}),
            [answerId]: value,
          },
        },
      }));
    },
    [updateSession],
  );

  const setExampleRevealed = useCallback(
    (stepId: string, revealed: boolean) => {
      updateSession((previous) => ({
        ...previous,
        revealedExamples: {
          ...previous.revealedExamples,
          [stepId]: revealed,
        },
      }));
    },
    [updateSession],
  );

  const incrementExerciseAttempt = useCallback(
    (stepId: string) => {
      updateSession((previous) => ({
        ...previous,
        exerciseAttempts: {
          ...previous.exerciseAttempts,
          [stepId]: (previous.exerciseAttempts[stepId] ?? 0) + 1,
        },
      }));
    },
    [updateSession],
  );

  const setExerciseResult = useCallback(
    (stepId: string, answerId: string, result: CheckResult) => {
      updateSession((previous) => ({
        ...previous,
        exerciseResults: {
          ...previous.exerciseResults,
          [stepId]: {
            ...(previous.exerciseResults[stepId] ?? {}),
            [answerId]: result,
          },
        },
      }));
    },
    [updateSession],
  );

  const setHintShown = useCallback(
    (stepId: string, shown: boolean) => {
      updateSession((previous) => ({
        ...previous,
        hintsShown: {
          ...previous.hintsShown,
          [stepId]: shown,
        },
      }));
    },
    [updateSession],
  );

  const setSolutionShown = useCallback(
    (stepId: string, shown: boolean) => {
      updateSession((previous) => ({
        ...previous,
        solutionsShown: {
          ...previous.solutionsShown,
          [stepId]: shown,
        },
      }));
    },
    [updateSession],
  );

  const resetSession = useCallback(() => {
    skipNextPersistRef.current = true;
    window.localStorage.removeItem(STORAGE_KEY);
    setSession(createInitialSession());
  }, []);

  const summary = useMemo(() => {
    const exerciseStepIds = Object.keys(session.exerciseAttempts);
    const attempted = exerciseStepIds.filter(
      (stepId) => (session.exerciseAttempts[stepId] ?? 0) > 0,
    ).length;
    const correct = Object.values(session.exerciseResults).filter((results) => {
      const values = Object.values(results);
      return values.length > 0 && values.every((result) => result.status === "correct");
    }).length;

    return {
      completedSteps: session.completedStepIds.length,
      attemptedExercises: attempted,
      correctExercises: correct,
    };
  }, [session.completedStepIds.length, session.exerciseAttempts, session.exerciseResults]);

  return {
    session,
    isHydrated,
    summary,
    setCurrentStepIndex,
    markStepComplete,
    setAnswer,
    setExampleRevealed,
    incrementExerciseAttempt,
    setExerciseResult,
    setHintShown,
    setSolutionShown,
    resetSession,
  };
}
