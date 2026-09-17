"use client";

import { memo } from "react";
import Box from "@mui/material/Box";
import MuiPagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

function PaginationImpl({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const rangeStart = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalItems);

  return (
    <Box
      component="nav"
      aria-label="License table pagination"
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1.5,
        borderTop: 1,
        borderColor: "divider",
        px: 0.5,
        py: 1.5,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontVariantNumeric: "tabular-nums" }}>
          {rangeStart}–{rangeEnd} of {totalItems}
        </Typography>

        <FormControl size="small" variant="outlined">
          <InputLabel id="page-size-label">Rows per page</InputLabel>
          <Select
            labelId="page-size-label"
            label="Rows per page"
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <MuiPagination
        page={page}
        count={totalPages}
        onChange={(_event, nextPage) => onPageChange(nextPage)}
        color="primary"
        shape="rounded"
      />
    </Box>
  );
}

// Keeps this from re-rendering on unrelated parent state changes (e.g. every
// keystroke in search) as long as its own props — including the caller's
// memoized onPageChange/onPageSizeChange — stay referentially stable.
export const Pagination = memo(PaginationImpl);
