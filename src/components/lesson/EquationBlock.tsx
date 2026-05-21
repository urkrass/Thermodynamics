"use client";

import { useMemo } from "react";
import katex from "katex";

type EquationBlockProps = {
  latex: string;
  caption?: string;
  display?: boolean;
  className?: string;
};

export function EquationBlock({
  latex,
  caption,
  display = true,
  className = "",
}: EquationBlockProps) {
  const html = useMemo(
    () =>
      katex.renderToString(latex, {
        displayMode: display,
        throwOnError: false,
        strict: "ignore",
      }),
    [display, latex],
  );

  return (
    <figure className={className}>
      <div
        className={
          display
            ? "equation-scroll quiet-scrollbar rounded-2xl bg-slate-50/80 px-4 py-4 text-slate-950"
            : "equation-inline inline"
        }
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {caption ? (
        <figcaption className="mt-2 text-sm text-slate-500">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
