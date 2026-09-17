"use client";

import useSWR from "swr";
import { fetchLicenses } from "@/features/licenses/api/licenses-client";

export function useLicenses(simulateError: boolean) {
  const { data, error, isLoading, mutate } = useSWR(["licenses", simulateError], () =>
    fetchLicenses(simulateError)
  );

  return { licenses: data, error, isLoading, mutate };
}
