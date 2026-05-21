"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  lessonSections,
  thermoLesson,
  type LessonSectionId,
} from "@/data/thermoLesson";
import {
  STORAGE_KEY,
  useLessonSession,
  type LessonSession,
} from "@/lib/useLessonSession";
import { ProgressIndicator } from "@/components/lesson/ProgressIndicator";
import { SectionJump, type SectionStatus } from "@/components/lesson/SectionJump";
import { ScientificVisual } from "@/components/lesson/ScientificVisual";
import { StepRenderer } from "@/components/lesson/StepRenderer";
import type { CheckResult } from "@/lib/checkAnswer";

function getSectionStatuses(
  session: LessonSession,
  currentSectionId: LessonSectionId,
): Record<LessonSectionId, SectionStatus> {
  return lessonSections.reduce(
    (acc, section) => {
      const sectionSteps = thermoLesson.filter((step) => step.section === section.id);
      const completedCount = sectionSteps.filter((step) =>
        session.completedStepIds.includes(step.id),
      ).length;

      if (completedCount === sectionSteps.length && sectionSteps.length > 0) {
        acc[section.id] = "completed";
      } else if (completedCount > 0 || section.id === currentSectionId) {
        acc[section.id] = "in-progress";
      } else {
        acc[section.id] = "not-started";
      }

      return acc;
    },
    {} as Record<LessonSectionId, SectionStatus>,
  );
}

function formatLastVisited(timestamp: string | null) {
  if (!timestamp) {
    return "Progress saves automatically";
  }

  return `Last saved ${new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp))}`;
}

export function LessonShell() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [isMotionPreferenceReady, setIsMotionPreferenceReady] = useState(false);
  const {
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
  } = useLessonSession(thermoLesson.length);

  const currentIndex = Math.min(session.currentStepIndex, thermoLesson.length - 1);
  const currentStep = thermoLesson[currentIndex];
  const statuses = useMemo(
    () => getSectionStatuses(session, currentStep.section),
    [currentStep.section, session],
  );

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsMotionPreferenceReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const reduceMotion = isMotionPreferenceReady && prefersReducedMotion;

  const goToStep = useCallback(
    (index: number) => {
      setCurrentStepIndex(index);
    },
    [setCurrentStepIndex],
  );

  const goNext = useCallback(() => {
    markStepComplete(currentStep.id);
    setCurrentStepIndex(currentIndex + 1);
  }, [currentIndex, currentStep.id, markStepComplete, setCurrentStepIndex]);

  const goBack = useCallback(() => {
    setCurrentStepIndex(currentIndex - 1);
  }, [currentIndex, setCurrentStepIndex]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName;
      if (tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT") {
        return;
      }

      if (event.key === "ArrowRight" && currentIndex < thermoLesson.length - 1) {
        event.preventDefault();
        goNext();
      }

      if (event.key === "ArrowLeft" && currentIndex > 0) {
        event.preventDefault();
        goBack();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, goBack, goNext]);

  function handleReset() {
    if (
      window.confirm(
        `Reset all saved worksheet progress stored under ${STORAGE_KEY}?`,
      )
    ) {
      resetSession();
    }
  }

  function reviewWeakAreas() {
    const weakStepIndex = thermoLesson.findIndex((step) => {
      if (!step.exercise) {
        return false;
      }

      const attempts = session.exerciseAttempts[step.id] ?? 0;
      const results = Object.values(session.exerciseResults[step.id] ?? {});
      return attempts === 0 || !results.some((result) => result.status === "correct");
    });

    setCurrentStepIndex(weakStepIndex >= 0 ? weakStepIndex : 0);
  }

  return (
    <div className="lesson-shell">
        <div className="lesson-surface flex flex-col">
          <header className="flex flex-col gap-4 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <SectionJump
                currentSectionId={currentStep.section}
                statuses={statuses}
                onJump={goToStep}
              />
              <p className="text-sm text-slate-500" aria-live="polite">
                {isHydrated
                  ? formatLastVisited(session.lastVisitedAt)
                  : "Loading saved progress"}
              </p>
            </div>
            <ProgressIndicator
              currentIndex={currentIndex}
              steps={thermoLesson}
              completedStepIds={session.completedStepIds}
            />
          </header>

          <main className="grid flex-1 gap-8 px-5 pb-5 pt-3 sm:px-8 sm:pb-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center lg:gap-12">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                layout
                key={currentStep.id}
                initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, x: -18 }}
                transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
                className="min-w-0"
              >
                <StepRenderer
                  step={currentStep}
                  session={session}
                  summary={summary}
                  totalSteps={thermoLesson.length}
                  onSetAnswer={(answerId, value) =>
                    setAnswer(currentStep.id, answerId, value)
                  }
                  onRevealExample={() => setExampleRevealed(currentStep.id, true)}
                  onExerciseAttempt={() => incrementExerciseAttempt(currentStep.id)}
                  onExerciseResult={(answerId: string, result: CheckResult) =>
                    setExerciseResult(currentStep.id, answerId, result)
                  }
                  onShowHint={() => setHintShown(currentStep.id, true)}
                  onShowSolution={() => setSolutionShown(currentStep.id, true)}
                  onReset={handleReset}
                  onReviewWeakAreas={reviewWeakAreas}
                />
              </motion.div>
            </AnimatePresence>

            <motion.aside
              layout
              className="min-w-0 self-center lg:sticky lg:top-8"
              aria-label="Scientific visual"
            >
              <ScientificVisual
                type={currentStep.visualType}
                sceneData={currentStep.sceneData}
              />
            </motion.aside>
          </main>

          <footer className="flex flex-col gap-3 px-5 pb-5 sm:px-8 sm:pb-8 md:flex-row md:items-center md:justify-between">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 transition hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-teal-600/10 disabled:opacity-45"
            onClick={goBack}
            disabled={currentIndex === 0}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </button>
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 transition hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-teal-600/10"
              onClick={handleReset}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset progress
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-950/10 disabled:opacity-45"
              onClick={goNext}
              disabled={currentIndex === thermoLesson.length - 1}
            >
              Next
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          </footer>
        </div>
      </div>
  );
}
