"use client";

import { memo } from "react";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import type { LicenseRecord } from "@/features/licenses/types";
import type { SortDirection, SortKey } from "@/features/licenses/utils/license-filters";
import { LicenseTableRow } from "./LicenseTableRow";
import { TableStatusMessage } from "./TableStatusMessage";

/** Column order as rendered in the header. */
const LICENSE_TABLE_COLUMNS: { key: SortKey; label: string }[] = [
  { key: "customerName", label: "Customer" },
  { key: "plan", label: "Plan" },
  { key: "status", label: "Status" },
  { key: "seats", label: "Seats used / allowed" },
  { key: "renewalDate", label: "Renewal date" },
];

/**
 * Discriminated union so the table can render the right body content while
 * keeping the header mounted throughout (avoids layout shift when swapping
 * between loading / error / empty / ready).
 */
export type LicenseTableStatus =
  | { kind: "loading" }
  | { kind: "error"; message: string; onRetry: () => void }
  | { kind: "empty"; hasActiveFilters: boolean; onClearFilters: () => void }
  | { kind: "ready"; licenses: LicenseRecord[] };

interface LicenseTableProps {
  status: LicenseTableStatus;
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSort: (key: SortKey) => void;
  onRowSelect: (id: string) => void;
}

const SKELETON_ROW_COUNT = 8;

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: SKELETON_ROW_COUNT }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          <TableCell>
            <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
              <Skeleton variant="circular" width={28} height={28} />
              <Skeleton variant="text" width="70%" />
            </Stack>
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width="70%" />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width="70%" />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="text" width={96} height={12} sx={{ mt: 0.5 }} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width="70%" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

function LicenseTableImpl({ status, sortKey, sortDirection, onSort, onRowSelect }: LicenseTableProps) {
  const licenses = status.kind === "ready" ? status.licenses : [];

  return (
    <TableContainer>
      <Table stickyHeader aria-rowcount={status.kind === "ready" ? licenses.length + 1 : undefined}>
        <TableHead>
          <TableRow>
            {LICENSE_TABLE_COLUMNS.map((column) => (
              <TableCell key={column.key} sortDirection={column.key === sortKey ? sortDirection : false}>
                <TableSortLabel
                  active={column.key === sortKey}
                  direction={column.key === sortKey ? sortDirection : "asc"}
                  onClick={() => onSort(column.key)}
                >
                  {column.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {status.kind === "loading" && <SkeletonRows />}

          {(status.kind === "error" || status.kind === "empty") && (
            <TableRow>
              <TableCell colSpan={LICENSE_TABLE_COLUMNS.length} sx={{ p: 0, border: 0 }}>
                <TableStatusMessage {...status} />
              </TableCell>
            </TableRow>
          )}

          {status.kind === "ready" &&
            licenses.map((license) => (
              <LicenseTableRow key={license.id} license={license} onSelect={onRowSelect} />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export const LicenseTable = memo(LicenseTableImpl);
