"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Column, Row, Input, Button, Card, Heading, Text, Feedback, SmartLink, Media, Line,
} from "@once-ui-system/core";
import { castVote } from "@/lib/dbAccess";
import { StarRating } from "@/components/StarRating";
import type { Ballot, Vote } from "@/lib/dbTypes";

interface VoteFormProps {
  ballot: Ballot;
  existingVote: Vote | null;
}

export function VoteForm({ ballot, existingVote }: VoteFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [voterName, setVoterName] = useState(existingVote?.voterName ?? "");
  const [scores, setScores] = useState<Record<string, number>>(() => {
    if (existingVote) return { ...existingVote.scores };
    return Object.fromEntries(ballot.candidates.map((c) => [c.candidateId, 0]));
  });
  const [error, setError] = useState<string | null>(null);

  function setScore(candidateId: string, score: number) {
    setScores((prev) => ({ ...prev, [candidateId]: score }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!voterName.trim()) { setError("Please enter your name."); return; }

    startTransition(async () => {
      const result = await castVote({
        voteId: existingVote?.voteId,
        ballotId: ballot.ballotId,
        voterName: voterName.trim(),
        scores,
      });

      if ("voteId" in result) {
        document.cookie = `star-vote-${ballot.ballotId}=${result.voteId}; max-age=${365 * 24 * 60 * 60}; path=/; SameSite=Lax`;
        router.push(`/results/${ballot.ballotId}`);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Column gap="l">
        {existingVote && (
          <Feedback
            variant="info"
            title="Editing your vote"
            description="You've already voted on this ballot. Submitting will update your existing vote."
            icon
          />
        )}

        <Input
          id="voter-name"
          label="Your name"
          value={voterName}
          onChange={(e) => setVoterName(e.target.value)}
          placeholder="Enter your name"
          required
        />

        <Line background="neutral-alpha-weak" />

        <Column gap="m">
          <Column gap="4">
            <Heading variant="heading-strong-m">Score each candidate</Heading>
            <Text variant="body-default-s" onBackground="neutral-weak">
              Give each candidate a score from 0 (no support) to 5 (maximum support).
            </Text>
          </Column>

          {ballot.candidates.map((candidate) => (
            <Card key={candidate.candidateId} padding="m">
              <Column gap="m">
                <Row gap="m" vertical="start">
                  {candidate.imageUrl && (
                    <Media
                      src={candidate.imageUrl}
                      alt={candidate.name}
                      aspectRatio="1/1"
                      height={80}
                      style={{ borderRadius: "var(--radius-m)", flexShrink: 0 }}
                    />
                  )}
                  <Column gap="4" flex={1}>
                    <Row gap="s" vertical="center">
                      <Heading variant="heading-strong-m">{candidate.name}</Heading>
                      {candidate.linkUrl && (
                        <SmartLink href={candidate.linkUrl} target="_blank">
                          <Text variant="label-default-s" onBackground="brand-medium">
                            Visit ↗
                          </Text>
                        </SmartLink>
                      )}
                    </Row>
                    {candidate.description && (
                      <Text variant="body-default-s" onBackground="neutral-weak">
                        {candidate.description}
                      </Text>
                    )}
                  </Column>
                </Row>

                <StarRating
                  value={scores[candidate.candidateId] ?? 0}
                  onChange={(score) => setScore(candidate.candidateId, score)}
                  disabled={isPending}
                />
              </Column>
            </Card>
          ))}
        </Column>

        {error && (
          <Feedback variant="danger" title="Error" description={error} icon />
        )}

        <Button type="submit" fillWidth loading={isPending} disabled={isPending}>
          {isPending
            ? existingVote ? "Updating vote…" : "Submitting vote…"
            : existingVote ? "Update vote" : "Submit vote"}
        </Button>
      </Column>
    </form>
  );
}
