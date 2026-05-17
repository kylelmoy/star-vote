"use client";

import { Column, Row, Text, SegmentedControl } from "@once-ui-system/core";

const SCORE_BUTTONS = [
  { value: "0", label: "0" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
];

const SCORE_LABELS = ["No opinion", "Poor", "Fair", "Good", "Great", "Excellent"];

interface StarRatingProps {
  value: number;
  onChange: (score: number) => void;
  disabled?: boolean;
}

export function StarRating({ value, onChange, disabled }: StarRatingProps) {
  return (
    <Column gap="4">
      <Row gap="8" vertical="center">
        <SegmentedControl
          buttons={SCORE_BUTTONS}
          selected={String(value)}
          onToggle={(v) => !disabled && onChange(Number(v))}
          style={disabled ? { pointerEvents: "none", opacity: 0.6 } : undefined}
        />
        <Text variant="label-default-s" onBackground="neutral-weak" style={{ minWidth: 70 }}>
          {SCORE_LABELS[value]}
        </Text>
      </Row>
    </Column>
  );
}
