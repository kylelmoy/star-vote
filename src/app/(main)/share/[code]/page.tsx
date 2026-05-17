import { notFound } from "next/navigation";
import { Column, Heading, Text, Button, Row, Card } from "@once-ui-system/core";
import { getBallot } from "@/lib/dbAccess";
import { CopyButton } from "@/components/CopyButton";

export default async function SharePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const ballot = await getBallot(code);
  if (!ballot) notFound();

  const voteUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/vote/${ballot.ballotId}`;
  const resultsUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/results/${ballot.ballotId}`;

  return (
    <Column fillWidth minHeight="100vh" horizontal="center" padding="l" paddingTop="xl">
      <Column maxWidth="s" gap="xl" fillWidth>
        <Column gap="s">
          <Heading variant="heading-strong-xl">Ballot created!</Heading>
          <Text variant="body-default-m" onBackground="neutral-weak">
            Share these links so people can vote on <strong>{ballot.name}</strong>.
          </Text>
        </Column>

        <Card padding="m">
          <Column gap="m">
            <Column gap="4">
              <Text variant="label-strong-s" onBackground="neutral-medium">Voting link</Text>
              <Text variant="body-default-m" onBackground="neutral-weak">
                Share this link so others can cast their vote.
              </Text>
            </Column>
            <Row gap="s" vertical="center" fillWidth>
              <Text
                variant="code-default-s"
                onBackground="neutral-strong"
                style={{ flex: 1, wordBreak: "break-all" }}
              >
                /vote/{ballot.ballotId}
              </Text>
              <CopyButton text={voteUrl} />
            </Row>
          </Column>
        </Card>

        <Card padding="m">
          <Column gap="m">
            <Column gap="4">
              <Text variant="label-strong-s" onBackground="neutral-medium">Results link</Text>
              <Text variant="body-default-m" onBackground="neutral-weak">
                View live results as votes come in.
              </Text>
            </Column>
            <Row gap="s" vertical="center" fillWidth>
              <Text
                variant="code-default-s"
                onBackground="neutral-strong"
                style={{ flex: 1, wordBreak: "break-all" }}
              >
                /results/{ballot.ballotId}
              </Text>
              <CopyButton text={resultsUrl} />
            </Row>
          </Column>
        </Card>

        <Row gap="m" wrap>
          <Button href={`/vote/${ballot.ballotId}`} arrowIcon>
            Vote now
          </Button>
          <Button href={`/results/${ballot.ballotId}`} variant="secondary">
            View results
          </Button>
        </Row>
      </Column>
    </Column>
  );
}
