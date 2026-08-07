"use client";

import { Column, Row, Text, SegmentedControl } from "@once-ui-system/core";
import styles from "./StarRating.module.css";

const SCORE_BUTTONS = [0, 1, 2, 3, 4, 5].map((score) => ({
  value: String(score),
  label: String(score),
  // ToggleButton renders a bare <button>, which defaults to type="submit".
  // Inside VoteForm's <form> that makes picking a score submit the vote.
  type: "button" as const,
}));

interface StarRatingProps {
  value: number;
  onChange: (score: number) => void;
  disabled?: boolean;
}

export function StarRating({ value, onChange, disabled }: StarRatingProps) {
  return (
    <Column gap="4" fillWidth>
      <Row gap="8" vertical="center">
        <SegmentedControl
          buttons={SCORE_BUTTONS}
          selected={String(value)}
          onToggle={(v) => !disabled && onChange(Number(v))}
          className={styles.scoreButton}
          style={disabled ? { pointerEvents: "none", opacity: 0.6 } : undefined}
        />
      </Row>
    </Column>
  );
}
