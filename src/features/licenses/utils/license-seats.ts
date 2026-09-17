import type { SemanticTone } from "@/theme/muiTheme";

interface SeatsUtilization {
  percent: number;
  tone: SemanticTone;
}

export function getSeatsUtilization(seatsUsed: number, seatsAllowed: number): SeatsUtilization {
  const percent = seatsAllowed === 0 ? 0 : Math.min(100, Math.round((seatsUsed / seatsAllowed) * 100));
  const tone: SemanticTone = percent >= 90 ? "danger" : percent >= 70 ? "caution" : "positive";
  return { percent, tone };
}
