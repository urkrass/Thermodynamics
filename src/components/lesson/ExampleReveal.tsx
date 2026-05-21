"use client";

import { AnimatePresence, motion } from "motion/react";
import { Eye } from "lucide-react";
import type { ExampleContent } from "@/data/thermoLesson";
import { EquationBlock } from "@/components/lesson/EquationBlock";
import { NotationText } from "@/components/lesson/NotationText";

type ExampleRevealProps = {
  stepId: string;
  example: ExampleContent;
  revealed: boolean;
  onReveal: () => void;
};

export function ExampleReveal({
  example,
  revealed,
  onReveal,
}: ExampleRevealProps) {
  return (
    <section className="mt-6 space-y-5" aria-label="Solved example">
      <div className="space-y-3">
        <p className="text-base font-medium text-slate-950">
          <NotationText text={example.problem} />
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {example.data.map((item) => (
            <div
              key={item}
              className="rounded-2xl bg-slate-50 px-3.5 py-2.5 text-[0.95rem] leading-7 text-slate-700"
            >
              <NotationText text={item} />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-950/10"
        onClick={onReveal}
        aria-expanded={revealed}
      >
        <Eye className="h-4 w-4" aria-hidden="true" />
        {revealed ? "Working revealed" : "Reveal working"}
      </button>

      <AnimatePresence initial={false}>
        {revealed ? (
          <motion.div
            layout
            className="space-y-4"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            {example.working.map((line, index) => (
              <motion.div
                layout
                key={line}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.24 }}
              >
                <EquationBlock latex={line} />
              </motion.div>
            ))}
            {example.conclusion ? (
              <p className="rounded-2xl bg-teal-50 px-4 py-3 text-sm text-teal-950">
                <NotationText text={example.conclusion} />
              </p>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
