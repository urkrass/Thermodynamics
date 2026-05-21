"use client";

import type { LessonStep } from "@/data/thermoLesson";
import type { LessonSession } from "@/lib/useLessonSession";
import { EquationBlock } from "@/components/lesson/EquationBlock";
import { ExampleReveal } from "@/components/lesson/ExampleReveal";
import { ExerciseInput } from "@/components/lesson/ExerciseInput";
import { NotationText } from "@/components/lesson/NotationText";
import { ScientificVisual } from "@/components/lesson/ScientificVisual";

type StepRendererProps = {
  step: LessonStep;
  session: LessonSession;
  summary: {
    completedSteps: number;
    attemptedExercises: number;
    correctExercises: number;
  };
  totalSteps: number;
  onSetAnswer: (answerId: string, value: string) => void;
  onRevealExample: () => void;
  onExerciseAttempt: () => void;
  onExerciseResult: (
    answerId: string,
    result: import("@/lib/checkAnswer").CheckResult,
  ) => void;
  onShowHint: () => void;
  onShowSolution: () => void;
  onReset: () => void;
  onReviewWeakAreas: () => void;
};

export function StepRenderer({
  step,
  session,
  summary,
  totalSteps,
  onSetAnswer,
  onRevealExample,
  onExerciseAttempt,
  onExerciseResult,
  onShowHint,
  onShowSolution,
  onReset,
  onReviewWeakAreas,
}: StepRendererProps) {
  return (
    <article className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-teal-700">
          {step.type}
        </p>
        <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
          {step.title}
        </h1>
      </div>

      <div className="max-w-4xl space-y-3 text-lg leading-8 text-slate-600">
        {step.body.map((paragraph) => (
          <p key={paragraph}>
            <NotationText text={paragraph} />
          </p>
        ))}
      </div>

      {step.equations?.map((equation) => (
        <EquationBlock
          key={equation.latex}
          latex={equation.latex}
          caption={equation.caption}
          className="max-w-4xl"
        />
      ))}

      {step.visualType ? (
        <section aria-label="Scientific visual" className="max-w-5xl">
          <ScientificVisual type={step.visualType} sceneData={step.sceneData} />
        </section>
      ) : null}

      {step.example ? (
        <ExampleReveal
          stepId={step.id}
          example={step.example}
          revealed={Boolean(session.revealedExamples[step.id])}
          onReveal={onRevealExample}
        />
      ) : null}

      {step.exercise ? (
        <ExerciseInput
          stepId={step.id}
          exercise={step.exercise}
          answers={session.answers[step.id] ?? {}}
          attempts={session.exerciseAttempts[step.id] ?? 0}
          results={session.exerciseResults[step.id] ?? {}}
          hintShown={Boolean(session.hintsShown[step.id])}
          solutionShown={Boolean(session.solutionsShown[step.id])}
          onAnswerChange={onSetAnswer}
          onAttempt={onExerciseAttempt}
          onResult={onExerciseResult}
          onShowHint={onShowHint}
          onShowSolution={onShowSolution}
        />
      ) : null}

      {step.summaryRows ? (
        <section className="space-y-6" aria-label="Lesson summary">
          <div className="overflow-x-auto quiet-scrollbar rounded-3xl bg-slate-50/80 p-2">
            <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm">
              <thead>
                <tr className="text-slate-500">
                  <th className="px-4 py-3 font-medium">Method</th>
                  <th className="px-4 py-3 font-medium">Formula</th>
                  <th className="px-4 py-3 font-medium">Data needed</th>
                  <th className="px-4 py-3 font-medium">Common mistake</th>
                </tr>
              </thead>
              <tbody>
                {step.summaryRows.map((row) => (
                  <tr key={row.method} className="align-top">
                    <td className="px-4 py-3 font-medium text-slate-950">
                      {row.method}
                    </td>
                    <td className="px-4 py-3">
                      <EquationBlock latex={row.formula} display={false} />
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <NotationText text={row.dataNeeded} />
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <NotationText text={row.commonMistake} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-teal-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-teal-800">
                Steps completed
              </p>
              <p className="mt-1 text-2xl font-semibold text-teal-950">
                {summary.completedSteps}/{totalSteps}
              </p>
            </div>
            <div className="rounded-2xl bg-amber-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-amber-800">
                Exercises attempted
              </p>
              <p className="mt-1 text-2xl font-semibold text-amber-950">
                {summary.attemptedExercises}
              </p>
            </div>
            <div className="rounded-2xl bg-blue-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-blue-800">
                Correct checks
              </p>
              <p className="mt-1 text-2xl font-semibold text-blue-950">
                {summary.correctExercises}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-950/10"
              onClick={onReviewWeakAreas}
            >
              Review weak areas
            </button>
            <button
              type="button"
              className="rounded-full border border-rose-200 bg-white px-4 py-2.5 text-sm font-medium text-rose-800 transition hover:border-rose-300 focus:outline-none focus:ring-4 focus:ring-rose-600/10"
              onClick={onReset}
            >
              Reset progress
            </button>
          </div>
        </section>
      ) : null}
    </article>
  );
}
