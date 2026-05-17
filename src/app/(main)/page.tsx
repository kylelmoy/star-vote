import { Heading, Text, Button, Column, Row, Card, Schema } from "@once-ui-system/core";
import { baseURL, meta } from "@/resources/seo";

export default function Home() {
  return (
    <Column fillWidth minHeight="100vh" center padding="l">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={meta.home.title}
        description={meta.home.description}
        path={meta.home.path}
      />
      <Column maxWidth="m" horizontal="center" gap="xl" align="center">
        <Column gap="m" align="center">
          <Heading variant="display-strong-xl">STAR Vote</Heading>
          <Text
            variant="heading-default-l"
            onBackground="neutral-weak"
            wrap="balance"
            align="center"
          >
            Score Then Automatic Runoff — the fairest way to make group decisions
          </Text>
        </Column>

        <Row gap="m" fillWidth wrap>
          <Card padding="m" flex={1} style={{ minWidth: 200 }}>
            <Column gap="s">
              <Text variant="heading-strong-l">1. Score</Text>
              <Text variant="body-default-m" onBackground="neutral-weak">
                Give each candidate 0–5 stars based on how much you support them.
              </Text>
            </Column>
          </Card>
          <Card padding="m" flex={1} style={{ minWidth: 200 }}>
            <Column gap="s">
              <Text variant="heading-strong-l">2. Tally</Text>
              <Text variant="body-default-m" onBackground="neutral-weak">
                The two highest-scoring candidates advance to the automatic runoff.
              </Text>
            </Column>
          </Card>
          <Card padding="m" flex={1} style={{ minWidth: 200 }}>
            <Column gap="s">
              <Text variant="heading-strong-l">3. Runoff</Text>
              <Text variant="body-default-m" onBackground="neutral-weak">
                The finalist preferred by more voters wins. Every vote counts.
              </Text>
            </Column>
          </Card>
        </Row>

        <Button id="create-button" href="/create" size="l" arrowIcon>
          Create a ballot
        </Button>
      </Column>
    </Column>
  );
}
