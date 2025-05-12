
import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = 'typescript', className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={cn("relative my-4 rounded-md bg-muted/50", className)}>
      <div className="absolute right-2 top-2">
        <button
          onClick={copyToClipboard}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background p-1 hover:bg-muted focus:outline-none"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="h-4 w-4 text-burgundy" />
          ) : (
            <Copy className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm">
        <code className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  );
}
