"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Column, Row, Input, Textarea, Button, IconButton, Card, Heading, Text, Feedback, Line,
} from "@once-ui-system/core";
import { createBallot } from "@/lib/dbAccess";

type CandidateInput = {
  name: string;
  imageUrl: string;
  linkUrl: string;
  description: string;
};

const emptyCandidate = (): CandidateInput => ({ name: "", imageUrl: "", linkUrl: "", description: "" });

export function CreateBallotForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [ballotName, setBallotName] = useState("");
  const [ballotDescription, setBallotDescription] = useState("");
  const [candidates, setCandidates] = useState<CandidateInput[]>([emptyCandidate(), emptyCandidate()]);
  const [error, setError] = useState<string | null>(null);

  function updateCandidate(index: number, field: keyof CandidateInput, value: string) {
    setCandidates((prev) => prev.map((c, i) => i === index ? { ...c, [field]: value } : c));
  }

  function addCandidate() {
    setCandidates((prev) => [...prev, emptyCandidate()]);
  }

  function removeCandidate(index: number) {
    setCandidates((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!ballotName.trim()) { setError("Ballot name is required."); return; }
    if (candidates.length < 2) { setError("At least 2 candidates are required."); return; }
    const validCandidates = candidates.filter((c) => c.name.trim());
    if (validCandidates.length < 2) { setError("At least 2 candidates must have a name."); return; }

    startTransition(async () => {
      const result = await createBallot({
        name: ballotName.trim(),
        description: ballotDescription.trim() || undefined,
        candidates: validCandidates.map((c) => ({
          name: c.name.trim(),
          imageUrl: c.imageUrl.trim() || undefined,
          linkUrl: c.linkUrl.trim() || undefined,
          description: c.description.trim() || undefined,
        })),
      });

      if ("ballotId" in result) {
        router.push(`/share/${result.ballotId}`);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Column gap="l">
        <Column gap="m">
          <Heading variant="heading-strong-m">Ballot details</Heading>
          <Input
            id="ballot-name"
            label="Ballot name"
            value={ballotName}
            onChange={(e) => setBallotName(e.target.value)}
            placeholder="e.g. Best pizza topping"
            required
          />
          <Textarea
            id="ballot-description"
            label="Description (optional)"
            value={ballotDescription}
            onChange={(e) => setBallotDescription(e.target.value)}
            placeholder="Provide context for voters…"
            lines={3}
          />
        </Column>

        <Line background="neutral-alpha-weak" />

        <Column gap="m">
          <Row fillWidth horizontal="between" vertical="center">
            <Heading variant="heading-strong-m">Candidates</Heading>
            <Button
              type="button"
              variant="secondary"
              size="s"
              prefixIcon="plus"
              onClick={addCandidate}
            >
              Add candidate
            </Button>
          </Row>

          {candidates.map((candidate, index) => (
            <Card key={index} padding="m" fillWidth>
              <Column gap="m" fillWidth>
                <Row fillWidth horizontal="between" vertical="center">
                  <Text variant="label-strong-m" onBackground="neutral-medium">
                    Candidate {index + 1}
                  </Text>
                  {candidates.length > 2 && (
                    <IconButton
                      icon="trash"
                      size="s"
                      variant="ghost"
                      tooltip="Remove candidate"
                      onClick={() => removeCandidate(index)}
                    />
                  )}
                </Row>
                <Input
                  id={`candidate-name-${index}`}
                  label="Name"
                  value={candidate.name}
                  onChange={(e) => updateCandidate(index, "name", e.target.value)}
                  placeholder="Candidate name"
                />
                <Input
                  id={`candidate-description-${index}`}
                  label="Description (optional)"
                  value={candidate.description}
                  onChange={(e) => updateCandidate(index, "description", e.target.value)}
                  placeholder="Short description"
                />
                <Input
                  id={`candidate-image-${index}`}
                  label="Image URL (optional)"
                  value={candidate.imageUrl}
                  onChange={(e) => updateCandidate(index, "imageUrl", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <Input
                  id={`candidate-link-${index}`}
                  label="Link URL (optional)"
                  value={candidate.linkUrl}
                  onChange={(e) => updateCandidate(index, "linkUrl", e.target.value)}
                  placeholder="https://example.com"
                />
              </Column>
            </Card>
          ))}
        </Column>

        {error && (
          <Feedback variant="danger" title="Error" description={error} icon />
        )}

        <Button type="submit" fillWidth loading={isPending} disabled={isPending}>
          {isPending ? "Creating ballot…" : "Create ballot"}
        </Button>
      </Column>
    </form>
  );
}
