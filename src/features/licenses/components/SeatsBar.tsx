import { memo } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { useTheme } from "@mui/material/styles";
import { getSeatsUtilization } from "@/features/licenses/utils/license-seats";

interface SeatsBarProps {
  seatsUsed: number;
  seatsAllowed: number;
}

function SeatsBarImpl({ seatsUsed, seatsAllowed }: SeatsBarProps) {
  const theme = useTheme();
  const { percent, tone } = getSeatsUtilization(seatsUsed, seatsAllowed);

  return (
    <LinearProgress
      variant="determinate"
      value={percent}
      aria-label="Seats used"
      sx={{
        mt: 0.75,
        maxWidth: 96,
        height: 6,
        borderRadius: 3,
        bgcolor: "action.hover",
        "& .MuiLinearProgress-bar": { bgcolor: theme.palette.tone[tone].main, borderRadius: 3 },
      }}
    />
  );
}

export const SeatsBar = memo(SeatsBarImpl);
