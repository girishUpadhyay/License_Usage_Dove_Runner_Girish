"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { useLicenses } from "@/features/licenses/hooks/useLicenses";
import { useDebounce } from "@/hooks/useDebounce";
import { patchSeatsAllowed } from "@/features/licenses/api/licenses-client";
import {
  DEFAULT_FILTERS,
  filterLicenses,
  paginate,
  sortLicenses,
  type SortDirection,
  type SortKey,
} from "@/features/licenses/utils/license-filters";
import type { LicensePlan, LicenseStatus } from "@/features/licenses/types";
import type { LicenseTableStatus } from "@/features/licenses/components/LicenseTable";

const DEFAULT_PAGE_SIZE = 10;

/**
 * All state, derived data (filter -> sort -> paginate), and event handlers
 * for the licenses page. Pulled out of the page component so that component
 * only has to wire this data to JSX, instead of mixing state management and
 * markup in one place.
 */
export function useLicensesPage() {
  // --- Filter, sort, and pagination state -----------------------------
  const [search, setSearch] = useState(DEFAULT_FILTERS.search);
  const [status, setStatus] = useState<LicenseStatus | "All">(DEFAULT_FILTERS.status);
  const [plan, setPlan] = useState<LicensePlan | "All">(DEFAULT_FILTERS.plan);
  const [sortKey, setSortKey] = useState<SortKey>("customerName");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // --- Other UI state ---------------------------------------------------
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [simulateError, setSimulateError] = useState(false);

  // Recomputing the filtered/sorted/paginated list is deferred as a
  // transition so clicking a header or dropdown stays responsive (INP) even
  // as the record count grows; typing in search is kept off the transition
  // path since useDebounce already defers the expensive work there.
  const [isPending, startTransition] = useTransition();

  const debouncedSearch = useDebounce(search, 300);
  const { licenses, error, isLoading, mutate } = useLicenses(simulateError);

  const hasActiveFilters = debouncedSearch.trim() !== "" || status !== "All" || plan !== "All";

  // --- Derived data: source licenses flow through filter -> sort -> page --
  const filtered = useMemo(
    () => (licenses ? filterLicenses(licenses, { search: debouncedSearch, status, plan }) : []),
    [licenses, debouncedSearch, status, plan]
  );

  const sorted = useMemo(
    () => sortLicenses(filtered, sortKey, sortDirection),
    [filtered, sortKey, sortDirection]
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = useMemo(() => paginate(sorted, currentPage, pageSize), [sorted, currentPage, pageSize]);

  // Not memoized: .find() on the same underlying array already returns the
  // same object reference for an unchanged id, and the scan itself is too
  // cheap (≤ a few hundred records) to be worth caching.
  const selectedLicense = licenses?.find((license) => license.id === selectedId) ?? null;

  // --- Filter & sort handlers: each resets to page 1 since the previous
  // page number may no longer be valid once the result set changes --------
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((value: LicenseStatus | "All") => {
    startTransition(() => {
      setStatus(value);
      setPage(1);
    });
  }, []);

  const handlePlanChange = useCallback((value: LicensePlan | "All") => {
    startTransition(() => {
      setPlan(value);
      setPage(1);
    });
  }, []);

  // Memoized so Pagination (memo()-wrapped) doesn't re-render on unrelated
  // state changes elsewhere on the page.
  const handlePageSizeChange = useCallback((value: number) => {
    startTransition(() => {
      setPageSize(value);
      setPage(1);
    });
  }, []);

  const handlePageChange = useCallback((nextPage: number) => {
    startTransition(() => setPage(nextPage));
  }, []);

  // Two independent setState calls rather than nesting setSortDirection
  // inside setSortKey's updater: when the clicked column is already active,
  // setSortKey's updater returns the same key it started with, and React
  // can bail out of that update — silently dropping the nested
  // setSortDirection call along with it. Reading sortKey from closure and
  // calling both setters unconditionally avoids that.
  const handleSort = useCallback(
    (key: SortKey) => {
      startTransition(() => {
        setSortDirection((prevDirection) => (sortKey === key && prevDirection === "asc" ? "desc" : "asc"));
        setSortKey(key);
      });
    },
    [sortKey]
  );

  const handleClearFilters = useCallback(() => {
    startTransition(() => {
      setSearch(DEFAULT_FILTERS.search);
      setStatus(DEFAULT_FILTERS.status);
      setPlan(DEFAULT_FILTERS.plan);
      setPage(1);
    });
  }, []);

  // --- Detail drawer handlers --------------------------------------------
  const handleRowSelect = useCallback((id: string) => setSelectedId(id), []);
  const handleCloseDetail = useCallback(() => setSelectedId(null), []);

  const handleRetry = useCallback(() => {
    mutate();
  }, [mutate]);

  const handleSaveSeats = useCallback(
    async (id: string, seatsAllowed: number) => {
      const updated = await patchSeatsAllowed(id, seatsAllowed);
      await mutate(
        (current) => current?.map((license) => (license.id === id ? updated : license)),
        { revalidate: false }
      );
    },
    [mutate]
  );

  // Memoized so LicenseDetailDrawer (memo()-wrapped) doesn't re-render on
  // unrelated state changes while it's open — chained off handleSaveSeats,
  // which must also stay stable for that to hold.
  const handleSaveSelectedSeats = useCallback(
    (seatsAllowed: number) => {
      // The detail panel only renders while selectedLicense is set, so this
      // guard just satisfies the type checker rather than a real runtime case.
      if (!selectedLicense) return Promise.resolve();
      return handleSaveSeats(selectedLicense.id, seatsAllowed);
    },
    [selectedLicense, handleSaveSeats]
  );

  // Memoized because LicenseTable (and every virtualized row beneath it) is
  // wrapped in memo() — an object literal rebuilt on every render here would
  // look "changed" on every comparison and silently defeat that memoization,
  // even when nothing the table actually cares about changed.
  const tableStatus: LicenseTableStatus = useMemo(() => {
    if (error) return { kind: "error", message: error.message, onRetry: handleRetry };
    if (isLoading) return { kind: "loading" };
    if (sorted.length === 0) return { kind: "empty", hasActiveFilters, onClearFilters: handleClearFilters };
    return { kind: "ready", licenses: pageItems };
  }, [error, isLoading, sorted.length, hasActiveFilters, handleClearFilters, handleRetry, pageItems]);

  return {
    licenses,
    isLoading,
    isPending,
    search,
    status,
    plan,
    sortKey,
    sortDirection,
    currentPage,
    totalPages,
    pageSize,
    resultCount: sorted.length,
    hasActiveFilters,
    simulateError,
    selectedLicense,
    tableStatus,
    onSearchChange: handleSearchChange,
    onStatusChange: handleStatusChange,
    onPlanChange: handlePlanChange,
    onPageSizeChange: handlePageSizeChange,
    onPageChange: handlePageChange,
    onSort: handleSort,
    onClearFilters: handleClearFilters,
    onRowSelect: handleRowSelect,
    onCloseDetail: handleCloseDetail,
    onSaveSelectedSeats: handleSaveSelectedSeats,
    onSimulateErrorChange: setSimulateError,
  };
}
