import { createHighlighterCoreSync, type HighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import invariant from 'tiny-invariant';

import dracula from 'shiki/themes/dracula-soft.mjs';

import js from 'shiki/langs/javascript.mjs';
import ts from 'shiki/langs/typescript.mjs';
import markdown from 'shiki/langs/markdown.mjs';
import tsx from 'shiki/langs/tsx.mjs';
import bash from 'shiki/langs/bash.mjs';
import jsx from 'shiki/langs/jsx.mjs';
import json from 'shiki/langs/json.mjs';
import tf from 'shiki/langs/tf.mjs';
import css from 'shiki/langs/css.mjs';
import html from 'shiki/langs/html.mjs';

const supportedThemes = ['dracula-soft'];

const supportedLanguages = [
  'javascript',
  'typescript',
  'markdown',
  'tsx',
  'bash',
  'jsx',
  'json',
  'tf',
  'css',
  'txt',
  'html',
];

function isSupportedTheme(theme: string) {
  return supportedThemes.includes(theme);
}

function isSupportedLanguage(language: string) {
  return supportedLanguages.includes(language);
}

export async function initShiki(): Promise<HighlighterCore> {
  const shiki = createHighlighterCoreSync({
    themes: [dracula],
    langs: [js, ts, markdown, tsx, bash, jsx, json, tf, css, html],
    // Avoid Oniguruma WASM crashes during Bun-powered Vercel builds.
    engine: createJavaScriptRegexEngine(),
  });
  return shiki;
}

type CodeToHtmlCtx = {
  theme?: string;
  shikiInstance: HighlighterCore;
};

export function codeToHtml(content: string, language: string, ctx: CodeToHtmlCtx) {
  const theme = ctx.theme ?? 'dracula-soft';
  invariant(content, 'CodeBlock must have content');
  invariant(isSupportedTheme(theme), `CodeBlock must have a supported theme but got ${theme}`);
  invariant(isSupportedLanguage(language), `CodeBlock must have a supported language but got ${language}`);
  return ctx.shikiInstance.codeToHtml(content, { lang: language, theme });
}
