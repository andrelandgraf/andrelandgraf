import type { FC, HTMLAttributes, ReactElement } from 'react';
import { Children, useId } from 'react';
import invariant from 'tiny-invariant';
import type { Language } from 'prism-react-renderer';
import Highlight, { defaultProps } from 'prism-react-renderer';
import { CopyClipboardButton } from '~/components/UI/buttons/copyClipboard';

function getLanguageFromClassName(className: string) {
  const match = className.match(/language-(\w+)/);
  return match ? match[1] : '';
}

function isLanguageSupported(lang: string): lang is Language {
  return (
    lang === 'markup' ||
    lang === 'bash' ||
    lang === 'clike' ||
    lang === 'c' ||
    lang === 'cpp' ||
    lang === 'css' ||
    lang === 'javascript' ||
    lang === 'jsx' ||
    lang === 'coffeescript' ||
    lang === 'actionscript' ||
    lang === 'css-extr' ||
    lang === 'diff' ||
    lang === 'git' ||
    lang === 'go' ||
    lang === 'graphql' ||
    lang === 'handlebars' ||
    lang === 'json' ||
    lang === 'less' ||
    lang === 'makefile' ||
    lang === 'markdown' ||
    lang === 'objectivec' ||
    lang === 'ocaml' ||
    lang === 'python' ||
    lang === 'reason' ||
    lang === 'sass' ||
    lang === 'scss' ||
    lang === 'sql' ||
    lang === 'stylus' ||
    lang === 'tsx' ||
    lang === 'typescript' ||
    lang === 'wasm' ||
    lang === 'yaml'
  );
}

const CodeBlock: FC<HTMLAttributes<HTMLPreElement>> = ({ children }) => {
  invariant(!!children, 'children is required');
  const id = useId();
  const childrenArray = Children.toArray(children);
  const codeElement = childrenArray[0] as ReactElement;
  const className = codeElement?.props?.className || '';
  const code = codeElement.props.children[0] || '';
  const lang = getLanguageFromClassName(className);
  invariant(isLanguageSupported(lang), `lang is required for codeblock ${code}`);
  return (
    <div className="w-full">
      <Highlight {...defaultProps} code={code.trim()} language={lang || 'bash'}>
        {({ className, tokens, getLineProps, getTokenProps }) => (
          <div
            className="p-2 lg:p-4 rounded-md font-normal text-sm md:text-base w-full"
            style={{
              backgroundColor: 'transparent',
              backgroundImage: 'linear-gradient(to bottom, #2a2139 75%, #34294f)',
            }}
          >
            <div className="flex justify-end">
              <span className="mr-5 text-lg">{lang || 'text'}</span>
              <CopyClipboardButton title="Copy code" content={code} id={id} />
            </div>
            <pre className={`overflow-scroll ${className}`} style={{}}>
              <code className={className} style={{}}>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line, key: i })} style={{}}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token, key })} style={{}} />
                    ))}
                  </div>
                ))}
              </code>
            </pre>
          </div>
        )}
      </Highlight>
    </div>
  );
};

export { CodeBlock };
