"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, HelpCircle, Lightbulb, XCircle } from "lucide-react";
import type { ExerciseContent } from "@/data/thermoLesson";
import {
  checkChoiceAnswer,
  checkNumericAnswer,
  checkTextAnswer,
  type CheckResult,
} from "@/lib/checkAnswer";
import { EquationBlock } from "@/components/lesson/EquationBlock";
import { NotationText } from "@/components/lesson/NotationText";

type ExerciseInputProps = {
  stepId: string;
  exercise: ExerciseContent;
  answers: Record<string, string>;
  attempts: number;
  results: Record<string, CheckResult>;
  hintShown: boolean;
  solutionShown: boolean;
  onAnswerChange: (answerId: string, value: string) => void;
  onAttempt: () => void;
  onResult: (answerId: string, result: CheckResult) => void;
  onShowHint: () => void;
  onShowSolution: () => void;
};

const statusStyles: Record<CheckResult["status"], string> = {
  correct: "bg-teal-50 text-teal-950",
  close: "bg-amber-50 text-amber-950",
  incorrect: "bg-rose-50 text-rose-950",
};

function formatInputNotation(text: string) {
  return text
    .replace(/-/g, "−")
    .replace(/\^−1/g, "⁻¹")
    .replace(/\^-1/g, "⁻¹");
}

function formatPlaceholderValue(value: number) {
  return formatInputNotation(String(value));
}

function Feedback({ result }: { result?: CheckResult }) {
  if (!result) {
    return null;
  }

  const Icon = result.status === "correct" ? CheckCircle2 : XCircle;

  return (
    <p
      className={`mt-3 flex gap-2 rounded-2xl px-4 py-3 text-sm ${statusStyles[result.status]}`}
      aria-live="polite"
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <NotationText text={result.message} />
    </p>
  );
}

export function ExerciseInput({
  stepId,
  exercise,
  answers,
  attempts,
  results,
  hintShown,
  solutionShown,
  onAnswerChange,
  onAttempt,
  onResult,
  onShowHint,
  onShowSolution,
}: ExerciseInputProps) {
  const check = exercise.check;

  function handleCheck() {
    onAttempt();

    if (check.mode === "numeric") {
      check.answerParts.forEach((part) => {
        onResult(part.id, checkNumericAnswer(answers[part.id] ?? "", part));
      });
      return;
    }

    if (check.mode === "choice") {
      onResult(
        "choice",
        checkChoiceAnswer(
          answers.choice,
          check.expectedChoiceId,
          check.correctFeedback,
          check.incorrectFeedback,
        ),
      );
      return;
    }

    onResult(
      "text",
      checkTextAnswer(
        answers.text ?? "",
        check.keywords,
        check.minMatches,
        check.correctFeedback,
        check.closeFeedback,
        check.incorrectFeedback,
      ),
    );
  }

  return (
    <section className="mt-6 space-y-5" aria-label="Exercise">
      <div className="space-y-3">
        <p className="text-base font-medium text-slate-950">
          <NotationText text={exercise.prompt} />
        </p>
        {exercise.data?.length ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {exercise.data.map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-slate-50 px-3.5 py-2.5 text-[0.95rem] leading-7 text-slate-700"
              >
                <NotationText text={item} />
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {check.mode === "numeric" ? (
        <div className="space-y-4">
          {check.answerParts.map((part) => (
            <div key={part.id}>
              <label
                htmlFor={`${stepId}-${part.id}`}
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                <NotationText text={part.label} />
              </label>
              <input
                id={`${stepId}-${part.id}`}
                className="answer-input"
                inputMode="decimal"
                value={answers[part.id] ?? ""}
                placeholder={`e.g. ${formatPlaceholderValue(part.expected)} ${formatInputNotation(part.unit?.label ?? "")}`}
                onChange={(event) => onAnswerChange(part.id, event.target.value)}
              />
              <Feedback result={results[part.id]} />
            </div>
          ))}
        </div>
      ) : null}

      {check.mode === "choice" ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {check.choices.map((choice) => {
            const selected = answers.choice === choice.id;
            return (
              <button
                key={choice.id}
                type="button"
                className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition focus:outline-none focus:ring-4 focus:ring-teal-600/10 ${
                  selected
                    ? "border-teal-600 bg-teal-50 text-teal-950"
                    : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"
                }`}
                aria-pressed={selected}
                onClick={() => onAnswerChange("choice", choice.id)}
              >
                {choice.label}
              </button>
            );
          })}
          <div className="sm:col-span-2">
            <Feedback result={results.choice} />
          </div>
        </div>
      ) : null}

      {check.mode === "text" ? (
        <div>
          <label
            htmlFor={`${stepId}-text`}
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Your explanation
          </label>
          <textarea
            id={`${stepId}-text`}
            className="answer-input min-h-32 resize-y"
            value={answers.text ?? ""}
            placeholder="Use ΔG = ΔH − TΔS in your explanation."
            onChange={(event) => onAnswerChange("text", event.target.value)}
          />
          <Feedback result={results.text} />
          {solutionShown && check.mode === "text" ? (
            <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
              Sample answer: <NotationText text={check.sampleAnswer} />
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-950/10"
          onClick={handleCheck}
        >
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          Check answer
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-teal-600/10"
          onClick={onShowHint}
        >
          <HelpCircle className="h-4 w-4" aria-hidden="true" />
          Show hint
        </button>
        {attempts > 0 ? (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-teal-600/10"
            onClick={onShowSolution}
          >
            <Lightbulb className="h-4 w-4" aria-hidden="true" />
            Show solution
          </button>
        ) : null}
      </div>

      <AnimatePresence initial={false}>
        {hintShown ? (
          <motion.p
            className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-950"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
          >
            <NotationText text={exercise.hint} />
          </motion.p>
        ) : null}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {solutionShown ? (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            {exercise.solution.map((line) => (
              <EquationBlock key={line} latex={line} />
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
