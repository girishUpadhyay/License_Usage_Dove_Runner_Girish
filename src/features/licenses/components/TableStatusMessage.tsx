import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import type { LicenseTableStatus } from "./LicenseTable";

type TableStatusMessageProps = Extract<LicenseTableStatus, { kind: "error" | "empty" }>;


export function TableStatusMessage(props: TableStatusMessageProps) {
  return (
    <Box sx={{ py: 6, px: 2 }}>
      {props.kind === "error" ? (
        <Alert
          severity="error"
          action={
            <Button color="error" size="small" onClick={props.onRetry}>
              Retry
            </Button>
          }
        >
          <AlertTitle>Couldn&apos;t load licenses</AlertTitle>
          {props.message}
        </Alert>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, textAlign: "center" }}>
          <SearchOffIcon sx={{ fontSize: 32, color: "text.disabled" }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            No licenses found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
            {props.hasActiveFilters
              ? "No records match your search and filters."
              : "There are no license records to display."}
          </Typography>
          {props.hasActiveFilters && (
            <Button variant="outlined" size="small" onClick={props.onClearFilters} sx={{ mt: 1 }}>
              Clear filters
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}
