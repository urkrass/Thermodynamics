"use client";

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
        <div
          className="h-full rounded-full bg-teal-600 transition-[width] duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
