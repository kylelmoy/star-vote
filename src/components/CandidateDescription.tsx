"use client";

import { useState } from "react";
import { Column, Text } from "@once-ui-system/core";
import styles from "./CandidateDescription.module.css";

const MAX_CHARS = 180;

interface CandidateDescriptionProps {
  description: string;
}

/** Cuts at the last word boundary before the limit so words aren't split. */
function truncate(text: string) {
  const cut = text.slice(0, MAX_CHARS);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

export function CandidateDescription({ description }: CandidateDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const isTruncatable = description.length > MAX_CHARS;

  return (
    <Column gap="4" fillWidth>
      <Text variant="body-default-s" onBackground="neutral-weak">
        {isTruncatable && !expanded ? truncate(description) : description}
      </Text>
      {isTruncatable && (
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </Column>
  );
}
