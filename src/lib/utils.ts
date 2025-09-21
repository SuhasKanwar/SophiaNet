import { clsx, type ClassValue } from "clsx"
import MarkdownIt from "markdown-it";
import { twMerge } from "tailwind-merge"
import React from "react";
import { CodeBlock } from "@/components/ui/code-block";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
  typographer: true,
  highlight: function (str, lang) {
    return "";
  },
})

interface CodeBlockMatch {
  type: 'code';
  language: string;
  code: string;
  filename: string;
  index: number;
  length: number;
}

interface TextMatch {
  type: 'text';
  content: string;
  index: number;
  length: number;
}

export function renderMarkdownWithCodeBlocks(markdown: string): React.ReactNode[] {
  const codeBlockRegex = /```(\w+)?\s*(?:\/\/\s*filepath:\s*([^\n]*))?\n([\s\S]*?)```/g;
  const matches: (CodeBlockMatch | TextMatch)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    if (match.index > lastIndex) {
      matches.push({
        type: 'text',
        content: markdown.slice(lastIndex, match.index),
        index: lastIndex,
        length: match.index - lastIndex
      });
    }

    const language = match[1] || 'text';
    const filename = language;
    const code = match[3] || '';
    
    matches.push({
      type: 'code',
      language,
      code,
      filename,
      index: match.index,
      length: match[0].length
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < markdown.length) {
    matches.push({
      type: 'text',
      content: markdown.slice(lastIndex),
      index: lastIndex,
      length: markdown.length - lastIndex
    });
  }

  return matches.map((match, index) => {
    if (match.type === 'code') {
      return React.createElement(CodeBlock, {
        key: index,
        language: match.language,
        filename: match.filename,
        code: match.code
      });
    } else {
      const htmlContent = md.render(match.content);
      return React.createElement('div', {
        key: index,
        className: 'space-y-2 leading-relaxed',
        dangerouslySetInnerHTML: { __html: htmlContent }
      });
    }
  });
}