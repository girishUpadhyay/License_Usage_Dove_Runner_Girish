const AVATAR_PALETTE = [
  "#6366f1",
  "#8b5cf6",
  "#f43f5e",
  "#f59e0b",
  "#14b8a6",
  "#0ea5e9",
  "#d946ef",
  "#65a30d",
];

export function getAvatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    // Kept within [-(length-1), length-1] by the modulo every iteration.
    hash = (hash * 31 + seed.charCodeAt(i)) % AVATAR_PALETTE.length;
  }
  return AVATAR_PALETTE[Math.abs(hash)];
}
