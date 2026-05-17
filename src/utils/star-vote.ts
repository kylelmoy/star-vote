export type CandidateScore = {
  candidateId: string;
  name: string;
  totalScore: number;
  imageUrl?: string;
  description?: string;
  linkUrl?: string;
};

export type RunoffResult = {
  winner: CandidateScore;
  runnerUp: CandidateScore;
  winnerPreferences: number;
  runnerUpPreferences: number;
  tiedPreferences: boolean;
};

export type STARResult = {
  scoringPhase: CandidateScore[];
  runoffPhase: RunoffResult | null;
};

export type RawVote = { scores: Record<string, number> };

export function computeSTARResult(
  candidates: Array<{
    candidateId: string;
    name: string;
    imageUrl?: string;
    description?: string;
    linkUrl?: string;
  }>,
  votes: RawVote[]
): STARResult {
  const totals = new Map<string, number>();
  for (const c of candidates) totals.set(c.candidateId, 0);

  for (const vote of votes) {
    for (const [candidateId, score] of Object.entries(vote.scores)) {
      totals.set(candidateId, (totals.get(candidateId) ?? 0) + score);
    }
  }

  const scoringPhase: CandidateScore[] = candidates.map((c) => ({
    candidateId: c.candidateId,
    name: c.name,
    imageUrl: c.imageUrl,
    description: c.description,
    linkUrl: c.linkUrl,
    totalScore: totals.get(c.candidateId) ?? 0,
  }));

  scoringPhase.sort((a, b) => b.totalScore - a.totalScore);

  if (scoringPhase.length < 2) return { scoringPhase, runoffPhase: null };

  const finalist1 = scoringPhase[0];
  const finalist2 = scoringPhase[1];

  let f1Prefs = 0;
  let f2Prefs = 0;
  for (const vote of votes) {
    const s1 = vote.scores[finalist1.candidateId] ?? 0;
    const s2 = vote.scores[finalist2.candidateId] ?? 0;
    if (s1 > s2) f1Prefs++;
    else if (s2 > s1) f2Prefs++;
  }

  const tiedPreferences = f1Prefs === f2Prefs;
  const winner = f2Prefs > f1Prefs ? finalist2 : finalist1;
  const runnerUp = winner === finalist1 ? finalist2 : finalist1;

  return {
    scoringPhase,
    runoffPhase: {
      winner,
      runnerUp,
      winnerPreferences: winner === finalist1 ? f1Prefs : f2Prefs,
      runnerUpPreferences: winner === finalist1 ? f2Prefs : f1Prefs,
      tiedPreferences,
    },
  };
}
