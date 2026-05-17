import {
  Column, Row, Heading, Text, Card, Tag, ProgressBar, Table, Feedback, Badge,
} from "@once-ui-system/core";
import type { STARResult } from "@/utils/star-vote";
import type { Vote, Ballot } from "@/lib/dbTypes";

interface ResultsViewProps {
  result: STARResult;
  votes: Vote[];
  ballot: Ballot;
}

export function ResultsView({ result, votes, ballot }: ResultsViewProps) {
  const { scoringPhase, runoffPhase } = result;
  const maxPossible = votes.length * 5;
  const finalistIds = runoffPhase
    ? new Set([runoffPhase.winner.candidateId, runoffPhase.runnerUp.candidateId])
    : new Set<string>();

  return (
    <Column gap="xl" fillWidth>
      {votes.length === 0 && (
        <Feedback variant="info" title="No votes yet" description="Share the ballot link to start collecting votes." icon />
      )}

      {/* Scoring Phase */}
      <Column gap="m">
        <Column gap="4">
          <Heading variant="heading-strong-l">Scoring phase</Heading>
          <Text variant="body-default-m" onBackground="neutral-weak">
            Total points earned by each candidate (0–5 per voter, max {maxPossible})
          </Text>
        </Column>

        {scoringPhase.map((candidate, index) => {
          const pct = maxPossible > 0 ? (candidate.totalScore / maxPossible) * 100 : 0;
          const isFinalist = finalistIds.has(candidate.candidateId);
          return (
            <Card key={candidate.candidateId} padding="m" fillWidth>
              <Column gap="s" fillWidth>
                <Row fillWidth vertical="center" style={{ justifyContent: "space-between" }}>
                  <Row gap="s" vertical="center" style={{ flex: 1, minWidth: 0 }}>
                    <Text variant="heading-strong-m" onBackground="neutral-weak">
                      #{index + 1}
                    </Text>
                    <Text variant="heading-strong-m">{candidate.name}</Text>
                    {isFinalist && (
                      <Tag variant="brand" size="s" label="Finalist" />
                    )}
                  </Row>
                  <Text variant="heading-strong-m" onBackground="neutral-strong" style={{ flexShrink: 0 }}>
                    {candidate.totalScore} pts
                  </Text>
                </Row>
                <ProgressBar
                  value={pct}
                  min={0}
                  max={100}
                  barBackground="brand-solid-strong"
                />
              </Column>
            </Card>
          );
        })}
      </Column>

      {/* Runoff Phase */}
      {runoffPhase && votes.length > 0 && (
        <Column gap="m">
          <Column gap="4">
            <Heading variant="heading-strong-l">Automatic runoff</Heading>
            <Text variant="body-default-m" onBackground="neutral-weak">
              Head-to-head comparison between the top two candidates
            </Text>
          </Column>

          <Row gap="m" fillWidth>
            {/* Winner */}
            <Card padding="m" flex={1} border="brand-medium">
              <Column gap="s" horizontal="center" align="center">
                <Tag variant="brand" size="m" label="Winner" prefixIcon="trophy" />
                <Heading variant="heading-strong-l">{runoffPhase.winner.name}</Heading>
                <Text variant="body-default-m" onBackground="neutral-weak">
                  Preferred by{" "}
                  <Text as="span" variant="heading-strong-m" onBackground="neutral-strong">
                    {runoffPhase.winnerPreferences}
                  </Text>{" "}
                  of {votes.length} voters
                </Text>
              </Column>
            </Card>

            {/* Runner-up */}
            <Card padding="m" flex={1}>
              <Column gap="s" horizontal="center" align="center">
                <Tag variant="neutral" size="m" label="Runner-up" />
                <Heading variant="heading-strong-l">{runoffPhase.runnerUp.name}</Heading>
                <Text variant="body-default-m" onBackground="neutral-weak">
                  Preferred by{" "}
                  <Text as="span" variant="heading-strong-m" onBackground="neutral-strong">
                    {runoffPhase.runnerUpPreferences}
                  </Text>{" "}
                  of {votes.length} voters
                </Text>
              </Column>
            </Card>
          </Row>

          {runoffPhase.tiedPreferences && (
            <Feedback
              variant="warning"
              title="Preference tie"
              description="Both finalists received equal preferences. The winner was determined by their higher total score from the scoring phase."
              icon
            />
          )}
        </Column>
      )}

      {/* Voter Breakdown */}
      {votes.length > 0 && (
        <Column gap="m">
          <Heading variant="heading-strong-l">Voter breakdown</Heading>
          <Table
            data={{
              headers: [
                { key: "voter", content: "Voter" },
                ...ballot.candidates.map((c) => ({ key: c.candidateId, content: c.name })),
                { key: "total", content: "Total" },
              ],
              rows: votes.map((vote) => {
                const rowTotal = ballot.candidates.reduce(
                  (sum, c) => sum + (vote.scores[c.candidateId] ?? 0),
                  0
                );
                return [
                  <Text key="voter" variant="body-default-s">{vote.voterName}</Text>,
                  ...ballot.candidates.map((c) => (
                    <Badge
                      key={c.candidateId}
                      background="neutral-alpha-weak"
                      onBackground="neutral-strong"
                      textVariant="code-default-s"
                    >
                      {vote.scores[c.candidateId] ?? 0}
                    </Badge>
                  )),
                  <Text key="total" variant="body-strong-s">{rowTotal}</Text>,
                ];
              }),
            }}
          />
        </Column>
      )}
    </Column>
  );
}
