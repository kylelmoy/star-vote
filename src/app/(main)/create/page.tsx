import { Column, Heading, Text } from "@once-ui-system/core";
import { CreateBallotForm } from "@/components/CreateBallotForm";

export const metadata = {
  title: "Create a Ballot — STAR Vote",
  robots: "noindex",
};

export default function CreatePage() {
  return (
    <Column fillWidth minHeight="100vh" horizontal="center" padding="l" paddingTop="xl">
      <Column maxWidth="s" gap="l" fillWidth>
        <Column gap="s">
          <Heading variant="heading-strong-xl">Create a ballot</Heading>
          <Text variant="body-default-m" onBackground="neutral-weak">
            Add your candidates, then share the link for people to vote.
          </Text>
        </Column>
        <CreateBallotForm />
      </Column>
    </Column>
  );
}
