"use server";

import { getDb } from "@/lib/dbClient";
import type { Ballot, Vote } from "@/lib/dbTypes";
import { generateCode, generateId } from "@/utils";

let indexesCreated = false;

async function ensureIndexes() {
  if (indexesCreated) return;
  const db = await getDb();
  await Promise.all([
    db.collection("ballots").createIndex({ ballotId: 1 }, { unique: true }),
    db.collection("votes").createIndex({ voteId: 1 }, { unique: true }),
    db.collection("votes").createIndex({ ballotId: 1 }),
  ]);
  indexesCreated = true;
}

export async function createBallot(data: {
  name: string;
  description?: string;
  candidates: Array<{ name: string; imageUrl?: string; linkUrl?: string; description?: string }>;
}): Promise<{ ballotId: string } | { error: string }> {
  await ensureIndexes();
  const db = await getDb();
  const ballots = db.collection<Ballot>("ballots");

  const candidates = data.candidates.map((c) => ({ ...c, candidateId: generateId() }));

  let ballotId = "";
  for (let i = 0; i < 10; i++) {
    const code = generateCode(4);
    const existing = await ballots.findOne({ ballotId: code });
    if (!existing) { ballotId = code; break; }
  }
  if (!ballotId) return { error: "Could not generate unique ballot code" };

  const ballot: Ballot = { ballotId, name: data.name, description: data.description, candidates, createdAt: Date.now() };
  await ballots.insertOne(ballot);
  return { ballotId };
}

export async function getBallot(code: string): Promise<Ballot | null> {
  const db = await getDb();
  const ballot = await db
    .collection<Ballot>("ballots")
    .findOne({ ballotId: code.toUpperCase() }, { projection: { _id: 0 } });
  return ballot ?? null;
}

export async function getVotes(code: string): Promise<Vote[]> {
  const db = await getDb();
  return db
    .collection<Vote>("votes")
    .find({ ballotId: code.toUpperCase() }, { projection: { _id: 0 } })
    .toArray();
}

export async function castVote(data: {
  voteId?: string;
  ballotId: string;
  voterName: string;
  scores: Record<string, number>;
}): Promise<{ voteId: string } | { error: string }> {
  await ensureIndexes();
  const db = await getDb();
  const votes = db.collection<Vote>("votes");

  const now = Date.now();
  const voteId = data.voteId ?? generateId();

  await votes.updateOne(
    { voteId },
    {
      $set: { voteId, ballotId: data.ballotId.toUpperCase(), voterName: data.voterName.trim(), scores: data.scores, updatedAt: now },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true }
  );

  return { voteId };
}
