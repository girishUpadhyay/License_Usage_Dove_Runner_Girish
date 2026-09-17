"use client";

import { memo } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import ScienceIcon from "@mui/icons-material/Science";
import { LICENSE_PLANS, LICENSE_STATUSES, type LicensePlan, type LicenseStatus } from "@/features/licenses/types";

interface LicenseFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: LicenseStatus | "All";
  onStatusChange: (value: LicenseStatus | "All") => void;
  plan: LicensePlan | "All";
  onPlanChange: (value: LicensePlan | "All") => void;
  resultCount: number;
  totalCount: number;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  simulateError: boolean;
  onSimulateErrorChange: (value: boolean) => void;
}

interface FilterSelectProps<T extends string> {
  id: string;
  label: string;
  value: T | "All";
  options: readonly T[];
  allLabel: string;
  onChange: (value: T | "All") => void;
}

function FilterSelect<T extends string>({ id, label, value, options, allLabel, onChange }: FilterSelectProps<T>) {
  const labelId = `${id}-label`;
  return (
    <FormControl size="small" sx={{ width: { xs: "100%", sm: 160 } }}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        id={id}
        label={label}
        value={value}
        onChange={(event) => onChange(event.target.value as T | "All")}
      >
        <MenuItem value="All">{allLabel}</MenuItem>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function LicenseFiltersImpl({
  search,
  onSearchChange,
  status,
  onStatusChange,
  plan,
  onPlanChange,
  resultCount,
  totalCount,
  onClearFilters,
  hasActiveFilters,
  simulateError,
  onSimulateErrorChange,
}: LicenseFiltersProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, borderBottom: 1, borderColor: "divider", pb: 2 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: 1.5 }}>
        <TextField
          id="license-search"
          label="Search customer"
          size="small"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by customer name…"
          sx={{ width: { xs: "100%", sm: 256 } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: "text.disabled" }} />
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position="end">
                  <IconButton size="small" aria-label="Clear search" onClick={() => onSearchChange("")}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            },
          }}
        />

        <FilterSelect
          id="license-status"
          label="Status"
          value={status}
          options={LICENSE_STATUSES}
          allLabel="All statuses"
          onChange={onStatusChange}
        />

        <FilterSelect
          id="license-plan"
          label="Plan"
          value={plan}
          options={LICENSE_PLANS}
          allLabel="All plans"
          onChange={onPlanChange}
        />

        {hasActiveFilters && (
          <Button onClick={onClearFilters} size="medium">
            Clear filters
          </Button>
        )}

        <FormControlLabel
          sx={{
            ml: { xs: 0, sm: "auto" },
            borderRadius: 5,
            border: "1px dashed",
            borderColor: "warning.light",
            bgcolor: (theme) => alpha(theme.palette.warning.main, theme.palette.mode === "dark" ? 0.24 : 0.08),
            px: 1,
            py: 0.25,
          }}
          title="Development affordance: forces the license list to return an error, to demo the error state."
          control={
            <Checkbox
              size="small"
              color="warning"
              checked={simulateError}
              onChange={(event) => onSimulateErrorChange(event.target.checked)}
            />
          }
          label={
            <Typography
              variant="caption"
              sx={{ fontWeight: 500, display: "flex", alignItems: "center", gap: 0.5 }}
              color="warning.main"
            >
              <ScienceIcon fontSize="inherit" aria-hidden="true" />
              Simulate error
            </Typography>
          }
        />
      </Box>

      <Typography role="status" aria-live="polite" variant="body2" color="text.secondary">
        Showing{" "}
        <Typography component="span" variant="body2" sx={{ fontWeight: 500 }} color="text.primary">
          {resultCount}
        </Typography>{" "}
        of {totalCount} license{totalCount === 1 ? "" : "s"}
      </Typography>
    </Box>
  );
}

export const LicenseFilters = memo(LicenseFiltersImpl);
