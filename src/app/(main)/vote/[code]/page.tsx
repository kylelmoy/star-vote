import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Column, Heading, Text } from "@once-ui-system/core";
import { getBallot, getVotes } from "@/lib/dbAccess";
import { VoteForm } from "@/components/VoteForm";

export const dynamic = "force-dynamic";

export default async function VotePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const ballot = await getBallot(code);
  if (!ballot) notFound();

  const cookieStore = await cookies();
  const existingVoteId = cookieStore.get(`star-vote-${ballot.ballotId}`)?.value ?? null;

  let existingVote = null;
  if (existingVoteId) {
    const allVotes = await getVotes(ballot.ballotId);
    existingVote = allVotes.find((v) => v.voteId === existingVoteId) ?? null;
  }

  return (
    <Column fillWidth minHeight="100vh" horizontal="center" padding="l" paddingTop="xl">
      <Column maxWidth="s" gap="l" fillWidth>
        <Column gap="s">
          <Heading variant="heading-strong-xl">{ballot.name}</Heading>
          {ballot.description && (
            <Text variant="body-default-m" onBackground="neutral-weak">
              {ballot.description}
            </Text>
          )}
        </Column>
        <VoteForm ballot={ballot} existingVote={existingVote} />
      </Column>
    </Column>
  );
}
