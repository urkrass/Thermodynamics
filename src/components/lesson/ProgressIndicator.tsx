"use client";

import { motion } from "motion/react";
import type { LessonStep } from "@/data/thermoLesson";

type ProgressIndicatorProps = {
  currentIndex: number;
  steps: LessonStep[];
  completedStepIds: string[];
};

export function ProgressIndicator({
  currentIndex,
  steps,
  completedStepIds,
}: ProgressIndicatorProps) {
  const progressPercent =
    steps.length <= 1 ? 100 : Math.round((currentIndex / (steps.length - 1)) * 100);

  return (
    <div className="min-w-[140px]" aria-label={`Progress ${progressPercent}%`}>
      <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
        <span>
          Step {currentIndex + 1} of {steps.length}
        </span>
        <span>{completedStepIds.length} done</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200/70">
        <motion.div
          layout
          className="h-full rounded-full bg-teal-600"
          initial={false}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        />
      </div>
    </div>
  );
}
