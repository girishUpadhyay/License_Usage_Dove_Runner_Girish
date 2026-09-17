"use client";

import { Fragment, memo, useId, type ReactNode } from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import LayersIcon from "@mui/icons-material/Layers";
import MailOutlineIcon from "@mui/icons-material/MailOutlined";
import NotesIcon from "@mui/icons-material/Notes";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import type { LicenseRecord } from "@/features/licenses/types";
import { formatDate, formatRelativeDays } from "@/features/licenses/utils/format";
import { getAvatarColor } from "@/features/licenses/utils/avatar-color";
import { isRenewalUrgent } from "@/features/licenses/utils/license-status";
import { LicenseStatusBadge } from "./LicenseStatusBadge";
import { SeatsBar } from "./SeatsBar";
import { EditSeatsForm } from "./EditSeatsForm";

interface LicenseDetailDrawerProps {
  license: LicenseRecord;
  onClose: () => void;
  onSaveSeats: (seatsAllowed: number) => Promise<void>;
}

function DetailField({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <Fragment>
      <Stack component="dt" direction="row" spacing={0.75} sx={{ alignItems: "center", color: "text.secondary" }}>
        <Box aria-hidden="true" sx={{ display: "flex", color: "text.disabled" }}>
          {icon}
        </Box>
        <Typography variant="caption" sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
      </Stack>
      <Box component="dd" sx={{ m: 0, mb: 1.5, typography: "body2" }}>
        {children}
      </Box>
    </Fragment>
  );
}

function LicenseDetailDrawerImpl({ license, onClose, onSaveSeats }: LicenseDetailDrawerProps) {
  const headingId = useId();

  return (
    <Drawer
      anchor="right"
      open
      onClose={onClose}
      slotProps={{
        // MUI's Drawer already applies role="dialog" + aria-modal to the
        // paper element, but the accessible name still needs pointing at
        // the customer-name heading so screen readers announce which
        // license this drawer is for — aria-labelledby has to go on the
        // paper itself, not the Drawer root, to reach that element.
        paper: { sx: { width: "100%", maxWidth: 420, p: 3 }, "aria-labelledby": headingId },
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ mb: 3, alignItems: "flex-start", justifyContent: "space-between" }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Avatar
            aria-hidden="true"
            sx={{ width: 44, height: 44, fontSize: 18, fontWeight: 600, bgcolor: getAvatarColor(license.customerName) }}
          >
            {license.customerName.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography id={headingId} variant="h6" sx={{ fontWeight: 600 }}>
              {license.customerName}
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <LicenseStatusBadge status={license.status} />
            </Box>
          </Box>
        </Stack>
        <IconButton aria-label="Close details" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Box component="dl" sx={{ m: 0 }}>
        <DetailField icon={<LayersIcon fontSize="small" />} label="Plan">
          {license.plan}
        </DetailField>

        <DetailField icon={<PeopleAltIcon fontSize="small" />} label="Seats used / allowed">
          <Typography component="span" variant="body2" sx={{ fontVariantNumeric: "tabular-nums" }}>
            {license.seatsUsed} / {license.seatsAllowed}
          </Typography>
          <SeatsBar seatsUsed={license.seatsUsed} seatsAllowed={license.seatsAllowed} />
        </DetailField>

        <DetailField icon={<CalendarMonthIcon fontSize="small" />} label="Renewal date">
          {formatDate(license.renewalDate)}
          {isRenewalUrgent(license.status) && (
            <Typography component="span" variant="caption" color="text.disabled" sx={{ ml: 0.75 }}>
              ({formatRelativeDays(license.renewalDate)})
            </Typography>
          )}
        </DetailField>

        <DetailField icon={<EventAvailableIcon fontSize="small" />} label="Created">
          {formatDate(license.createdDate)}
        </DetailField>

        <DetailField icon={<MailOutlineIcon fontSize="small" />} label="Account owner">
          <Link href={`mailto:${license.accountOwnerEmail}`} underline="hover">
            {license.accountOwnerEmail}
          </Link>
        </DetailField>

        <DetailField icon={<NotesIcon fontSize="small" />} label="Notes">
          <Typography variant="body2" sx={{ fontStyle: license.notes ? "normal" : "italic", color: license.notes ? "text.primary" : "text.disabled" }}>
            {license.notes || "No notes on file."}
          </Typography>
        </DetailField>
      </Box>

      <Divider sx={{ my: 3 }} />

      <EditSeatsForm license={license} onSave={onSaveSeats} />
    </Drawer>
  );
}

// Memoized so this modal doesn't re-render on unrelated parent state changes
// — relies on the caller passing stable license/onClose/onSaveSeats references.
export const LicenseDetailDrawer = memo(LicenseDetailDrawerImpl);
