import { memo } from "react";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import type { LicenseStatus } from "@/features/licenses/types";
import { LICENSE_STATUS_TONE } from "@/features/licenses/utils/license-status";

function LicenseStatusBadgeImpl({ status }: { status: LicenseStatus }) {
  const theme = useTheme();
  const tone = theme.palette.tone[LICENSE_STATUS_TONE[status]];

  return (
    <Chip
      size="small"
      label={status}
      icon={
        <Box
          component="span"
          aria-hidden="true"
          sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: tone.main, ml: "8px !important" }}
        />
      }
      sx={{
        bgcolor: tone.light,
        color: tone.dark,
        fontWeight: 500,
        "& .MuiChip-icon": { color: tone.main },
      }}
    />
  );
}

export const LicenseStatusBadge = memo(LicenseStatusBadgeImpl);
