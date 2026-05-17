"use client";

import { useState } from "react";
import { IconButton } from "@once-ui-system/core";

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <IconButton
      icon={copied ? "check" : "clipboard"}
      size="m"
      variant={copied ? "primary" : "secondary"}
      tooltip={copied ? "Copied!" : "Copy link"}
      onClick={handleCopy}
    />
  );
}
