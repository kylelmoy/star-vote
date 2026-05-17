import { Row, SmartLink, Text } from "@once-ui-system/core";

export function Header() {
  return (
    <Row
      as="header"
      fillWidth
      paddingX="l"
      paddingY="m"
      position="relative"
      zIndex={1}
      borderBottom="neutral-alpha-weak"
    >
      <SmartLink href="/" style={{ textDecoration: "none" }}>
        <Text variant="heading-strong-m" onBackground="neutral-strong">
          STAR Vote
        </Text>
      </SmartLink>
    </Row>
  );
}
