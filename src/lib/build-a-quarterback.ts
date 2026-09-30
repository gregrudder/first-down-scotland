import {
  TRAIT_IDS,
  TRAITS,
  quarterbacks,
  type Quarterback,
  type TraitId,
  type TraitRatings,
} from "@/data/build-a-quarterback";

export const SALARY_CAP = 64;
export const BOARD_SIZE = 4;
export const SPINS_PER_SLOT = 1;
export const MIN_TRAIT_COST = 3;

export type ArchetypeId =
  | "gunslinger"
  | "dual-threat"
  | "game-manager"
  | "pocket-surgeon"
  | "closer"
  | "field-general"
  | "ironman"
  | "improviser";

export type VerdictBand = "high" | "mid" | "low";

const WEIGHTS: Record<TraitId, number> = {
  arm: 1,
  accuracy: 1.2,
  pocket: 1.1,
  mobility: 0.85,
  iq: 1.15,
  clutch: 1.1,
  durability: 0.75,
  leadership: 0.85,
};

const VERDICTS: Record<ArchetypeId, Record<VerdictBand, string>> = {
  gunslinger: {
    high: "He will throw it into a tight window and expect the hands to be there. The pub will call it brave. Keep the receipts.",
    mid: "Plenty of arm, and just enough restraint to stay invited back. The group chat will still clip the risky one.",
    low: "The ball comes out hot and the plan is mostly trust. Entertaining on a Thursday. Stressful when you have work in the morning.",
  },
  "dual-threat": {
    high: "Defences have to bring a packed lunch. He can beat you with his feet, then throw the one you forgot to cover.",
    mid: "A proper problem in space. Not a highlight every snap, but the spy linebacker earns his money.",
    low: "He will leave the pocket because the pocket was a suggestion. Fun to watch. Your offensive line may write a letter.",
  },
  "game-manager": {
    high: "No fireworks, and that is the point. The chains move, the clock behaves, and you are still in it in the fourth.",
    mid: "He will not lead the telly adverts. He will get you to the last series with the ball, which is the job.",
    low: "Safe hands, short menu. You will win the boring ones and hear about it in the group chat anyway.",
  },
  "pocket-surgeon": {
    high: "The ball arrives before the defender has finished his thought. People will say it looks easy. It is not.",
    mid: "Timing, feet, and a throw that hits the chest. The highlights package may shrug. The drive chart will not.",
    low: "He lives in the pocket and asks the receivers to be exactly where they were told. When they are, it sings.",
  },
  closer: {
    high: "Two minutes, one timeout, the room gone quiet. This is who you wanted when the kick-off was 1am and you stayed up.",
    mid: "Not always pretty for three quarters. Annoying for the other lot when it matters.",
    low: "He fancies the last drive more than the first three quarters. You will age, and then you might celebrate.",
  },
  "field-general": {
    high: "The huddle looks at him and the defence looks worried. Less a highlight, more a plan that survives contact.",
    mid: "He runs the offence like a person who has read the sheet. Teammates play calmer. That counts.",
    low: "Leadership on the card, and enough everywhere else to keep the sideline with him. The speech is better than the deep ball.",
  },
  ironman: {
    high: "December, week 17, same name on the call sheet. You built availability into the job, and the table will respect it.",
    mid: "He is there in the cold weeks, which is when a lot of dream quarterbacks are on the telly in a coat.",
    low: "The body is the selling point. The rest is honest work. You will not be rewriting history. You will be kicking off.",
  },
  improviser: {
    high: "The play you drew is a suggestion. The play he makes is the one they show again on Monday, usually with the sound up.",
    mid: "The pocket moves with him. Structure first, then an escape when the picture goes muddy.",
    low: "Backyard rules, NFL helmet. Some Sundays it is art. Some Sundays the coach watches through his fingers.",
  },
};

export const ARCHETYPES: Record<ArchetypeId, { label: string }> = {
  gunslinger: { label: "Gunslinger" },
  "dual-threat": { label: "Dual-threat" },
  "game-manager": { label: "Game manager" },
  "pocket-surgeon": { label: "Pocket surgeon" },
  closer: { label: "Closer" },
  "field-general": { label: "Field general" },
  ironman: { label: "Ironman" },
  improviser: { label: "Improviser" },
};

export function traitCost(rating: number): number {
  if (rating >= 97) return 14;
  if (rating >= 94) return 11;
  if (rating >= 91) return 9;
  if (rating >= 88) return 7;
  if (rating >= 84) return 5;
  if (rating >= 80) return 4;
  return MIN_TRAIT_COST;
}

export function maxAffordableCost(capRemaining: number, slotsLeft: number): number {
  const future = Math.max(0, slotsLeft - 1);
  return capRemaining - MIN_TRAIT_COST * future;
}

type FlowEdge = { to: number; rev: number; cap: number; cost: number };

function addFlowEdge(graph: FlowEdge[][], from: number, to: number, cap: number, cost: number) {
  const forward: FlowEdge = { to, rev: graph[to]?.length ?? 0, cap, cost };
  const back: FlowEdge = { to: from, rev: graph[from]?.length ?? 0, cap: 0, cost: -cost };
  graph[from]?.push(forward);
  graph[to]?.push(back);
}

/**
 * Cheapest way to fill each trait with a different quarterback.
 * Returns the spend and the quarterback ids used in one optimal filling.
 */
export function minimumAssignment(
  usedIds: ReadonlySet<string>,
  traits: readonly TraitId[],
  pool: readonly Quarterback[] = quarterbacks,
): { spend: number; quarterbackIds: string[] } {
  if (traits.length === 0) return { spend: 0, quarterbackIds: [] };
  const available = pool.filter((qb) => !usedIds.has(qb.id));
  if (available.length < traits.length) return { spend: Number.POSITIVE_INFINITY, quarterbackIds: [] };

  const traitCount = traits.length;
  const qbCount = available.length;
  const source = 0;
  const traitNode = (index: number) => index + 1;
  const qbNode = (index: number) => traitCount + 1 + index;
  const sink = traitCount + qbCount + 1;
  const nodeCount = sink + 1;
  const graph: FlowEdge[][] = Array.from({ length: nodeCount }, () => []);

  for (let index = 0; index < traitCount; index += 1) addFlowEdge(graph, source, traitNode(index), 1, 0);
  for (let index = 0; index < qbCount; index += 1) addFlowEdge(graph, qbNode(index), sink, 1, 0);
  for (let traitIndex = 0; traitIndex < traitCount; traitIndex += 1) {
    const trait = traits[traitIndex];
    if (!trait) continue;
    for (let qbIndex = 0; qbIndex < qbCount; qbIndex += 1) {
      const qb = available[qbIndex];
      if (!qb) continue;
      addFlowEdge(graph, traitNode(traitIndex), qbNode(qbIndex), 1, traitCost(qb.ratings[trait]));
    }
  }

  const potential = new Array<number>(nodeCount).fill(0);
  const infinite = Number.POSITIVE_INFINITY;
  let spend = 0;

  for (let flow = 0; flow < traitCount; flow += 1) {
    const dist = new Array<number>(nodeCount).fill(infinite);
    const prevNode = new Array<number>(nodeCount).fill(-1);
    const prevEdge = new Array<number>(nodeCount).fill(-1);
    dist[source] = 0;
    const seen = new Array<boolean>(nodeCount).fill(false);

    for (let step = 0; step < nodeCount; step += 1) {
      let node = -1;
      for (let index = 0; index < nodeCount; index += 1) {
        if (!seen[index] && (node === -1 || (dist[index] ?? infinite) < (dist[node] ?? infinite))) {
          node = index;
        }
      }
      if (node === -1 || dist[node] === infinite) break;
      seen[node] = true;
      for (let edgeIndex = 0; edgeIndex < (graph[node]?.length ?? 0); edgeIndex += 1) {
        const edge = graph[node]?.[edgeIndex];
        if (!edge || edge.cap <= 0) continue;
        const next =
          (dist[node] ?? infinite) + edge.cost + (potential[node] ?? 0) - (potential[edge.to] ?? 0);
        if (next < (dist[edge.to] ?? infinite)) {
          dist[edge.to] = next;
          prevNode[edge.to] = node;
          prevEdge[edge.to] = edgeIndex;
        }
      }
    }

    if (dist[sink] === infinite) return { spend: Number.POSITIVE_INFINITY, quarterbackIds: [] };
    for (let index = 0; index < nodeCount; index += 1) {
      if ((dist[index] ?? infinite) < infinite) {
        potential[index] = (potential[index] ?? 0) + (dist[index] ?? 0);
      }
    }

    for (let node = sink; node !== source; node = prevNode[node] ?? source) {
      const from = prevNode[node] ?? 0;
      const edge = graph[from]?.[prevEdge[node] ?? 0];
      if (!edge) break;
      spend += edge.cost;
      edge.cap -= 1;
      const reverse = graph[edge.to]?.[edge.rev];
      if (reverse) reverse.cap += 1;
    }
  }

  const quarterbackIds: string[] = [];
  for (let index = 0; index < qbCount; index += 1) {
    const intoSink = graph[qbNode(index)]?.find((edge) => edge.to === sink && edge.cap === 0);
    if (intoSink) {
      const qb = available[index];
      if (qb) quarterbackIds.push(qb.id);
    }
  }
  return { spend, quarterbackIds };
}

export function minimumSpend(
  usedIds: ReadonlySet<string>,
  traits: readonly TraitId[],
  pool: readonly Quarterback[] = quarterbacks,
): number {
  return minimumAssignment(usedIds, traits, pool).spend;
}

function affordableQuarterbacks(
  trait: TraitId,
  usedIds: ReadonlySet<string>,
  capRemaining: number,
  pool: readonly Quarterback[],
  futureTraits: readonly TraitId[],
): Quarterback[] {
  const unused = pool.filter((qb) => !usedIds.has(qb.id));
  const base = minimumAssignment(usedIds, futureTraits, pool);
  const reserved = new Set(base.quarterbackIds);
  const bumped = new Map<string, number>();
  for (const id of reserved) {
    const without = new Set(usedIds);
    without.add(id);
    bumped.set(id, minimumSpend(without, futureTraits, pool));
  }
  return unused.filter((qb) => {
    const cost = traitCost(qb.ratings[trait]);
    const reserve = reserved.has(qb.id) ? (bumped.get(qb.id) ?? Number.POSITIVE_INFINITY) : base.spend;
    return cost + reserve <= capRemaining;
  });
}

export function overallRating(ratings: TraitRatings): number {
  let weighted = 0;
  let total = 0;
  for (const trait of TRAIT_IDS) {
    weighted += ratings[trait] * WEIGHTS[trait];
    total += WEIGHTS[trait];
  }
  return Math.round(weighted / total);
}

export function verdictBand(overall: number): VerdictBand {
  if (overall >= 93) return "high";
  if (overall >= 86) return "mid";
  return "low";
}

export function verdictFor(archetypeId: ArchetypeId, overall: number): string {
  return VERDICTS[archetypeId][verdictBand(overall)];
}

const FALLBACK_PRIORITY: readonly TraitId[] = [
  "clutch",
  "accuracy",
  "arm",
  "iq",
  "mobility",
  "pocket",
  "leadership",
  "durability",
];

const FALLBACK_ARCHETYPE: Record<TraitId, ArchetypeId> = {
  arm: "gunslinger",
  accuracy: "pocket-surgeon",
  pocket: "improviser",
  mobility: "dual-threat",
  iq: "game-manager",
  clutch: "closer",
  durability: "ironman",
  leadership: "field-general",
};

export function pickArchetype(ratings: TraitRatings): ArchetypeId {
  const { arm, accuracy, pocket, mobility, iq, clutch, durability, leadership } = ratings;
  const max = Math.max(...TRAIT_IDS.map((trait) => ratings[trait]));
  const top = TRAIT_IDS.filter((trait) => ratings[trait] === max);

  if (mobility >= 93 && mobility >= max - 1 && (arm >= 88 || accuracy >= 86)) {
    return "dual-threat";
  }
  if (accuracy >= 94 && pocket >= 92 && mobility <= 84) {
    return "pocket-surgeon";
  }
  if (arm >= 94 && arm >= accuracy && arm >= max - 2 && mobility < 93) {
    return "gunslinger";
  }
  if (iq >= 93 && accuracy >= 88 && arm <= 91 && mobility <= 82 && iq >= arm) {
    return "game-manager";
  }
  if (clutch >= 96 && clutch === max && clutch > arm) {
    return "closer";
  }
  if (durability >= 96 && top.length === 1 && top[0] === "durability") {
    return "ironman";
  }
  if (leadership >= 96 && iq >= 93 && leadership + iq >= arm + mobility + 8) {
    return "field-general";
  }
  if (pocket >= 94 && mobility >= 86 && pocket >= arm - 4) {
    return "improviser";
  }

  const winner = FALLBACK_PRIORITY.find((trait) => top.includes(trait)) ?? "iq";
  return FALLBACK_ARCHETYPE[winner];
}

export type DraftPick = {
  traitId: TraitId;
  quarterbackId: string;
  rating: number;
  cost: number;
};

export type ScoredDraft = {
  ratings: TraitRatings;
  overall: number;
  archetypeId: ArchetypeId;
  archetypeLabel: string;
  verdict: string;
  spent: number;
};

export function scoreDraft(picks: readonly DraftPick[]): ScoredDraft {
  if (picks.length !== TRAIT_IDS.length) {
    throw new Error(`A full draft needs ${TRAIT_IDS.length} traits`);
  }
  const ratings = {} as TraitRatings;
  const seenTraits = new Set<TraitId>();
  const seenQbs = new Set<string>();
  for (const pick of picks) {
    if (seenTraits.has(pick.traitId)) throw new Error(`Trait picked twice: ${pick.traitId}`);
    if (seenQbs.has(pick.quarterbackId)) throw new Error(`Quarterback picked twice: ${pick.quarterbackId}`);
    seenTraits.add(pick.traitId);
    seenQbs.add(pick.quarterbackId);
    ratings[pick.traitId] = pick.rating;
  }
  const overall = overallRating(ratings);
  const archetypeId = pickArchetype(ratings);
  return {
    ratings,
    overall,
    archetypeId,
    archetypeLabel: ARCHETYPES[archetypeId].label,
    verdict: verdictFor(archetypeId, overall),
    spent: picks.reduce((sum, pick) => sum + pick.cost, 0),
  };
}

export function capNote(spent: number): string {
  const left = SALARY_CAP - spent;
  if (left >= 8) {
    return `You left ${left} in the cap. There was another splash in there if you wanted it.`;
  }
  if (left === 0) return "You spent the cap to the penny.";
  return `Cap spent ${spent} of ${SALARY_CAP}.`;
}

export type ShareLine = {
  trait: string;
  name: string;
  rating: number;
};

export function shareSummary(input: {
  archetypeLabel: string;
  overall: number;
  verdict: string;
  spent: number;
  lines: readonly ShareLine[];
  pageUrl: string;
}): string {
  const rows = input.lines.map((line) => `${line.trait}: ${line.name} (${line.rating})`);
  return [
    "Build a Quarterback · First Down Scotland",
    `${input.archetypeLabel} · ${input.overall} overall (our game rating, not an official grade)`,
    "",
    ...rows,
    "",
    `Cap spent: ${input.spent}/${SALARY_CAP}`,
    "",
    input.verdict,
    "",
    input.pageUrl,
  ].join("\n");
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function slotSeed(gameSeed: number, slotIndex: number, spin: number): number {
  let x = (gameSeed ^ Math.imul(slotIndex + 1, 0x9e3779b1) ^ Math.imul(spin + 1, 0x85ebca6b)) >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return x >>> 0;
}

function shuffleInPlace<T>(items: T[], random: () => number) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    const current = items[index];
    items[index] = items[swap] as T;
    items[swap] = current as T;
  }
}

export function dealSlot(input: {
  trait: TraitId;
  usedIds: ReadonlySet<string>;
  capRemaining: number;
  slotsLeft: number;
  seed: number;
  count?: number;
  pool?: readonly Quarterback[];
}): Quarterback[] {
  const count = input.count ?? BOARD_SIZE;
  const pool = input.pool ?? quarterbacks;
  const traitIndex = TRAIT_IDS.indexOf(input.trait);
  const futureTraits = TRAIT_IDS.slice(traitIndex + 1);
  const unused = pool.filter((qb) => !input.usedIds.has(qb.id));
  const affordable = affordableQuarterbacks(
    input.trait,
    input.usedIds,
    input.capRemaining,
    pool,
    futureTraits,
  );
  let available = affordable;
  if (available.length === 0) {
    available = [...unused].sort(
      (a, b) =>
        traitCost(a.ratings[input.trait]) - traitCost(b.ratings[input.trait]) ||
        a.name.localeCompare(b.name),
    );
  }

  const byRating = [...available].sort(
    (a, b) => b.ratings[input.trait] - a.ratings[input.trait] || a.name.localeCompare(b.name),
  );
  if (byRating.length <= count) return byRating;

  const random = mulberry32(input.seed);
  const third = Math.ceil(byRating.length / 3);
  const bands = [byRating.slice(0, third), byRating.slice(third, third * 2), byRating.slice(third * 2)];
  const picked: Quarterback[] = [];
  const pickedIds = new Set<string>();
  for (const band of bands) {
    if (picked.length >= count || band.length === 0) continue;
    const choice = band[Math.floor(random() * band.length)];
    if (!choice || pickedIds.has(choice.id)) continue;
    picked.push(choice);
    pickedIds.add(choice.id);
  }

  const rest = byRating.filter((qb) => !pickedIds.has(qb.id));
  shuffleInPlace(rest, random);
  for (const qb of rest) {
    if (picked.length >= count) break;
    picked.push(qb);
  }

  picked.sort(
    (a, b) => b.ratings[input.trait] - a.ratings[input.trait] || a.name.localeCompare(b.name),
  );
  return picked;
}

export function traitLabel(traitId: TraitId): string {
  return TRAITS.find((trait) => trait.id === traitId)?.label ?? traitId;
}
