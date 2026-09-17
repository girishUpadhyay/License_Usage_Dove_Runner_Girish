"use client";

import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LayersIcon from "@mui/icons-material/Layers";
import { useLicensesPage } from "@/features/licenses/hooks/useLicensesPage";
import { LicenseFilters } from "./LicenseFilters";
import { LicenseTable } from "./LicenseTable";
import { Pagination } from "./Pagination";

// The detail panel is only needed after a user clicks a row, so it's split
// into its own chunk instead of shipping in the initial bundle. `ssr: false`
// is appropriate here — it's a client-only overlay (focus trap, key
// listeners) that should never appear in the pre-interactive HTML anyway.
const LicenseDetailDrawer = dynamic(
  () => import("./LicenseDetailDrawer").then((mod) => mod.LicenseDetailDrawer),
  { ssr: false }
);

export function LicensesPageClient() {
  const page = useLicensesPage();

  return (
    <Box
      component="main"
      sx={{
        mx: "auto",
        maxWidth: 1280,
        flex: 1,
        // Both are required: minWidth: 0 removes the flex item's default
        // content-driven width floor, and width: "100%" is what actually
        // clamps it to the parent's cross-axis size in a column flex
        // container — without it, main still sizes to its widest child
        // (the table) instead of the viewport, so TableContainer never
        // gets a chance to scope the horizontal scroll to just itself.
        minWidth: 0,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 3,
        p: { xs: 3, sm: 4 },
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }} component="header">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: "primary.main",
            color: "primary.contrastText",
          }}
        >
          <LayersIcon fontSize="small" aria-hidden="true" />
        </Box>
        <Box>
          <Typography component="h1" variant="h5" sx={{ fontWeight: 600 }}>
            License Usage
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Customer account license records — search, filter, sort, and manage seat allocations.
          </Typography>
        </Box>
      </Stack>

      {/*
        minWidth: 0 is required here: as a flex item in main's column flow,
        Paper would otherwise grow to fit the table's natural width (wider
        than a phone screen) instead of clamping to main's width — which is
        what lets TableContainer's own overflow-x:auto scope the horizontal
        scroll to just the table instead of the whole page.
      */}
      <Paper variant="outlined" sx={{ minWidth: 0 }}>
        <Box sx={{ px: 2, pt: 2 }}>
          <LicenseFilters
            search={page.search}
            onSearchChange={page.onSearchChange}
            status={page.status}
            onStatusChange={page.onStatusChange}
            plan={page.plan}
            onPlanChange={page.onPlanChange}
            resultCount={page.resultCount}
            totalCount={page.licenses?.length ?? 0}
            onClearFilters={page.onClearFilters}
            hasActiveFilters={page.hasActiveFilters}
            simulateError={page.simulateError}
            onSimulateErrorChange={page.onSimulateErrorChange}
          />
        </Box>

        <Box aria-busy={page.isPending} sx={{ opacity: page.isPending ? 0.6 : 1, transition: "opacity 0.15s" }}>
          <LicenseTable
            status={page.tableStatus}
            sortKey={page.sortKey}
            sortDirection={page.sortDirection}
            onSort={page.onSort}
            onRowSelect={page.onRowSelect}
          />
        </Box>

        {page.tableStatus.kind === "ready" && (
          <Box sx={{ px: 2 }}>
            <Pagination
              page={page.currentPage}
              totalPages={page.totalPages}
              totalItems={page.resultCount}
              pageSize={page.pageSize}
              onPageChange={page.onPageChange}
              onPageSizeChange={page.onPageSizeChange}
            />
          </Box>
        )}
      </Paper>

      {page.selectedLicense && (
        <LicenseDetailDrawer
          license={page.selectedLicense}
          onClose={page.onCloseDetail}
          onSaveSeats={page.onSaveSelectedSeats}
        />
      )}
    </Box>
  );
}
