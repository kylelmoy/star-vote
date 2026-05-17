import { notFound } from "next/navigation";
import { Column, Heading, Text, Button, Row } from "@once-ui-system/core";
import { getBallot, getVotes } from "@/lib/dbAccess";
import { computeSTARResult } from "@/utils/star-vote";
import { ResultsView } from "@/components/ResultsView";

export const dynamic = "force-dynamic";

export default async function ResultsPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const ballot = await getBallot(code);
  if (!ballot) notFound();

  const votes = await getVotes(ballot.ballotId);
  const result = computeSTARResult(ballot.candidates, votes);

  return (
    <Column fillWidth minHeight="100vh" horizontal="center" padding="l" paddingTop="xl">
      <Column maxWidth="m" gap="xl" fillWidth>
        <Column gap="s">
          <Heading variant="heading-strong-xl">{ballot.name}</Heading>
          {ballot.description && (
            <Text variant="body-default-m" onBackground="neutral-weak">
              {ballot.description}
            </Text>
          )}
          <Text variant="label-default-s" onBackground="neutral-weak">
            {votes.length} {votes.length === 1 ? "vote" : "votes"} — Ballot code: {ballot.ballotId}
          </Text>
        </Column>

        <ResultsView result={result} votes={votes} ballot={ballot} />

        <Row gap="m">
          <Button href={`/vote/${ballot.ballotId}`} variant="secondary">
            Cast / update your vote
          </Button>
          <Button href={`/share/${ballot.ballotId}`} variant="tertiary">
            Share ballot
          </Button>
        </Row>
      </Column>
    </Column>
  );
}
