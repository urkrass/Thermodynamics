import { evaluate } from "mathjs";
import type {
  CommonMistake,
  NumericAnswerPart,
} from "@/data/thermoLesson";

export type CheckStatus = "correct" | "close" | "incorrect";

export type CheckResult = {
  status: CheckStatus;
  message: string;
  parsedValue?: number;
};

const MATH_EXPRESSION_PATTERN = /^[\d\s+\-*/().,^eE]+$/;

export function parseNumericAnswer(rawAnswer: string): number | undefined {
  const normalized = rawAnswer
    .trim()
    .replace(/\u2212/g, "-")
    .replace(/,/g, "");

  if (!normalized) {
    return undefined;
  }

  const expressionCandidate = normalized
    .replace(/\^/g, "**")
    .replace(/×/g, "*")
    .replace(/÷/g, "/");

  if (MATH_EXPRESSION_PATTERN.test(expressionCandidate)) {
    try {
      const evaluated = evaluate(expressionCandidate);
      if (typeof evaluated === "number" && Number.isFinite(evaluated)) {
        return evaluated;
      }
    } catch {
      // Fall back to the first numeric token below.
    }
  }

  const numberToken = normalized.match(/[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/i);
  if (!numberToken) {
    return undefined;
  }

  const parsed = Number(numberToken[0]);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function approximatelyEqual(value: number, expected: number, tolerance: number) {
  return Math.abs(value - expected) <= tolerance;
}

function findCommonMistake(
  value: number,
  commonMistakes: CommonMistake[] | undefined,
) {
  return commonMistakes?.find((mistake) =>
    approximatelyEqual(value, mistake.expected, mistake.tolerance ?? 0.6),
  );
}

function unitIsPresent(rawAnswer: string, part: NumericAnswerPart) {
  if (!part.unit) {
    return true;
  }

  const normalized = rawAnswer.toLowerCase();
  return part.unit.tokens.every((token) => normalized.includes(token));
}

export function checkNumericAnswer(
  rawAnswer: string,
  part: NumericAnswerPart,
): CheckResult {
  const parsedValue = parseNumericAnswer(rawAnswer);

  if (parsedValue === undefined) {
    return {
      status: "incorrect",
      message: "Enter a numerical value, such as -45.5 kJ mol^-1.",
    };
  }

  const commonMistake = findCommonMistake(parsedValue, part.commonMistakes);
  if (commonMistake) {
    return {
      status: "incorrect",
      message: commonMistake.feedback,
      parsedValue,
    };
  }

  if (approximatelyEqual(parsedValue, part.expected, part.tolerance)) {
    if (!unitIsPresent(rawAnswer, part) && part.unit) {
      return {
        status: "close",
        message: part.unit.missingFeedback,
        parsedValue,
      };
    }

    return {
      status: "correct",
      message: part.correctFeedback,
      parsedValue,
    };
  }

  if (
    approximatelyEqual(
      parsedValue,
      part.expected,
      part.closeTolerance ?? part.tolerance * 4,
    )
  ) {
    return {
      status: "close",
      message: part.closeFeedback,
      parsedValue,
    };
  }

  if (Math.abs(parsedValue) > 1000 && Math.abs(part.expected) < 1000) {
    return {
      status: "incorrect",
      message:
        "The magnitude is very large. For Gibbs calculations, check whether entropy was left in J instead of converting to kJ.",
      parsedValue,
    };
  }

  if (approximatelyEqual(parsedValue, -part.expected, part.closeTolerance ?? 2)) {
    return {
      status: "incorrect",
      message:
        "The magnitude is close, but the sign is reversed. Recheck the subtraction order.",
      parsedValue,
    };
  }

  return {
    status: "incorrect",
    message: part.incorrectFeedback,
    parsedValue,
  };
}

export function checkChoiceAnswer(
  selectedId: string | undefined,
  expectedChoiceId: string,
  correctFeedback: string,
  incorrectFeedback: string,
): CheckResult {
  if (!selectedId) {
    return {
      status: "incorrect",
      message: "Choose one option before checking.",
    };
  }

  if (selectedId === expectedChoiceId) {
    return {
      status: "correct",
      message: correctFeedback,
    };
  }

  return {
    status: "incorrect",
    message: incorrectFeedback,
  };
}

export function checkTextAnswer(
  rawAnswer: string,
  keywords: string[],
  minMatches: number,
  correctFeedback: string,
  closeFeedback: string,
  incorrectFeedback: string,
): CheckResult {
  const normalized = rawAnswer
    .toLowerCase()
    .replace(/\u0394/g, "delta")
    .replace(/\s+/g, " ");

  if (!normalized.trim()) {
    return {
      status: "incorrect",
      message: "Write a sentence before checking.",
    };
  }

  const matches = keywords.filter((keyword) => normalized.includes(keyword));
  const hasEquationIdea =
    normalized.includes("-t") ||
    normalized.includes("tΔs".toLowerCase()) ||
    normalized.includes("t delta s") ||
    normalized.includes("tds");

  if (matches.length >= minMatches || (matches.length >= 2 && hasEquationIdea)) {
    return {
      status: "correct",
      message: correctFeedback,
    };
  }

  if (matches.length >= 2 || hasEquationIdea) {
    return {
      status: "close",
      message: closeFeedback,
    };
  }

  return {
    status: "incorrect",
    message: incorrectFeedback,
  };
}
