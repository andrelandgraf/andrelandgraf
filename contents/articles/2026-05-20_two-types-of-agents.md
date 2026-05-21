---
date: 2026-05-20
title: Two types of agents
description: Today's agents fall into two categories. There are declarative agents that live inside your app and sandbox agents that live inside a computer. If you're building an agent, it's important to understand which approach you should use.
categories: [AI, Agents]
---

I've noticed that when developers talk about "agents," we're often talking about different things: Claude Code running in a sandbox vs. an agentic endpoint inside a web app. It's a spectrum but I think we can distinguish two types of agents by now and they're running on different infra and abstraction levels.

## Before agents: an AI endpoint

The thing both types sit on top of is LLM API calls.

Vercel AI SDK example:

```typescript
import { generateText } from "ai";

const { text } = await generateText({
  model: "openai/gpt-5",
  system: "You are a comedian.",
  prompt: "Tell me a joke.",
});
```

Here we call an LLM endpoint (OpenAI GPT-5 in this case) w/ a static prompt. Not quite an agent.

How do LLM API calls turn into agents? You provide your model calls with a harness:

- **Dynamic input prompts** so the LLM reacts to updates in the real world (e.g., user request).
- **Tools** so the model can take real actions instead of only producing
  text (`tools: { getWeather: ... }`).
- **An agent loop** so the model can call a tool, see the result and
  call another (`stopWhen: isStepCount(5)` or whatever stop condition
  you pick).
- **Persistent context** so the model holds onto something between
  calls: conversation history, user preferences, prior decisions, the
  state of a task, etc.

For this, Vercel's AI SDK introduced [ToolLoopAgent](https://ai-sdk.dev/docs/reference/ai-sdk-core/tool-loop-agent) - a small declarative agent abstraction on top of single-step calls like `generateText()`.

```typescript
import { ToolLoopAgent } from "ai";

const agent = new ToolLoopAgent({
  model: "anthropic/claude-sonnet-4.5",
  instructions: "You are a helpful assistant.",
  tools: {
    weather: weatherTool,
    calculator: calculatorTool,
  },
});

const result = await agent.generate({
  prompt: "What is the weather in NYC?",
});

console.log(result.text);
```

This leads us to our first agent type.

## Type 1: Declarative agents

The first type is what the modern TypeScript and Python agent frameworks
ship: a declarative `Agent` constructor that wraps the AI endpoint with a
system prompt, a tool set and a memory/context abstraction. Mastra, the OpenAI
Agents SDK (JS) and the AI SDK's `ToolLoopAgent` (v6+) all look similar here.

Mastra example - almost identical to the AI SDK example above:

```typescript
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const lookupCustomer = createTool({
  id: "lookup-customer",
  description: "Look up a customer by email.",
  inputSchema: z.object({ email: z.string().email() }),
  execute: async ({ input }) => fetchCustomer(input.email),
});

export const supportAgent = new Agent({
  name: "Support Agent",
  instructions: "You handle billing questions. Use tools to look up data.",
  model: "openai/gpt-5",
  memory: new Memory(),
  tools: { lookupCustomer },
});
```

You handcraft the tools to operate on the business entities that
matter. You hand-tune the prompt and configure a memory system. The dev workflow looks similar to building any other type of backend service. In fact, declarative agents are usually integrated in existing (web) applications and are what makes them agentic.

What defines these agents? They run inside your app or a similar JavaScript/Python platform (e.g., Mastra Platform, Next.js server endpoint, etc.) - the same way an HTTP handler does. This is how most agents looked like until end of last year.

But then OpenClaw broke the internet for a few weeks...

## Type 2: Sandbox agents

The second type sits at the other end of the spectrum. Instead of a
curated set of business tools, these agents have direct access to the
system they live on. That means the filesystem, bash, the network and
sometimes a full browser. Coding agents are the obvious examples: Claude Code, the Cursor
CLI, the Codex CLI. You interact with them through a terminal (or an IDE)
and they write to the file system, write & execute code and curl the web.

Of course, you can still decide how much access you want to give these agents but the tendency is full system access for maximum convenience and utility.

The defining feature is that they don't have to wait for you to write a tool. They already have
`grep`, `curl`, `bash`, `sed`, the package manager, etc. If a
task needs a new capability, the agent often just writes itself a script and executes it ad-hoc.

More extreme, these agents can be allowed to iterate on themselves and their own configuration and capabilities. Claude Code reads `CLAUDE.md` and `skills/*` and if you allow it, it can edit
those files between turns. [Pi](https://pi.dev/) takes this
further by design: it's a minimal coding harness whose own primitives
(extensions, skills, prompts, themes) the agent can rewrite on the fly
and hot-reload. And of course, [OpenClaw](https://openclaw.ai/) introduced the concept of `SOUL.md` that you and OpenClaw iterate on together to personalize your AI assistant.

Where declarative agents running in a Bun/Node.js app runtime come with maximum control and precision over the intended use, sandboxed agents trade developer control and precision for creativity. They are ideal for generic knowledge work such as coding.

## Hybrids

Of course these are two ends of a spectrum. In a hybrid setup you can define a declarative agent with a tool that provisions & exposes a VM so that the agent can ssh into a sandbox on demand. The agent itself runs in an app runtime with app-like control over tracing, context and tools but a generic sandbox tool allows the agent to access a remote environment with access to bash, code execution, file system and more. It can't quite edit itself but it can still perform generic knowledge work that way.

An example of such a hybrid architecture is v0, a coding agent platform by Vercel. It runs on Workflow Development Kit on Next.js (declarative agent) but each coding agent instance also has access to a sandbox to execute the code-generated code. That's also the architecture Vercel is recommending when using the AI SDK and Vercel Sandboxes together - [blog post here](https://vercel.com/blog/vercel-sandbox-is-now-generally-available).

## Conclusion

Claude Code in a sandbox vs. the agentic endpoint in my web app - You need both. I just shipped homebrewtales.com - a table-top app. Here I run Claude Code for atmospheric music generation (writes Python, uploads an MP3, done) in sandboxes on Vercel. However, I also host a few agents on Mastra for the in-game game-master and player companions (session memory, character sheet access, a handful of DnD tools like roll dice or post to session chat).

You don't want your legal-review agent to override its own SOUL.md file but you also need your coding agent to be creative, compose CLIs and access a browser. Pick the type that fits the task and you'll likely find use cases for both declarative and generic agents.

Happy coding!
