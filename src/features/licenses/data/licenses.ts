import { LICENSE_PLANS, type LicensePlan, type LicenseRecord, type LicenseStatus } from "@/features/licenses/types";

/** Small deterministic PRNG so fixture data is stable across server restarts and tests. */
function createSeededRandom(seed: number) {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return function next() {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

const COMPANY_PREFIXES = [
  "Acme",
  "Globex",
  "Initech",
  "Umbrella",
  "Stark",
  "Wayne",
  "Wonka",
  "Hooli",
  "Cyberdyne",
  "Soylent",
  "Aperture",
  "Massive Dynamic",
  "Black Mesa",
  "Tyrell",
  "Oscorp",
  "Vandelay",
  "Pied Piper",
  "Dunder Mifflin",
  "Gringotts",
  "Prestige",
  "Northwind",
  "Contoso",
  "Fabrikam",
  "Zenith",
  "Quantum",
  "Nimbus",
  "Vertex",
  "Meridian",
  "Ironclad",
  "Lumen",
];

const COMPANY_SUFFIXES = [
  "Industries",
  "Solutions",
  "Technologies",
  "Systems",
  "Labs",
  "Group",
  "Holdings",
  "Partners",
  "Networks",
  "Dynamics",
  "Analytics",
  "Robotics",
];

const OWNER_FIRST_NAMES = [
  "Alex",
  "Jordan",
  "Taylor",
  "Morgan",
  "Casey",
  "Riley",
  "Priya",
  "Wei",
  "Fatima",
  "Diego",
  "Sofia",
  "Noah",
  "Amara",
  "Liam",
  "Yuki",
];

const OWNER_LAST_NAMES = [
  "Kim",
  "Patel",
  "Garcia",
  "Nguyen",
  "Smith",
  "Johansson",
  "Cohen",
  "Okafor",
  "Rossi",
  "Larsen",
  "Silva",
  "Tanaka",
];

const NOTE_SAMPLES = [
  "Champion contact is engaged; upsell candidate for Enterprise.",
  "Flagged for churn risk after seat usage dropped last quarter.",
  "Requested SSO enablement, pending security review.",
  "Renewed early with a multi-year commitment.",
  "Support escalation resolved; account healthy.",
  "Trial converted after onboarding call.",
  "",
  "",
];

const DAY_MS = 24 * 60 * 60 * 1000;

function pick<T>(items: T[], random: () => number): T {
  return items[Math.floor(random() * items.length)];
}

function randomInt(min: number, max: number, random: () => number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function seatsRangeForPlan(plan: LicensePlan): [number, number] {
  switch (plan) {
    case "Trial":
      return [1, 10];
    case "Standard":
      return [10, 100];
    case "Enterprise":
      return [50, 500];
  }
}

function statusWeighted(random: () => number): LicenseStatus {
  const roll = random();
  if (roll < 0.5) return "Active";
  if (roll < 0.7) return "Expiring Soon";
  if (roll < 0.85) return "Expired";
  return "Suspended";
}

function renewalDateForStatus(status: LicenseStatus, now: number, random: () => number): Date {
  switch (status) {
    case "Active":
      return new Date(now + randomInt(31, 365, random) * DAY_MS);
    case "Expiring Soon":
      return new Date(now + randomInt(1, 30, random) * DAY_MS);
    case "Expired":
      return new Date(now - randomInt(1, 180, random) * DAY_MS);
    case "Suspended":
      return new Date(now + randomInt(-120, 120, random) * DAY_MS);
  }
}

export function generateLicenses(count = 80, seed = 42): LicenseRecord[] {
  const random = createSeededRandom(seed);
  const now = Date.now();
  const usedNames = new Set<string>();

  const records: LicenseRecord[] = [];

  for (let i = 0; i < count; i++) {
    let customerName = `${pick(COMPANY_PREFIXES, random)} ${pick(COMPANY_SUFFIXES, random)}`;
    while (usedNames.has(customerName)) {
      customerName = `${pick(COMPANY_PREFIXES, random)} ${pick(COMPANY_SUFFIXES, random)} ${randomInt(2, 9, random)}`;
    }
    usedNames.add(customerName);

    const plan = pick(LICENSE_PLANS, random);
    const status = statusWeighted(random);

    const [minSeats, maxSeats] = seatsRangeForPlan(plan);
    const seatsAllowed = randomInt(minSeats, maxSeats, random);
    const usageRatio = status === "Suspended" ? random() * 0.4 : random();
    const seatsUsed = Math.min(seatsAllowed, Math.round(seatsAllowed * usageRatio));

    const renewalDate = renewalDateForStatus(status, now, random);
    const createdDate = new Date(renewalDate.getTime() - randomInt(180, 900, random) * DAY_MS);

    const ownerFirst = pick(OWNER_FIRST_NAMES, random);
    const ownerLast = pick(OWNER_LAST_NAMES, random);
    const domain = `${slugify(customerName)}.com`;
    const accountOwnerEmail = `${slugify(ownerFirst)}.${slugify(ownerLast)}@${domain}`;

    records.push({
      id: `lic_${String(i + 1).padStart(3, "0")}`,
      customerName,
      plan,
      status,
      seatsUsed,
      seatsAllowed,
      renewalDate: renewalDate.toISOString(),
      accountOwnerEmail,
      createdDate: createdDate.toISOString(),
      notes: pick(NOTE_SAMPLES, random),
    });
  }

  return records;
}
