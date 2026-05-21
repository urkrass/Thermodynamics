# Thermodynamics Worksheet

A Typeform-style chemistry lesson for thermodynamics calculations. It covers formation enthalpy, average bond enthalpy, entropy, Gibbs free energy, mixed practice, and a progress summary.

## Run Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Quality Checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Deploy on Vercel

1. Import this GitHub repository into Vercel.
2. Keep the detected framework as Next.js.
3. Use the default install command, build command, and output settings:
   - Install: `npm install`
   - Build: `npm run build`
4. Deploy.

No backend, database, or login is required. Student progress is stored in browser `localStorage` under the versioned key `thermo-worksheet-v1`.

## Main Files

- `src/app/page.tsx` renders the single-page lesson.
- `src/components/lesson/LessonShell.tsx` owns navigation, progress, keyboard controls, and persistence wiring.
- `src/components/lesson/StepRenderer.tsx` renders each lesson step from data.
- `src/components/lesson/ExerciseInput.tsx` handles numerical, choice, and short-answer exercises.
- `src/components/lesson/ExampleReveal.tsx` reveals solved examples step by step.
- `src/components/lesson/ScientificVisual.tsx` contains subtle SVG animations that respect reduced motion.
- `src/data/thermoLesson.ts` contains the structured lesson content.
- `src/lib/checkAnswer.ts` contains reusable answer checking and common-mistake detection.
- `src/lib/useLessonSession.ts` stores progress and answers in `localStorage`.

## Edit Lesson Content

Most content lives in `src/data/thermoLesson.ts`. Add or edit steps there using the existing shape:

- `id`
- `section`
- `title`
- `type`
- `body`
- `equations`
- `visualType`
- `example`
- `exercise`

For numerical exercises, add expected answers, tolerances, unit requirements, and common-mistake values in the `check.answerParts` array.
