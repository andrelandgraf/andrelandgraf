---
date: 2025-07-09
title: Sensible use of MCP today
description: In this blog post, we discuss the Model Context Protocol (MCP), prompt injection attacks, problems with LLM agency, and how to use MCP in production.
categories: [MCP, AI]
---

Tuesday’s top Hacker News post [Supabase MCP can leak your entire SQL database](https://news.ycombinator.com/item?id=44502318) led to discussions about using MCP in production, how to mitigate Prompt Injection attacks, and generally raised alarms in the developer community. [The article from generalanalysis.com](https://www.generalanalysis.com/blog/supabase-mcp-blog) showcases how a developer using Supabase’s MCP integration could accidentally expose sensitive data through a prompt injection attack. Developers were quick to generalize: “You should not use MCP against your production database!” \[[1](https://x.com/sriramsubram/status/1942679382062989750)\].

![A tweet by @sriramsubram stating you should not use MCP against your production database - MCP is useful during development/testing and it ends there](/img?src=/2025-07-09_sensible-use-of-mcp-today/sriram-mcp-prod.png)

In this post, I’ll highlight safe ways to use MCP today, including in production, and discuss where MCP might go next.

## What Is MCP and Why Does It Matter?

Model Context Protocol (MCP) is a protocol allowing Large Language Models (LLMs) to call external tools. An LLM application acts as a client and can be connected to different MCP servers. The servers expose tools, like “query-database,” which the LLM can choose to call during its execution loop.

Current MCP servers are mostly used by developers and typically connected to coding agents (Cursor, Windsurf, etc.) to aid during development. For example, the Browserbase, Neon, Sentry, andSupabase MCP servers can be used to integrate LLM coding agents with the respective services.

For non-developers, MCP could eventually automate daily tasks, like orchestrating email, calendar, and todo apps seamlessly. That’s why MCP is exciting. The protocol lets LLM agents compose external tool calls. However, it’s still early and there is a lot to be learned.

## The Hacker News Story

[The article from generalanalysis.com](https://www.generalanalysis.com/blog/supabase-mcp-blog) describes a prompt injection attack on a Supabase project. In summary, the application allowed users of an application to submit support tickets (user-generated content). A malicious user submits a carefully crafted support message including a prompt to instruct an LLM to query the database and then write the queried data to the support thread in the database.

Later, when a developer uses an AI assistant to review support tickets using the Supabase MCP server, the assistant mistakenly processes the attacker’s message as instructions and updates the support ticket without informing the developer. 

This results in the assistant leaking sensitive data directly into a user-visible ticket thread. The attacker simply refreshes the page and retrieves the leaked data. The real issue here is straightforward: an LLM agent with unrestricted production access may perform harmful actions.

Note that this is not a problem with the Supabase MCP server but with the way LLM applications treat all context as instructions.

## Prompt Injection

Prompt injection occurs when user-generated content tricks an LLM into executing commands. Today's LLMs cannot distinguish between instructions (prompts) and helpful data (context). Both are passed together in a single prompt (or an array of prompts).

Prompt injection mirrors early web vulnerabilities like SQL injection, where unescaped user inputs execute unintended commands. However, unlike SQL injection, prompt injection is difficult to prevent because it lacks deterministic sanitization rules.

## The Broader Risk of LLM Agency

Even without intentional attacks, LLMs may take unpredictable actions. For instance, an agent might be instructed to update the database schema but then autonomously decides to execute additional scripts, like a seed script, potentially causing unintended consequences such as wiping production data. Such unpredictable behaviors underscore a crucial guideline: do not provide LLMs unrestricted access to critical resources or operations.

[![A tweet by @_grantsing stating cursor just deleted my whole database - it ran a script in the repo that was used to seed the database a long time ago, that script wipes the database and writes dummy data to it - fortunately with neon it takes 2 seconds to restore the db to a point in time, but still i was sweating](/img?src=/2025-07-09_sensible-use-of-mcp-today/grantsing-drop-db.png)](https://x.com/_grantsing/status/1942341714225823818)

## Sensible MCP Use Today

Most MCP servers are best used in development, as many have pointed out throughout this discussion. However, even today MCP can be used in production environments - if done right.

### Read-Only Authorization in Production

Some MCP servers offer read-only authorization grants. For instance, [the initial Postgres MCP server](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/postgres) only supports read-only queries. By preventing write-access, prompt injection may still trigger tool calls, but cannot alter the system. Of course, when working with production data, sensitive and thoughtful processing is always required - this is true with and without LLM usage.

Note that if you want to protect yourself against prompt injection, all connected MCP servers must be read-only. Otherwise, the LLM could still chain tool calls to leak data or otherwise harm the system.

### MCP in Production for Codegen Tools

Different production environments may pose varying levels of risk when compromised. Internal tools or ephemeral and personal apps built by codegen agents, for instance, may not face the same threat level as publicly-available applications with sensitive data. Tools like Replit, v0, and same.new build and deploy real applications today. Same.new even utilizes MCP to integrate its apps with Neon.

## Conclusion

Read-only MCP servers and MCP for low-risk applications shows it can already deliver real value in specific cases in production today. At the same time, developers must recognize that LLMs can act harmfully even without prompt injections.

Prompt injection further highlights how early we are in the AI development era - similar to how SQL injection was a common problem in the early days of the internet but has subsequently mostly been rendered void by modern frameworks and abstractions. 

The value MCP offers - LLMs seamlessly orchestrating tools - is substantial. Like how the web matured past SQL injection vulnerabilities, LLM tooling will also evolve. Fine-grained authorization, execution sandboxing, and LLM-level safeguards will inevitably improve. Prompt injection and similar attacks will drive innovations that make LLM applications (and MCP) safer and hopefully, get us closer to [our own personal Jarvis](https://www.epicai.pro/please-make-jarvis).

For now, use MCP cautiously and thoughtfully. Happy coding!
