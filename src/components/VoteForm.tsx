"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Column, Row, Input, Button, Card, Heading, Text, Feedback, SmartLink, Line,
} from "@once-ui-system/core";
import { castVote } from "@/lib/dbAccess";
import { StarRating } from "@/components/StarRating";
import { CandidateDescription } from "@/components/CandidateDescription";
import type { Ballot, Vote } from "@/lib/dbTypes";
import styles from "./VoteForm.module.css";

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
            <Column key={candidate.candidateId} gap="m"
              border="neutral-alpha-weak" radius="m" padding="m" fillWidth>
              <Row gap="m" vertical="center"
                s={{ direction: "column", horizontal: "stretch", vertical: "start" }}>
                {candidate.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={candidate.imageUrl}
                    alt={candidate.name}
                    className={styles.candidateImage}
                  />
                )}
                <Column gap="4" style={{ flex: 1, minWidth: 0 }}>
                  <Row gap="m" vertical="center" horizontal="between" fillWidth>
                    <Text variant="heading-strong-m"
                      style={{ flex: 1, minWidth: 0, wordBreak: "break-word" }}>
                      {candidate.name}
                    </Text>
                    {candidate.linkUrl && (
                      <SmartLink href={candidate.linkUrl} target="_blank"
                        suffixIcon="externalLink"
                        style={{ flexShrink: 0, color: "var(--brand-on-background-medium)" }}>
                        <Text variant="label-default-s">Visit</Text>
                      </SmartLink>
                    )}
                  </Row>
                  {candidate.description && (
                    <CandidateDescription description={candidate.description} />
                  )}
                </Column>
              </Row>

              <StarRating
                value={scores[candidate.candidateId] ?? 0}
                onChange={(score) => setScore(candidate.candidateId, score)}
                disabled={isPending}
              />
            </Column>
          ))}
        </Column>

        {error && (
          <Feedback variant="danger" title="Error" description={error} icon />
        )}

        <Button type="submit" fillWidth loading={isPending} disabled={isPending}
          className={styles.submitButton}>
          {isPending
            ? existingVote ? "Updating vote…" : "Submitting vote…"
            : existingVote ? "Update vote" : "Submit vote"}
        </Button>

        {/* Scroll cushion, so the submit button can be swiped up into thumb reach. */}
        <div aria-hidden className={styles.submitSpacer} />
      </Column>
    </form>
  );
}
