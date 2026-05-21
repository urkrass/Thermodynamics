"use client";

import { Check, ChevronDown, Circle } from "lucide-react";
import { useState } from "react";
import {
  firstStepIndexBySection,
  lessonSections,
  type LessonSectionId,
} from "@/data/thermoLesson";

export type SectionStatus = "not-started" | "in-progress" | "completed";

const statusLabel: Record<SectionStatus, string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  completed: "Completed",
};

type SectionJumpProps = {
  currentSectionId: LessonSectionId;
  statuses: Record<LessonSectionId, SectionStatus>;
  onJump: (index: number) => void;
};

export function SectionJump({
  currentSectionId,
  statuses,
  onJump,
}: SectionJumpProps) {
  const [open, setOpen] = useState(false);
  const currentSection =
    lessonSections.find((section) => section.id === currentSectionId) ??
    lessonSections[0];

  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-[0_8px_24px_rgba(22,38,45,0.05)] transition hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-teal-600/10"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{currentSection.title}</span>
        <ChevronDown className="h-4 w-4 text-slate-500" aria-hidden="true" />
      </button>

      {open ? (
        <div
          className="absolute left-0 top-12 z-30 w-[min(88vw,22rem)] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_60px_rgba(22,38,45,0.12)]"
          role="menu"
        >
          {lessonSections.map((section) => {
            const status = statuses[section.id];
            const isCurrent = section.id === currentSectionId;

            return (
              <button
                key={section.id}
                type="button"
                role="menuitem"
                className="flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
                onClick={() => {
                  onJump(firstStepIndexBySection[section.id]);
                  setOpen(false);
                }}
              >
                <span>
                  <span className="block font-medium text-slate-900">
                    {section.title}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {statusLabel[status]}
                  </span>
                </span>
                <span
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 text-slate-500"
                  aria-hidden="true"
                >
                  {status === "completed" ? (
                    <Check className="h-4 w-4 text-teal-700" />
                  ) : isCurrent ? (
                    <Circle className="h-3 w-3 fill-teal-600 text-teal-600" />
                  ) : (
                    <Circle className="h-3 w-3" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
