
import React, { useState } from 'react';
import { Check, Copy, Code } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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

  const getLanguageClass = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'javascript':
      case 'js':
        return 'language-javascript';
      case 'typescript':
      case 'ts':
        return 'language-typescript';
      case 'html':
        return 'language-html';
      case 'css':
        return 'language-css';
      case 'json':
        return 'language-json';
      case 'python':
      case 'py':
        return 'language-python';
      case 'bash':
      case 'sh':
        return 'language-bash';
      case 'sql':
        return 'language-sql';
      default:
        return `language-${lang}`;
    }
  };

  return (
    <div className={cn("relative my-4 rounded-md bg-slate-950 text-slate-50", className)}>
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-400">{language.toUpperCase()}</span>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <button
              onClick={copyToClipboard}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-800 focus:outline-none"
              aria-label="Copy code"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-slate-400" />
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2 text-xs bg-slate-900 text-slate-200 border-slate-800" side="top">
            {copied ? "Copied!" : "Copy code"}
          </PopoverContent>
        </Popover>
      </div>
      <pre className="overflow-x-auto p-4 text-sm">
        <code className={getLanguageClass(language)}>
          {code}
        </code>
      </pre>
    </div>
  );
}
