/**
 * Shared by the client-side edit form and the route handler so both enforce
 * the same rule set instead of drifting apart.
 */
export function validateSeatsAllowed(seatsAllowed: number, seatsUsed: number): string | null {
  if (Number.isNaN(seatsAllowed)) {
    return "Enter a number.";
  }
  if (!Number.isInteger(seatsAllowed)) {
    return "Seats allowed must be a whole number.";
  }
  if (seatsAllowed < 0) {
    return "Seats allowed cannot be negative.";
  }
  if (seatsAllowed < seatsUsed) {
    return `Seats allowed cannot be less than seats used (${seatsUsed}).`;
  }
  return null;
}
